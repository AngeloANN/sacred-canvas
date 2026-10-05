import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Header } from "@/components/store/header";
import { useCart } from "@/components/store/cart";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/catalog";
import { supabase } from "@/integrations/supabase/client";
import { createCheckoutSession } from "@/lib/checkout.functions";

export const Route = createFileRoute("/_authenticated/checkout")({
  head: () => ({ meta: [{ title: "Checkout — ICXC XZS" }] }),
  component: Checkout,
});

type Shipping = {
  full_name: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};

function Checkout() {
  const cart = useCart();
  const startCheckout = useServerFn(createCheckoutSession);
  const [shipping, setShipping] = useState<Shipping | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name,address_line1,address_line2,city,region,postal_code,country")
          .eq("user_id", user.id)
          .maybeSingle();
        setShipping(data);
      }
      setLoading(false);
    })();
  }, []);

  const hasAddress = !!(shipping?.full_name && shipping.address_line1 && shipping.city && shipping.postal_code);

  const pay = async () => {
    if (paying) return;
    setPaying(true);
    setError("");
    try {
      const { url } = await startCheckout({
        data: {
          items: cart.items.map((i) => ({ artworkId: i.artwork.id, frameKey: i.frame.key, quantity: i.quantity })),
        },
      });
      window.location.href = url; // off to Stripe's secure payment page
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setPaying(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-5xl px-5 pb-20 pt-28">
        <h1 className="font-display text-6xl">Checkout</h1>

        {cart.items.length === 0 ? (
          <div className="mt-12">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild variant="gallery" className="mt-6">
              <Link to="/gallery">Return to the gallery</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-12 grid gap-16 lg:grid-cols-[1fr_360px]">
            <section>
              <h2 className="font-display text-3xl">Your collection</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {cart.items.map((item) => (
                  <div key={`${item.artwork.id}-${item.frame.key}`} className="flex gap-4 py-5">
                    <img src={item.artwork.image} alt="" className="h-24 w-[72px] object-cover" />
                    <div className="flex-1">
                      <h3 className="font-display text-xl">{item.artwork.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.frame.name} · Qty {item.quantity}</p>
                    </div>
                    <span>{money((item.artwork.price + item.frame.price) * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside>
              <h2 className="font-display text-3xl">Ship to</h2>
              <div className="mt-6 border border-border p-5 text-sm leading-relaxed">
                {loading ? (
                  <p className="text-muted-foreground">Loading…</p>
                ) : hasAddress && shipping ? (
                  <>
                    <p>{shipping.full_name}</p>
                    <p>{shipping.address_line1}</p>
                    {shipping.address_line2 && <p>{shipping.address_line2}</p>}
                    <p>{shipping.city}, {shipping.region} {shipping.postal_code}</p>
                    <p>{shipping.country}</p>
                  </>
                ) : (
                  <p className="text-muted-foreground">No shipping address saved yet.</p>
                )}
                <Link to="/account" className="mt-3 inline-block underline underline-offset-4">
                  {hasAddress ? "Edit address" : "Add your address"}
                </Link>
              </div>

              <div className="mt-8 flex justify-between text-xl">
                <span>Subtotal</span>
                <span>{money(cart.subtotal)}</span>
              </div>

              <Button
                variant="gallery"
                size="lg"
                className="mt-6 w-full"
                onClick={pay}
                disabled={!hasAddress || paying}
              >
                {paying ? "Opening secure payment…" : "Pay securely"}
              </Button>
              {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
              <p className="mt-3 text-xs text-muted-foreground">Payments are handled by Stripe. Your card details never touch this site.</p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
