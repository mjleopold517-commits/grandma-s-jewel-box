import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { productsQuery } from "@/lib/queries";
import { CATEGORIES } from "@/lib/store";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop the Collection | Grandma's Vintage Jewelry" },
      {
        name: "description",
        content:
          "Browse vintage brooches, necklaces, earrings, bracelets, rings and sets — each listed individually.",
      },
      { property: "og:title", content: "Shop the Collection" },
      {
        property: "og:description",
        content: "Browse vintage brooches, necklaces, earrings, bracelets, rings and sets.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Shop,
});

type SortKey = "newest" | "price-asc" | "price-desc";

function Shop() {
  const { data: products, isLoading } = useQuery(productsQuery);
  const [category, setCategory] = React.useState<string>("All");
  const [sort, setSort] = React.useState<SortKey>("newest");

  const visible = React.useMemo(() => {
    let list = [...(products ?? [])];
    if (category !== "All") list = list.filter((p) => p.category === category);
    if (sort === "price-asc") list.sort((a, b) => a.price_cents - b.price_cents);
    else if (sort === "price-desc") list.sort((a, b) => b.price_cents - a.price_cents);
    else list.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    return list;
  }, [products, category, sort]);

  return (
    <StoreLayout>
      <PageHeader
        title="Shop the Collection"
        intro="Every piece is listed on its own. When a listing sells, it is gone for good."
      />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`tracking-widest-xs border px-3 py-2 text-[0.62rem] uppercase transition-colors ${
                  category === item
                    ? "bg-ink text-background border-ink"
                    : "border-border hover:border-gold hover:text-gold"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-muted-foreground tracking-widest-xs text-[0.62rem] uppercase">
              Sort
            </span>
            <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
              <SelectTrigger className="w-52 rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: low to high</SelectItem>
                <SelectItem value="price-desc">Price: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-muted-foreground mt-6 text-xs">
          {isLoading ? "Loading pieces…" : `${visible.length} piece${visible.length === 1 ? "" : "s"}`}
        </p>

        {isLoading ? (
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <p className="text-muted-foreground py-24 text-center text-sm">
            No pieces in this category just yet. Please check back soon.
          </p>
        ) : (
          <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
