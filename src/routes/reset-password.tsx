import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Reset password — ICXC" },
      { name: "description", content: "Choose a new password for your ICXC account." },
      { property: "og:title", content: "Reset password — ICXC" },
      { property: "og:description", content: "Choose a new password for your ICXC account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reset,
});
function Reset() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const recovery = typeof window !== "undefined" && window.location.hash.includes("type=recovery");
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <h1 className="font-display text-5xl">New password</h1>
        <p className="mt-3 text-muted-foreground">
          {recovery
            ? "Choose a new password for your account."
            : "Open the recovery link from your email to continue."}
        </p>
        {recovery && (
          <form
            className="mt-8 space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              const { error } = await supabase.auth.updateUser({ password });
              if (error) setMessage(error.message);
              else void navigate({ to: "/account" });
            }}
          >
            <Input
              type="password"
              minLength={8}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
            />
            <Button variant="gallery" className="w-full">
              Save password
            </Button>
          </form>
        )}
        {message && <p className="mt-4 text-destructive">{message}</p>}
      </div>
    </main>
  );
}
