import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(160),
  subject: z.string().max(160).default(""),
  message: z.string().min(1).max(2000),
});

/** Saves a customer inquiry and routes a copy to the owner's configured email address. */
export const sendInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error } = await supabaseAdmin.from("inquiries").insert(data);
    if (error) return { ok: false as const, error: error.message };

    const { data: settings } = await supabaseAdmin
      .from("store_settings")
      .select("owner_email,store_name")
      .maybeSingle();

    const apiKey = process.env["RESEND_API_KEY"];
    if (apiKey && settings?.owner_email) {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "onboarding@resend.dev",
            to: [settings.owner_email],
            reply_to: data.email,
            subject: `New inquiry: ${data.subject || "Website contact form"}`,
            text: `${data.name} (${data.email})\n\n${data.message}`,
          }),
        });
      } catch (error) {
        console.error("Inquiry email failed", error);
      }
    }

    return { ok: true as const };
  });
