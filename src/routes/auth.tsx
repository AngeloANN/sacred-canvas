import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — ICXC" },
      { name: "description", content: "Sign in or create an ICXC collector account." },
      { property: "og:title", content: "Sign in — ICXC" },
      { property: "og:description", content: "Sign in or create an ICXC collector account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});
function AuthPage() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (mode === "sign-up") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + "/account" },
      });
      if (error) return setMessage(error.message);
      if (!data.session) return setMessage("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return setMessage(error.message);
      void navigate({ to: "/account" });
    }
  };
  return (
    <main className="min-h-screen bg-night text-ivory">
      <Header />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 pt-16">
        <p className="mb-4 text-xs uppercase text-ember">Collector access</p>
        <h1 className="font-display text-6xl font-normal">
          {mode === "sign-in" ? "Return" : "Enter"}
        </h1>
        <p className="mt-3 text-ivory/60">
          {mode === "sign-in"
            ? "Sign in to continue to your collection."
            : "Create an account for checkout and order history."}
        </p>
        <form onSubmit={submit} className="mt-10 space-y-4">
          <Input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-none border-ivory/30 bg-transparent text-ivory placeholder:text-ivory/45"
          />
          <Input
            type="password"
            minLength={8}
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-none border-ivory/30 bg-transparent text-ivory placeholder:text-ivory/45"
          />
          <Button variant="gallery" size="lg" className="w-full bg-ivory text-night" type="submit">
            {mode === "sign-in" ? "Sign in" : "Create account"}
          </Button>
        </form>
        <div className="my-6 flex items-center gap-4 text-xs text-ivory/40">
          <span className="h-px flex-1 bg-ivory/20" />
          OR
          <span className="h-px flex-1 bg-ivory/20" />
        </div>
        <Button
          variant="quiet"
          size="lg"
          className="border-ivory/30 text-ivory hover:bg-ivory/10"
          onClick={async () => {
            const result = await lovable.auth.signInWithOAuth("google", {
              redirect_uri: window.location.origin + "/auth",
            });
            if (result.error) setMessage(result.error.message);
          }}
        >
          Continue with Google
        </Button>
        {message && <p className="mt-5 text-sm text-ember">{message}</p>}
        <div className="mt-8 flex justify-between text-sm">
          <button
            onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
            className="border-b border-ivory/30"
          >
            {mode === "sign-in" ? "Create an account" : "Already registered?"}
          </button>
          {mode === "sign-in" && (
            <button
              onClick={async () => {
                if (!email) return setMessage("Enter your email first.");
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: window.location.origin + "/reset-password",
                });
                setMessage(error?.message ?? "Password reset link sent.");
              }}
              className="border-b border-ivory/30"
            >
              Forgot password?
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
