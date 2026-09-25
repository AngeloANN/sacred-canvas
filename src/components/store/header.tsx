import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./cart";
import { supabase } from "@/integrations/supabase/client";

export function Header() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(Boolean(data.user)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) =>
      setSignedIn(Boolean(session)),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-border bg-background text-foreground">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-4 md:px-8">
        <nav className="flex items-center gap-6 text-sm uppercase">
          <Link to="/" activeProps={{ className: "text-ember" }}>
            Home
          </Link>
          <Link to="/gallery" activeProps={{ className: "text-ember" }}>
            Gallery
          </Link>
        </nav>
        <Link to="/" className="font-display absolute left-1/2 -translate-x-1/2 text-2xl">
          ICXC
        </Link>
        <div className="flex items-center gap-2">
          <CartDrawer />
          <Button asChild variant="icon" size="icon" aria-label={signedIn ? "Account" : "Sign in"}>
            <Link to={signedIn ? "/account" : "/auth"}>
              <UserRound />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
