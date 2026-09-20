import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/store";

const NAV = [
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/shipping-returns", label: "Shipping & Returns" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const cart = useCart();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);

  return (
    <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          type="button"
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex flex-col items-center md:items-start">
          <span className="font-serif text-xl leading-none sm:text-2xl">{settings.store_name}</span>
          <span className="text-muted-foreground tracking-widest-xs mt-1 hidden text-[0.6rem] uppercase sm:block">
            Collected &amp; Curated
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="tracking-widest-xs hover:text-gold text-[0.7rem] uppercase transition-colors"
              activeProps={{ className: "text-gold" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => cart.setOpen(true)}
          className="hover:text-gold relative flex items-center gap-2 transition-colors"
          aria-label="Open cart"
        >
          <ShoppingBag className="h-5 w-5" />
          {cart.count > 0 && (
            <span className="bg-gold text-background absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem]">
              {cart.count}
            </span>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t md:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="tracking-widest-xs block border-b py-3 text-[0.7rem] uppercase last:border-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
