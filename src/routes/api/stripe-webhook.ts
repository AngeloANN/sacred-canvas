import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getStripe } from "@/lib/stripe.server";

// Stripe calls this URL after a payment. It's the only thing allowed to mark an order as paid.
export const Route = createFileRoute("/api/stripe-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["STRIPE_WEBHOOK_SECRET"];
        const signature = request.headers.get("stripe-signature");
        if (!secret || !signature) return new Response("Missing signature", { status: 400 });

        const body = await request.text();
        let event;
        try {
          // Proves the request really came from Stripe
          event = await getStripe().webhooks.constructEventAsync(body, signature, secret);
        } catch {
          return new Response("Invalid signature", { status: 400 });
        }

        if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
          const session = event.data.object;
          const orderId = session.metadata?.["order_id"];
          if (orderId && session.payment_status === "paid") {
            await supabaseAdmin
              .from("orders")
              .update({
                status: "paid",
                stripe_payment_intent_id:
                  typeof session.payment_intent === "string" ? session.payment_intent : null,
              })
              .eq("id", orderId);
          }
        }

        if (event.type === "checkout.session.expired") {
          const orderId = event.data.object.metadata?.["order_id"];
          if (orderId) {
            await supabaseAdmin
              .from("orders")
              .update({ status: "cancelled" })
              .eq("id", orderId)
              .eq("status", "pending");
          }
        }

        return new Response("ok");
      },
    },
  },
});
