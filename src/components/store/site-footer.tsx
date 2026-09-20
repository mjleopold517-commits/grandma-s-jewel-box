import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Facebook, Instagram } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/store";
import { Ornament } from "./ornament";

export function SiteFooter() {
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);

  return (
    <footer className="bg-ink text-background mt-24">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <p className="font-serif text-2xl">{settings.store_name}</p>
          <Ornament className="mt-4 opacity-80" />
        </div>

        <div className="mt-12 grid gap-10 text-sm sm:grid-cols-3">
          <div>
            <p className="tracking-widest-xs text-gold text-[0.68rem] uppercase">Explore</p>
            <ul className="mt-4 space-y-2 opacity-85">
              <li>
                <Link to="/shop" className="hover:text-gold">
                  Shop the Collection
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold">
                  About the Collection
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-gold">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="tracking-widest-xs text-gold text-[0.68rem] uppercase">Customer Care</p>
            <ul className="mt-4 space-y-2 opacity-85">
              <li>
                <Link to="/shipping-returns" className="hover:text-gold">
                  Shipping &amp; Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-gold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-gold">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-gold">
                  Owner Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="tracking-widest-xs text-gold text-[0.68rem] uppercase">Get in Touch</p>
            <ul className="mt-4 space-y-2 opacity-85">
              <li>
                <a href={`mailto:${settings.owner_email}`} className="hover:text-gold">
                  {settings.owner_email}
                </a>
              </li>
              {settings.contact_phone && <li>{settings.contact_phone}</li>}
            </ul>
            <div className="mt-4 flex gap-4">
              {settings.instagram_url && (
                <a href={settings.instagram_url} aria-label="Instagram" className="hover:text-gold">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} aria-label="Facebook" className="hover:text-gold">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <p className="mt-12 border-t border-white/15 pt-6 text-center text-xs opacity-60">
          &copy; {new Date().getFullYear()} {settings.store_name}. Every piece is described exactly as
          it was found in the family collection.
        </p>
      </div>
    </footer>
  );
}
