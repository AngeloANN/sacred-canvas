import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
type Profile = {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
};
const empty: Profile = {
  full_name: "",
  phone: "",
  address_line1: "",
  address_line2: "",
  city: "",
  region: "",
  postal_code: "",
  country: "",
};
export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "Account — ICXC" },
      { name: "description", content: "Manage your ICXC collector profile and view past orders." },
      { property: "og:title", content: "Account — ICXC" },
      {
        property: "og:description",
        content: "Manage your ICXC collector profile and view past orders.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Account,
});
function Account() {
  const [profile, setProfile] = useState<Profile>(empty);
  const [orders, setOrders] = useState<
    Array<{ id: string; status: string; subtotal_cents: number; created_at: string }>
  >([]);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    void (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: p }, { data: o }] = await Promise.all([
        supabase
          .from("profiles")
          .select("full_name,phone,address_line1,address_line2,city,region,postal_code,country")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("orders")
          .select("id,status,subtotal_cents,created_at")
          .order("created_at", { ascending: false }),
      ]);
      if (p) setProfile(p);
      if (o) setOrders(o);
    })();
  }, []);
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({ user_id: user.id, ...profile });
    setMessage(error?.message ?? "Profile saved.");
  };
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-28">
        <h1 className="font-display text-6xl">Collector account</h1>
        <div className="mt-12 grid gap-16 lg:grid-cols-2">
          <form onSubmit={save}>
            <h2 className="font-display text-3xl">Shipping details</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(profile).map(([key, value]) => (
                <Input
                  key={key}
                  value={value}
                  onChange={(e) => setProfile((p) => ({ ...p, [key]: e.target.value }))}
                  placeholder={key.replaceAll("_", " ")}
                  className={
                    key === "address_line1" || key === "address_line2" ? "sm:col-span-2" : ""
                  }
                />
              ))}
            </div>
            <Button variant="gallery" className="mt-5" type="submit">
              Save details
            </Button>
            {message && <span className="ml-4 text-sm text-muted-foreground">{message}</span>}
          </form>
          <section>
            <h2 className="font-display text-3xl">Past orders</h2>
            <div className="mt-6 divide-y divide-border border-y border-border">
              {orders.length ? (
                orders.map((o) => (
                  <div key={o.id} className="flex justify-between py-4">
                    <div>
                      <p className="uppercase">{o.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(o.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span>${(o.subtotal_cents / 100).toFixed(0)}</span>
                  </div>
                ))
              ) : (
                <p className="py-6 text-muted-foreground">No orders yet.</p>
              )}
            </div>
          </section>
        </div>
        <Button
          variant="quiet"
          className="mt-14"
          onClick={async () => {
            await supabase.auth.signOut();
            void navigate({ to: "/auth", replace: true });
          }}
        >
          Sign out
        </Button>
      </div>
    </main>
  );
}
