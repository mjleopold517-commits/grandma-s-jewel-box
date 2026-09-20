import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CartDrawer } from "./cart-drawer";

export function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <div className="bg-cream border-b">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-serif text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-sm">{intro}</p>}
      </div>
    </div>
  );
}
