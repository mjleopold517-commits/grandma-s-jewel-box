import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { StoreLayout, PageHeader } from "@/components/store/store-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendInquiry } from "@/lib/contact.functions";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/store";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Grandma's Vintage Jewelry" },
      {
        name: "description",
        content: "Ask a question about a piece, shipping, or an order. We reply personally.",
      },
      { property: "og:title", content: "Contact" },
      { property: "og:description", content: "Ask a question about a piece, shipping, or an order." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const submit = useServerFn(sendInquiry);
  const { data: settings = DEFAULT_SETTINGS } = useQuery(settingsQuery);
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    try {
      const result = await submit({ data: form });
      if (result.ok) {
        toast.success("Thank you — your message has been sent.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error("Your message couldn't be sent. Please try again.");
      }
    } catch {
      toast.error("Your message couldn't be sent. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <StoreLayout>
      <PageHeader
        title="Contact"
        intro="Questions about a piece, a measurement, or an order? Send a note and we'll reply personally."
      />
      <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="tracking-widest-xs text-muted-foreground text-[0.62rem] uppercase">Name</Label>
            <Input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-2 rounded-none"
            />
          </div>
          <div>
            <Label className="tracking-widest-xs text-muted-foreground text-[0.62rem] uppercase">Email</Label>
            <Input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-2 rounded-none"
            />
          </div>
          <div>
            <Label className="tracking-widest-xs text-muted-foreground text-[0.62rem] uppercase">Subject</Label>
            <Input
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="mt-2 rounded-none"
            />
          </div>
          <div>
            <Label className="tracking-widest-xs text-muted-foreground text-[0.62rem] uppercase">Message</Label>
            <Textarea
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="mt-2 rounded-none"
            />
          </div>
          <Button
            type="submit"
            disabled={sending}
            className="tracking-widest-xs w-full rounded-none text-[0.7rem] uppercase"
          >
            {sending ? "Sending…" : "Send Message"}
          </Button>
        </form>
        <p className="text-muted-foreground mt-8 text-center text-xs">
          Messages go to {settings.owner_email}
          {settings.contact_phone ? ` · ${settings.contact_phone}` : ""}
        </p>
      </div>
    </StoreLayout>
  );
}
