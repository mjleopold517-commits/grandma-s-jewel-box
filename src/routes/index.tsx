import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Gem, HeartHandshake, Package } from "lucide-react";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { Ornament, SectionLabel } from "@/components/store/ornament";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { productsQuery } from "@/lib/queries";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Grandma's Vintage Jewelry | Vintage Pieces With a Story" },
      {
        name: "description",
        content:
          "Explore a carefully collected selection of vintage jewelry, brooches, necklaces, pins, and unique pieces.",
      },
      { property: "og:title", content: "Grandma's Vintage Jewelry" },
      {
        property: "og:description",
        content:
          "A carefully collected selection of vintage jewelry, brooches, necklaces, pins, and unique pieces.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Grandma's Vintage Jewelry",
          description:
            "A carefully collected selection of vintage jewelry, brooches, necklaces, pins, and unique pieces.",
        }),
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products, isLoading } = useQuery(productsQuery);
  const featured = (products ?? []).filter((p) => p.featured).slice(0, 3);
  const fallback = (products ?? []).slice(0, 3);
  const shown = featured.length ? featured : fallback;

  return (
    <StoreLayout>
      {/* Hero */}
      <section className="relative">
        <div className="bg-cream relative min-h-[560px] overflow-hidden">
          <img
            src="/products/pearl-set.jpg"
            alt="A collection of vintage jewelry arranged on ivory linen"
            width={1024}
            height={1024}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="from-background/95 via-background/70 absolute inset-0 bg-gradient-to-r to-transparent" />
          <div className="relative mx-auto flex min-h-[560px] max-w-6xl items-center px-4 py-20 sm:px-6">
            <div className="max-w-xl">
              <SectionLabel>Collected over a lifetime</SectionLabel>
              <h1 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
                Vintage Pieces
                <br />
                With a Story
              </h1>
              <p className="text-muted-foreground mt-6 max-w-md text-base leading-relaxed">
                Explore a carefully collected selection of vintage jewelry, brooches, necklaces,
                pins, and unique pieces.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="tracking-widest-xs rounded-none text-[0.7rem] uppercase">
                  <Link to="/shop">Shop the Collection</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="tracking-widest-xs rounded-none bg-transparent text-[0.7rem] uppercase"
                >
                  <Link to="/about">About the Collection</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="text-center">
          <SectionLabel>Recently Added</SectionLabel>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Featured Pieces</h2>
          <Ornament className="mt-5" />
        </div>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="aspect-square w-full" />)
            : shown.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="tracking-widest-xs rounded-none bg-transparent text-[0.7rem] uppercase">
            <Link to="/shop">View Everything</Link>
          </Button>
        </div>
      </section>

      {/* One of a Kind */}
      <section className="bg-ink text-background">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <p className="tracking-widest-xs text-gold text-[0.68rem] uppercase">One of a Kind</p>
          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Each listing is a single piece
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed opacity-80">
            Nothing here is restocked. Every item is listed individually with its own photographs
            and description, so once a piece finds a new home, that listing closes for good.
          </p>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            <Feature
              icon={<Gem className="text-gold mx-auto h-6 w-6" />}
              title="Single quantity"
              body="Most listings hold exactly one piece. Stock is checked again at checkout."
            />
            <Feature
              icon={<HeartHandshake className="text-gold mx-auto h-6 w-6" />}
              title="Described honestly"
              body="Condition, size and materials are written exactly as they are known — nothing more."
            />
            <Feature
              icon={<Package className="text-gold mx-auto h-6 w-6" />}
              title="Packed with care"
              body="Every order is wrapped by hand and posted with tracking."
            />
          </div>
        </div>
      </section>

      {/* About teaser */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="border-gold-soft relative border p-2">
            <img
              src="/products/brooch-floral.jpg"
              alt="A gold-tone floral brooch from the family collection"
              loading="lazy"
              width={1024}
              height={1024}
              className="aspect-4/3 w-full object-cover"
            />
          </div>
          <div>
            <SectionLabel>About the Collection</SectionLabel>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">A family collection, shared</h2>
            <p className="text-muted-foreground mt-5 text-sm leading-relaxed">
              These pieces were gathered over decades — kept in drawers, boxes and tins, worn to
              weddings and Sunday lunches, and passed down through the family. Rather than let them
              sit unseen, we are listing them one by one so they can be worn again.
            </p>
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              We are not jewelers or appraisers. We describe what we can see and what we know, and
              we say plainly when the maker, materials or age are simply unknown.
            </p>
            <Button asChild variant="outline" className="tracking-widest-xs mt-8 rounded-none bg-transparent text-[0.7rem] uppercase">
              <Link to="/about">Read the Full Story</Link>
            </Button>
          </div>
        </div>
      </section>
    </StoreLayout>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      {icon}
      <h3 className="mt-4 font-serif text-xl">{title}</h3>
      <p className="mt-2 text-sm opacity-75">{body}</p>
    </div>
  );
}
