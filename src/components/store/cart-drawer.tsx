import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS, formatPrice, shippingFor } from "@/lib/store";

export function CartDrawer() {
  const cart = useCart();
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const shipping = shippingFor(cart.subtotalCents, settings);

  return (
    <Sheet open={cart.open} onOpenChange={cart.setOpen}>
      <SheetContent className="bg-background flex w-full flex-col gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b px-6 py-5">
          <SheetTitle className="font-serif text-2xl font-normal">Your Cart</SheetTitle>
        </SheetHeader>

        {cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-muted-foreground text-sm">Your cart is empty.</p>
            <Button asChild variant="outline" onClick={() => cart.setOpen(false)}>
              <Link to="/shop">Shop the Collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y">
                {cart.items.map((item) => (
                  <li key={item.productId} className="flex gap-4 py-4">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="border-border h-20 w-20 shrink-0 border object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to="/product/$slug"
                        params={{ slug: item.slug }}
                        onClick={() => cart.setOpen(false)}
                        className="font-serif hover:text-gold block truncate text-lg"
                      >
                        {item.title}
                      </Link>
                      <p className="text-muted-foreground text-sm">{formatPrice(item.priceCents)}</p>
                      <div className="mt-2 flex items-center gap-3">
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
                          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
                          onClick={() => cart.remove(item.productId)}
                        >
                          Remove
                        </button>
                      </div>
                      {item.oneOfAKind && (
                        <p className="text-gold mt-1 text-[0.68rem] tracking-widest-xs uppercase">
                          One of a Kind
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${item.title}`}
                      className="text-muted-foreground hover:text-foreground h-fit"
                      onClick={() => cart.remove(item.productId)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 border-t px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(cart.subtotalCents)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t pt-3 font-serif text-lg">
                <span>Total</span>
                <span>{formatPrice(cart.subtotalCents + shipping)}</span>
              </div>
              <Button asChild className="w-full" onClick={() => cart.setOpen(false)}>
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => cart.setOpen(false)}>
                <Link to="/cart">View Cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
