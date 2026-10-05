import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { getStripe, STORE_CURRENCY } from "@/lib/stripe.server";
import { artworks, frames } from "@/lib/catalog";

type CartLine = { artworkId: string; frameKey: string; quantity: number };

export const createCheckoutSession = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: { items: CartLine[] }) => {
    if (!Array.isArray(data?.items) || data.items.length === 0) throw new Error("Your cart is empty.");
    return data;
  })
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;

    // 1. Rebuild the cart from the catalog on the server.
    //    Prices always come from here, never from the browser, so nobody can edit them.
    const lines = data.items.map((line) => {
      const artwork = artworks.find((a) => a.id === line.artworkId);
      const frame = frames.find((f) => f.key === line.frameKey);
      if (!artwork || !frame) throw new Error("An item in your cart is no longer available.");
      const quantity = Math.min(Math.max(Math.floor(line.quantity) || 1, 1), 10);
      return { artwork, frame, quantity, unit: artwork.price + frame.price };
    });
    const subtotal = lines.reduce((sum, l) => sum + l.unit * l.quantity, 0);

    // 2. Shipping details saved on the Account page
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (!profile?.full_name || !profile.address_line1 || !profile.city || !profile.postal_code) {
      throw new Error("Add your shipping address on your Account page first.");
    }

    // 3. Save a pending order
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        subtotal_cents: subtotal,
        currency: STORE_CURRENCY,
        shipping_name: profile.full_name,
        shipping_phone: profile.phone,
        shipping_address: {
          line1: profile.address_line1,
          line2: profile.address_line2,
          city: profile.city,
          region: profile.region,
          postal_code: profile.postal_code,
          country: profile.country,
        },
      })
      .select("id")
      .single();
    if (orderError || !order) throw new Error("Could not create your order. Please try again.");

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        artwork_title: l.artwork.title,
        frame_name: l.frame.name,
        quantity: l.quantity,
        unit_price_cents: l.unit,
      })),
    );
    if (itemsError) throw new Error("Could not save your order items. Please try again.");

    // 4. Create the Stripe payment page
    const origin = new URL(getRequest().url).origin;
    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      ...(typeof claims.email === "string" ? { customer_email: claims.email } : {}),
      client_reference_id: order.id,
      metadata: { order_id: order.id },
      line_items: lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: STORE_CURRENCY,
          unit_amount: l.unit,
          product_data: { name: `${l.artwork.title} (${l.frame.name})` },
        },
      })),
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
    });

    await supabaseAdmin
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    if (!session.url) throw new Error("Stripe did not return a payment page.");
    return { url: session.url };
  });
