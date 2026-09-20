import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Ornament } from "@/components/store/ornament";
import { useCart } from "@/lib/cart";
import { productQuery, settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS, formatPrice, isNewListing, sortedImages } from "@/lib/store";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const readable = params.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      meta: [
        { title: `${readable} | Grandma's Vintage Jewelry` },
        {
          name: "description",
          content: `${readable} — a vintage piece from the family collection at Grandma's Vintage Jewelry.`,
        },
        { property: "og:title", content: readable },
        {
          property: "og:description",
          content: `${readable} — a vintage piece from the family collection.`,
        },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const { data: product, isLoading } = useQuery(productQuery(slug));
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const [active, setActive] = React.useState(0);
  const [zoom, setZoom] = React.useState(false);
  const [origin, setOrigin] = React.useState({ x: 50, y: 50 });

  if (isLoading) {
    return (
      <StoreLayout>
        <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2">
          <Skeleton className="aspect-square w-full" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </StoreLayout>
    );
  }

  if (!product) {
    return (
      <StoreLayout>
        <div className="mx-auto max-w-xl px-4 py-32 text-center">
          <h1 className="font-serif text-3xl">This piece isn't available</h1>
          <p className="text-muted-foreground mt-3 text-sm">
            It may have sold or the link may be out of date.
          </p>
          <Button asChild className="mt-8 rounded-none">
            <Link to="/shop">Back to the collection</Link>
          </Button>
        </div>
      </StoreLayout>
    );
  }

  const images = sortedImages(product);
  const soldOut = product.quantity <= 0 || !product.published;
  const inCart = cart.items.find((i) => i.productId === product.id)?.quantity ?? 0;
  const canAdd = !soldOut && inCart < product.quantity;

  const cartPayload = {
    productId: product.id,
    slug: product.slug,
    title: product.title,
    priceCents: product.price_cents,
    image: images[0].url,
    maxQuantity: product.quantity,
    oneOfAKind: product.one_of_a_kind,
  };

  const specs = [
    ["Condition", product.condition],
    ["Approximate dimensions", product.dimensions],
    ["Materials", product.materials],
    ["Brand", product.brand],
    ["Era / age", product.era],
  ].filter(([, value]) => value);

  return (
    <StoreLayout>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Link
          to="/shop"
          className="text-muted-foreground hover:text-gold inline-flex items-center gap-1 text-xs"
        >
          <ChevronLeft className="h-3 w-3" /> Back to the collection
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2">
          {/* Gallery */}
          <div>
            <div
              className="bg-cream relative aspect-square cursor-zoom-in overflow-hidden border"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setOrigin({
                  x: ((event.clientX - rect.left) / rect.width) * 100,
                  y: ((event.clientY - rect.top) / rect.height) * 100,
                });
              }}
              onClick={() => setZoom((z) => !z)}
            >
              <img
                src={images[active].url}
                alt={product.title}
                width={1024}
                height={1024}
                className="h-full w-full object-cover transition-transform duration-300"
                style={{
                  transform: zoom ? "scale(2)" : "scale(1)",
                  transformOrigin: `${origin.x}% ${origin.y}%`,
                }}
              />
              <span className="bg-background/85 text-muted-foreground absolute right-3 bottom-3 px-2 py-1 text-[0.6rem] uppercase tracking-widest-xs">
                Hover to zoom
              </span>
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-3">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`aspect-square overflow-hidden border ${
                      index === active ? "border-gold" : "border-border"
                    }`}
                    aria-label={`View photo ${index + 1}`}
                  >
                    <img
                      src={image.url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <p className="text-muted-foreground tracking-widest-xs text-[0.62rem] uppercase">
              {product.category}
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight">{product.title}</h1>
            <p className="mt-4 text-2xl">{formatPrice(product.price_cents)}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {product.one_of_a_kind && <Tag>One of a Kind</Tag>}
              {isNewListing(product.created_at) && <Tag>New Listing</Tag>}
              {product.is_sample && <Tag>Sample listing</Tag>}
            </div>

            {soldOut ? (
              <p className="border-border bg-muted mt-6 border px-4 py-3 text-sm">
                This piece has sold and is no longer available.
              </p>
            ) : product.quantity <= 2 ? (
              <p className="border-gold-soft mt-6 border px-4 py-3 text-sm">
                {product.quantity === 1
                  ? "Only one available — once it sells, this listing closes."
                  : `Only ${product.quantity} left.`}
              </p>
            ) : null}

            {product.description && (
              <p className="text-muted-foreground mt-6 text-sm leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            )}

            <Ornament className="my-8" />

            {specs.length > 0 && (
              <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground tracking-widest-xs text-[0.6rem] uppercase">
                      {label}
                    </dt>
                    <dd className="mt-1">{value}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-muted-foreground tracking-widest-xs text-[0.6rem] uppercase">
                    Quantity available
                  </dt>
                  <dd className="mt-1">{Math.max(0, product.quantity)}</dd>
                </div>
              </dl>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                className="tracking-widest-xs flex-1 rounded-none text-[0.7rem] uppercase"
                disabled={!canAdd}
                onClick={() => {
                  cart.add(cartPayload);
                  cart.setOpen(true);
                  toast.success("Added to your cart");
                }}
              >
                {soldOut ? "Sold" : canAdd ? "Add to Cart" : "Already in your cart"}
              </Button>
              <Button
                variant="outline"
                className="tracking-widest-xs flex-1 rounded-none bg-transparent text-[0.7rem] uppercase"
                disabled={soldOut || (inCart === 0 && !canAdd)}
                onClick={() => {
                  if (canAdd) cart.add(cartPayload);
                  navigate({ to: "/checkout" });
                }}
              >
                Buy Now
              </Button>
            </div>

            <p className="text-muted-foreground mt-6 text-xs leading-relaxed">
              Shipping is a flat {formatPrice(settings.shipping_flat_cents)}
              {settings.free_shipping_over_cents > 0
                ? `, free on orders over ${formatPrice(settings.free_shipping_over_cents)}`
                : ""}
              . Orders are packed by hand and posted with tracking. See{" "}
              <Link to="/shipping-returns" className="underline underline-offset-4">
                Shipping &amp; Returns
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-gold-soft tracking-widest-xs border px-2 py-1 text-[0.58rem] uppercase">
      {children}
    </span>
  );
}
