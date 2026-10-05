import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Header } from "@/components/store/header";
import { useCart } from "@/components/store/cart";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/checkout/success")({
  head: () => ({ meta: [{ title: "Thank you — ICXC XZS" }] }),
  component: Success,
});

function Success() {
  const cart = useCart();

  // Payment went through, so empty the cart
  useEffect(() => {
    cart.items.forEach((i) => cart.setQuantity(i.artwork.id, i.frame.key, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 text-center">
        <h1 className="font-display text-6xl">Thank you</h1>
        <p className="mt-4 font-typewriter text-muted-foreground">Your order is confirmed. A receipt is on its way to your email.</p>
        <div className="mt-10 flex gap-3">
          <Button asChild variant="gallery"><Link to="/account">View my orders</Link></Button>
          <Button asChild variant="outline"><Link to="/gallery">Back to the gallery</Link></Button>
        </div>
      </div>
    </main>
  );
}
