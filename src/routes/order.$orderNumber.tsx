import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/lib/checkout.functions";
import { formatPrice } from "@/lib/store";

export const Route = createFileRoute("/order/$orderNumber")({
  head: () => ({
    meta: [
      { title: "Order Confirmation | Grandma's Vintage Jewelry" },
      { name: "description", content: "Your order details and confirmation." },
      { property: "og:title", content: "Order Confirmation" },
      { property: "og:description", content: "Your order details and confirmation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderPage,
});

function OrderPage() {
  const { orderNumber } = Route.useParams();
  const fetchOrder = useServerFn(getOrderByNumber);
  const { data: order, isLoading } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => fetchOrder({ data: { orderNumber } }),
  });

  return (
    <StoreLayout>
      <PageHeader title="Thank you" intro={`Order ${orderNumber}`} />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        {isLoading ? (
          <p className="text-muted-foreground text-center text-sm">Loading your order…</p>
        ) : !order ? (
          <p className="text-muted-foreground text-center text-sm">
            We couldn't find that order number.
          </p>
        ) : (
          <div className="border p-6">
            <p className="text-sm">
              Thank you, {order.customer_name}. A confirmation has been noted for {order.email}.
            </p>
            <ul className="mt-6 divide-y border-t border-b">
              {(order.order_items ?? []).map((item, index) => (
                <li key={index} className="flex items-center gap-4 py-4">
                  {item.image_url && (
                    <img src={item.image_url} alt="" loading="lazy" className="h-14 w-14 border object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-serif text-lg">{item.title}</p>
                    <p className="text-muted-foreground text-xs">Qty {item.quantity}</p>
                  </div>
                  <p className="text-sm">{formatPrice(item.unit_price_cents * item.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatPrice(order.subtotal_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd>{order.shipping_cents === 0 ? "Free" : formatPrice(order.shipping_cents)}</dd>
              </div>
              <div className="flex justify-between border-t pt-2 font-serif text-lg">
                <dt>Total</dt>
                <dd>{formatPrice(order.total_cents)}</dd>
              </div>
              <div className="flex justify-between pt-2">
                <dt className="text-muted-foreground">Payment</dt>
                <dd>{order.payment_status.replace(/_/g, " ")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Fulfillment</dt>
                <dd>{order.fulfillment_status}</dd>
              </div>
              {order.tracking_number && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tracking</dt>
                  <dd>{order.tracking_number}</dd>
                </div>
              )}
            </dl>
            <Button asChild variant="outline" className="mt-8 w-full rounded-none bg-transparent">
              <Link to="/shop">Keep browsing</Link>
            </Button>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
