import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS, formatPrice, shippingFor } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Grandma's Vintage Jewelry" },
      { name: "description", content: "Review the vintage pieces in your cart before checkout." },
      { property: "og:title", content: "Your Cart" },
      { property: "og:description", content: "Review the vintage pieces in your cart." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const shipping = shippingFor(cart.subtotalCents, settings);

  return (
    <StoreLayout>
      <PageHeader title="Your Cart" />
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        {cart.items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
            <Button asChild className="mt-6 rounded-none">
              <Link to="/shop">Shop the Collection</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr]">
            <ul className="divide-y border-t border-b">
              {cart.items.map((item) => (
                <li key={item.productId} className="flex gap-5 py-6">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="h-28 w-28 border object-cover"
                  />
                  <div className="flex-1">
                    <Link
                      to="/product/$slug"
                      params={{ slug: item.slug }}
                      className="font-serif hover:text-gold text-xl"
                    >
                      {item.title}
                    </Link>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatPrice(item.priceCents)}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <div className="flex items-center border">
                        <button
                          type="button"
                          aria-label="Decrease quantity"
                          className="hover:bg-muted px-2 py-1"
                          onClick={() => cart.setQuantity(item.productId, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          type="button"
                          aria-label="Increase quantity"
                          disabled={item.quantity >= item.maxQuantity}
                          className="hover:bg-muted px-2 py-1 disabled:opacity-30"
                          onClick={() => cart.setQuantity(item.productId, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs"
                        onClick={() => cart.remove(item.productId)}
                      >
                        <X className="h-3 w-3" /> Remove
                      </button>
                    </div>
                  </div>
                  <p className="text-sm">{formatPrice(item.priceCents * item.quantity)}</p>
                </li>
              ))}
            </ul>

            <aside className="bg-cream h-fit border p-6">
              <h2 className="font-serif text-2xl">Order Summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
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
                  <dd>{formatPrice(cart.subtotalCents + shipping)}</dd>
                </div>
              </dl>
              <Button asChild className="tracking-widest-xs mt-6 w-full rounded-none text-[0.7rem] uppercase">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
            </aside>
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
