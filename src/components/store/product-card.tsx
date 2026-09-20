import { Link } from "@tanstack/react-router";
import { formatPrice, isNewListing, primaryImage, type Product } from "@/lib/store";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = product.quantity <= 0;

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
      aria-label={product.title}
    >
      <div className="bg-cream relative aspect-square overflow-hidden border">
        <img
          src={primaryImage(product)}
          alt={product.title}
          loading="lazy"
          width={1024}
          height={1024}
          className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
            soldOut ? "opacity-60" : ""
          }`}
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1">
          {product.one_of_a_kind && <Badge>One of a Kind</Badge>}
          {isNewListing(product.created_at) && <Badge>New Listing</Badge>}
          {product.is_sample && <Badge>Sample</Badge>}
        </div>
        {soldOut && (
          <div className="bg-ink/80 text-background absolute inset-x-0 bottom-0 py-2 text-center text-[0.68rem] tracking-widest-xs uppercase">
            Sold
          </div>
        )}
      </div>

      <div className="mt-4 text-center">
        <p className="text-muted-foreground tracking-widest-xs text-[0.62rem] uppercase">
          {product.category}
        </p>
        <h3 className="font-serif group-hover:text-gold mt-1 text-lg transition-colors">
          {product.title}
        </h3>
        <p className="mt-1 text-sm">{formatPrice(product.price_cents)}</p>
      </div>
    </Link>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-background/90 text-ink border-gold-soft tracking-widest-xs border px-2 py-1 text-[0.58rem] uppercase">
      {children}
    </span>
  );
}
