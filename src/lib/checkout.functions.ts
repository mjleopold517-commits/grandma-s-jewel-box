import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().min(1).max(120),
    email: z.string().email().max(160),
    phone: z.string().max(40).default(""),
    address_line1: z.string().min(1).max(160),
    address_line2: z.string().max(160).default(""),
    city: z.string().min(1).max(80),
    state: z.string().max(80).default(""),
    postal_code: z.string().min(1).max(30),
    country: z.string().min(1).max(80),
    notes: z.string().max(600).default(""),
  }),
  items: z
    .array(z.object({ productId: z.string().uuid(), quantity: z.number().int().min(1).max(20) }))
    .min(1)
    .max(30),
});

export type CheckoutResult =
  | { ok: true; orderNumber: string; total: number; paymentUrl: string | null }
  | { ok: false; error: string; unavailable?: { productId: string; available: number }[] };

function makeOrderNumber() {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GVJ-${stamp}-${random}`;
}

/** Re-checks live stock for the given products before the cart or checkout is submitted. */
export const checkStock = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ productIds: z.array(z.string().uuid()).max(30) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("products")
      .select("id,quantity,published,price_cents,title")
      .in("id", data.productIds);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => ({
      id: r.id,
      available: r.published ? r.quantity : 0,
      priceCents: r.price_cents,
      title: r.title,
    }));
  });

/** Creates the order, enforcing live stock so sold items cannot be double-ordered. */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => checkoutSchema.parse(data))
  .handler(async ({ data }): Promise<CheckoutResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = data.items.map((i) => i.productId);
    const { data: products, error: productError } = await supabaseAdmin
      .from("products")
      .select("id,title,price_cents,quantity,published,product_images(url,position)")
      .in("id", ids);
    if (productError) return { ok: false, error: productError.message };

    const unavailable: { productId: string; available: number }[] = [];
    for (const item of data.items) {
      const product = products?.find((p) => p.id === item.productId);
      if (!product || !product.published || product.quantity < item.quantity) {
        unavailable.push({ productId: item.productId, available: product?.quantity ?? 0 });
      }
    }
    if (unavailable.length) {
      return {
        ok: false,
        error: "Some pieces in your cart are no longer available in the quantity requested.",
        unavailable,
      };
    }

    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("shipping_flat_cents,free_shipping_over_cents")
      .maybeSingle();

    const subtotal = data.items.reduce((sum, item) => {
      const product = products!.find((p) => p.id === item.productId)!;
      return sum + product.price_cents * item.quantity;
    }, 0);

    const flat = settings?.shipping_flat_cents ?? 800;
    const freeOver = settings?.free_shipping_over_cents ?? 0;
    const shipping = freeOver > 0 && subtotal >= freeOver ? 0 : flat;
    const total = subtotal + shipping;
    const orderNumber = makeOrderNumber();

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        address_line1: data.customer.address_line1,
        address_line2: data.customer.address_line2,
        city: data.customer.city,
        state: data.customer.state,
        postal_code: data.customer.postal_code,
        country: data.customer.country,
        notes: data.customer.notes,
        subtotal_cents: subtotal,
        shipping_cents: shipping,
        total_cents: total,
        payment_status: "awaiting_payment",
        fulfillment_status: "New",
      })
      .select("id")
      .single();
    if (orderError || !order) return { ok: false, error: orderError?.message ?? "Could not create order." };

    const itemRows = data.items.map((item) => {
      const product = products!.find((p) => p.id === item.productId)!;
      const images = [...(product.product_images ?? [])].sort((a, b) => a.position - b.position);
      return {
        order_id: order.id,
        product_id: product.id,
        title: product.title,
        unit_price_cents: product.price_cents,
        quantity: item.quantity,
        image_url: images[0]?.url ?? "",
      };
    });
    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(itemRows);
    if (itemsError) return { ok: false, error: itemsError.message };

    // Reserve the stock so one-of-a-kind pieces cannot be bought twice.
    for (const item of data.items) {
      const product = products!.find((p) => p.id === item.productId)!;
      await supabaseAdmin
        .from("products")
        .update({ quantity: Math.max(0, product.quantity - item.quantity) })
        .eq("id", product.id)
        .gte("quantity", item.quantity);
    }

    // Stripe Checkout: active as soon as the STRIPE_SECRET_KEY secret is set.
    let paymentUrl: string | null = null;
    const stripeKey = process.env["STRIPE_SECRET_KEY"];
    const origin = process.env["PUBLIC_SITE_URL"] ?? "";
    if (stripeKey) {
      try {
        const body = new URLSearchParams();
        body.set("mode", "payment");
        body.set("customer_email", data.customer.email);
        body.set("client_reference_id", orderNumber);
        body.set("success_url", `${origin}/order/${orderNumber}?paid=1`);
        body.set("cancel_url", `${origin}/checkout`);
        itemRows.forEach((row, index) => {
          body.set(`line_items[${index}][quantity]`, String(row.quantity));
          body.set(`line_items[${index}][price_data][currency]`, "usd");
          body.set(`line_items[${index}][price_data][unit_amount]`, String(row.unit_price_cents));
          body.set(`line_items[${index}][price_data][product_data][name]`, row.title);
        });
        if (shipping > 0) {
          const index = itemRows.length;
          body.set(`line_items[${index}][quantity]`, "1");
          body.set(`line_items[${index}][price_data][currency]`, "usd");
          body.set(`line_items[${index}][price_data][unit_amount]`, String(shipping));
          body.set(`line_items[${index}][price_data][product_data][name]`, "Shipping");
        }
        const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${stripeKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body,
        });
        const session = (await response.json()) as { url?: string; id?: string };
        if (session.url) {
          paymentUrl = session.url;
          await supabaseAdmin
            .from("orders")
            .update({ payment_status: "pending_stripe" })
            .eq("id", order.id);
        }
      } catch (error) {
        console.error("Stripe checkout session failed", error);
      }
    }

    return { ok: true, orderNumber, total, paymentUrl };
  });

/** Public lookup of a single order by its order number, for the confirmation page. */
export const getOrderByNumber = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ orderNumber: z.string().min(4).max(40) }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select(
        "order_number,customer_name,email,city,state,country,subtotal_cents,shipping_cents,total_cents,payment_status,fulfillment_status,tracking_number,created_at,order_items(title,quantity,unit_price_cents,image_url)",
      )
      .eq("order_number", data.orderNumber)
      .maybeSingle();
    return order ?? null;
  });
