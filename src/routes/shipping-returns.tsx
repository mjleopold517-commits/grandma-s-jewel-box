import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";

export const Route = createFileRoute("/shipping-returns")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns | Grandma's Vintage Jewelry" },
      {
        name: "description",
        content: "How vintage jewelry orders are packed, posted and returned.",
      },
      { property: "og:title", content: "Shipping & Returns" },
      { property: "og:description", content: "How orders are packed, posted and returned." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShippingReturns,
});

function ShippingReturns() {
  return (
    <StoreLayout>
      <PageHeader title="Shipping & Returns" />
      <article className="mx-auto max-w-2xl space-y-6 px-4 py-14 text-sm leading-relaxed sm:px-6">
        <section>
          <h2 className="font-serif text-2xl">Dispatch</h2>
          <p className="mt-2">
            Orders are packed by hand and posted within two to three business days. You'll receive a
            tracking number by email once the parcel is on its way.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Shipping cost</h2>
          <p className="mt-2">
            A flat shipping rate is applied at checkout, with free shipping above the threshold shown
            in your cart. International shipping can be arranged — please get in touch before
            ordering.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Returns</h2>
          <p className="mt-2">
            If a piece is not what you expected, contact us within 14 days of delivery. Return the
            item unworn and in its original packaging and we'll refund the item price once it arrives
            safely. Return postage is the buyer's responsibility unless the piece was described
            incorrectly.
          </p>
        </section>
        <section>
          <h2 className="font-serif text-2xl">Condition of vintage pieces</h2>
          <p className="mt-2">
            These are pre-owned pieces. Small marks, gentle wear and age-related patina are normal and
            are noted in each listing where visible. We describe only what we know — where the maker,
            materials or age are uncertain, the listing says so.
          </p>
        </section>
      </article>
    </StoreLayout>
  );
}
