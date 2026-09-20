import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS, formatPrice, shippingFor } from "@/lib/store";
import { checkStock, placeOrder } from "@/lib/checkout.functions";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Grandma's Vintage Jewelry" },
      { name: "description", content: "Complete your order of vintage jewelry pieces." },
      { property: "og:title", content: "Checkout" },
      { property: "og:description", content: "Complete your order of vintage jewelry pieces." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Checkout,
});

const EMPTY = {
  name: "",
  email: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  postal_code: "",
  country: "United States",
  notes: "",
};

function Checkout() {
  const cart = useCart();
  const navigate = useNavigate();
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const submitOrder = useServerFn(placeOrder);
  const verifyStock = useServerFn(checkStock);
  const [form, setForm] = React.useState(EMPTY);
  const [submitting, setSubmitting] = React.useState(false);
  const [stockNote, setStockNote] = React.useState<string | null>(null);

  const shipping = shippingFor(cart.subtotalCents, settings);
  const total = cart.subtotalCents + shipping;

  // Re-check live stock whenever the checkout page opens.
  React.useEffect(() => {
    if (cart.items.length === 0) return;
    let cancelled = false;
    void (async () => {
      try {
        const rows = await verifyStock({ data: { productIds: cart.items.map((i) => i.productId) } });
        if (cancelled) return;
        const problems: string[] = [];
        for (const item of cart.items) {
          const row = rows.find((r) => r.id === item.productId);
          const available = row?.available ?? 0;
          if (available < item.quantity) {
            problems.push(item.title);
            cart.setQuantity(item.productId, available);
          }
        }
        setStockNote(
          problems.length
            ? `${problems.join(", ")} ${problems.length === 1 ? "is" : "are"} no longer available in the quantity requested, so your cart was updated.`
            : null,
        );
      } catch {
        /* keep the cart as-is if the check fails */
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function update(field: keyof typeof EMPTY, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (cart.items.length === 0) return;
    setSubmitting(true);
    try {
      const result = await submitOrder({
        data: {
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone,
            address_line1: form.address_line1,
            address_line2: form.address_line2,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country,
            notes: form.notes,
          },
          items: cart.items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        },
      });

      if (!result.ok) {
        toast.error(result.error);
        if (result.unavailable) {
          for (const entry of result.unavailable) {
            cart.setQuantity(entry.productId, entry.available);
          }
        }
        return;
      }

      const orderNumber = result.orderNumber;
      cart.clear();
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
        return;
      }
      toast.success("Order placed");
      void navigate({ to: "/order/$orderNumber", params: { orderNumber } });
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong placing your order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (cart.items.length === 0) {
    return (
      <StoreLayout>
        <PageHeader title="Checkout" />
        <div className="mx-auto max-w-xl px-4 py-20 text-center">
          <p className="text-muted-foreground text-sm">There is nothing in your cart yet.</p>
          <Button asChild className="mt-6 rounded-none">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout>
      <PageHeader title="Checkout" />
      <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {stockNote && (
          <p className="border-gold-soft mb-8 border px-4 py-3 text-sm">{stockNote}</p>
        )}

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-10">
            <section>
              <h2 className="font-serif text-2xl">Your details</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" required value={form.name} onChange={(v) => update("name", v)} />
                <Field
                  label="Email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(v) => update("email", v)}
                />
                <Field label="Phone (optional)" value={form.phone} onChange={(v) => update("phone", v)} />
              </div>
            </section>

            <section>
              <h2 className="font-serif text-2xl">Shipping address</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field
                    label="Address"
                    required
                    value={form.address_line1}
                    onChange={(v) => update("address_line1", v)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Apartment, suite (optional)"
                    value={form.address_line2}
                    onChange={(v) => update("address_line2", v)}
                  />
                </div>
                <Field label="City" required value={form.city} onChange={(v) => update("city", v)} />
                <Field label="State / region" value={form.state} onChange={(v) => update("state", v)} />
                <Field
                  label="Postal code"
                  required
                  value={form.postal_code}
                  onChange={(v) => update("postal_code", v)}
                />
                <Field label="Country" required value={form.country} onChange={(v) => update("country", v)} />
              </div>
              <div className="mt-4">
                <Label className="text-muted-foreground tracking-widest-xs text-[0.62rem] uppercase">
                  Order notes (optional)
                </Label>
                <Textarea
                  value={form.notes}
                  onChange={(event) => update("notes", event.target.value)}
                  className="mt-2 rounded-none"
                  rows={3}
                />
              </div>
            </section>
          </div>

          <aside className="bg-cream h-fit border p-6">
            <h2 className="font-serif text-2xl">Order summary</h2>
            <ul className="mt-5 space-y-4">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-3">
                  <img src={item.image} alt="" loading="lazy" className="h-14 w-14 border object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{item.title}</p>
                    <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm">{formatPrice(item.priceCents * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(cart.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 font-serif text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <Button
              type="submit"
              disabled={submitting}
              className="tracking-widest-xs mt-6 w-full rounded-none text-[0.7rem] uppercase"
            >
              {submitting ? "Placing order…" : "Place order"}
            </Button>
            <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
              Stock is verified again the moment you place your order, so a piece that has just sold
              can never be ordered twice. Card payment runs through Stripe as soon as the shop owner
              adds their Stripe key; until then orders are recorded as awaiting payment and the owner
              follows up by email.
            </p>
          </aside>
        </div>
      </form>
    </StoreLayout>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <Label className="text-muted-foreground tracking-widest-xs text-[0.62rem] uppercase">
        {label}
      </Label>
      <Input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 rounded-none"
      />
    </div>
  );
}
