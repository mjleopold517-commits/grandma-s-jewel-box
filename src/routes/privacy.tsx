import { createFileRoute } from "@tanstack/react-router";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Grandma's Vintage Jewelry" },
      { name: "description", content: "How your personal information is used and protected." },
      { property: "og:title", content: "Privacy Policy" },
      { property: "og:description", content: "How your personal information is used and protected." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <StoreLayout>
      <PageHeader title="Privacy Policy" />
      <article className="mx-auto max-w-2xl space-y-6 px-4 py-14 text-sm leading-relaxed sm:px-6">
        <p>
          We collect only the information needed to fulfil your order: your name, email address,
          phone number if you provide one, and your shipping address. Card payments are handled by
          our payment provider — we never see or store full card details.
        </p>
        <p>
          Your details are used to process and post your order, to reply to your questions, and to
          keep a record of the sale. We do not sell or rent your information to anyone.
        </p>
        <p>
          Messages sent through the contact form are stored so we can reply and are forwarded to the
          shop owner's email address.
        </p>
        <p>
          You can ask us at any time to send you a copy of the information we hold about you, or to
          delete it, by using the contact form.
        </p>
      </article>
    </StoreLayout>
  );
}
