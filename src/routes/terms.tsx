import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Grandma's Vintage Jewelry" },
      { name: "description", content: "The terms that apply when you order from this shop." },
      { property: "og:title", content: "Terms of Service" },
      { property: "og:description", content: "The terms that apply when you order from this shop." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <StoreLayout>
      <PageHeader title="Terms of Service" />
      <article className="mx-auto max-w-2xl space-y-6 px-4 py-14 text-sm leading-relaxed sm:px-6">
        <p>
          By placing an order you agree to these terms. Prices are shown in US dollars and include
          the item only; shipping is added at checkout.
        </p>
        <p>
          Most listings hold a single piece. Availability is confirmed again at the moment an order is
          placed, so if a piece sells first we will contact you and refund any payment in full.
        </p>
        <p>
          Every item is pre-owned and sold as described. Descriptions reflect what is known about
          each piece; where the maker, materials or age are unknown, the listing says so and no claim
          is made about authenticity, metal content or gemstones.
        </p>
        <p>
          Returns are accepted under the conditions set out on the Shipping &amp; Returns page.
        </p>
      </article>
    </StoreLayout>
  );
}
