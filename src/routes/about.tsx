import { createFileRoute, Link } from "@tanstack/react-router";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { Ornament } from "@/components/store/ornament";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About the Collection | Grandma's Vintage Jewelry" },
      {
        name: "description",
        content:
          "The story behind a personal family collection of vintage jewelry, now listed piece by piece.",
      },
      { property: "og:title", content: "About the Collection" },
      {
        property: "og:description",
        content: "The story behind a personal family collection of vintage jewelry.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <StoreLayout>
      <PageHeader
        title="About the Collection"
        intro="A personal family collection, shared one piece at a time."
      />
      <article className="mx-auto max-w-2xl px-4 py-14 text-sm leading-relaxed sm:px-6">
        <p>
          This shop began with a jewelry box. Then a second one, a tin, and a drawer full of small
          boxes wrapped in tissue paper. The pieces were collected over a lifetime — some bought,
          some given, some inherited — and worn to weddings, church, birthdays and ordinary Tuesday
          afternoons.
        </p>
        <Ornament className="my-8" />
        <p>
          Rather than let them sit unseen, we are photographing and listing them one at a time. Each
          listing holds a single piece, described as carefully and plainly as we can manage.
        </p>
        <h2 className="mt-10 font-serif text-2xl">How we describe things</h2>
        <p className="mt-3">
          We are not jewelers, appraisers or historians. We list the condition we can see, the
          approximate measurements we can take, and only the materials, maker or era we genuinely
          know. Where something is unknown, we say so rather than guess. Nothing here is described as
          authentic, designer, solid gold or gemstone unless that is documented.
        </p>
        <h2 className="mt-10 font-serif text-2xl">How pieces are sent</h2>
        <p className="mt-3">
          Every order is wrapped by hand, padded, and posted with tracking, usually within two to
          three business days.
        </p>
        <div className="mt-10 flex gap-3">
          <Button asChild className="rounded-none">
            <Link to="/shop">Shop the Collection</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none bg-transparent">
            <Link to="/contact">Ask a Question</Link>
          </Button>
        </div>
      </article>
    </StoreLayout>
  );
}
