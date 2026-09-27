import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/store/header";

export const Route = createFileRoute("/fashion")({
  head: () => ({ meta: [{ title: "Fashion — ICXC XZS" }] }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="flex min-h-screen flex-col bg-night text-ivory">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center px-4 pt-16 text-center">
        <h1 className="font-display text-[clamp(4.5rem,16vw,14rem)] font-normal leading-none text-ivory drop-shadow-[0_0_2px_var(--color-ember)]">
          Upcoming
        </h1>
        <p className="mt-4 font-typewriter text-lg text-ivory/60 md:text-xl">
          The collection is being stitched.
        </p>
        <Link
          to="/gallery"
          className="mt-10 rounded-full bg-ember px-7 py-2.5 text-sm uppercase tracking-widest text-night transition hover:brightness-110"
        >
          Visit the Gallery
        </Link>
      </div>
    </main>
  );
}
