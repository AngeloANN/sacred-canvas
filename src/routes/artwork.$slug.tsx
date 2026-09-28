import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft} from "lucide-react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { artworks, frames, money } from "@/lib/catalog";
import { useCart } from "@/components/store/cart";
import { useState } from "react";
export const Route = createFileRoute("/artwork/$slug")({
  loader: ({ params }) => {
    const artwork = artworks.find((a) => a.slug === params.slug);
    if (!artwork) throw notFound();
    return artwork;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Artwork"} — ICXC` },
      { property: "og:title", content: `${loaderData?.title ?? "Artwork"} — ICXC` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArtworkDetail,
});
function ArtworkDetail() {
  const art = Route.useLoaderData();
  const cart = useCart();
  const [frame, setFrame] = useState(frames[0]);

  const frameClass = {
    none: "p-0",
    black: "border-[18px] border-primary p-1",
    gold: "border-[20px] border-gold p-2 outline outline-2 outline-gold",
    wood: "border-[18px] border-amber-900 p-1",
    white: "border-[18px] border-background p-1",
  }[frame.key];
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-[1500px] px-5 pt-24 lg:px-12">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-ember"
        >
          <ArrowLeft className="size-4" /> Back to gallery
        </Link>
      </div>
      <div className="mx-auto grid max-w-[1500px] gap-12 px-5 pb-20 pt-6 lg:grid-cols-[1.3fr_.7fr] lg:px-12">
        <section className="flex min-h-[65vh] items-center justify-center bg-museum-wall p-8 md:p-16">
          <div className={frameClass}>
            <img
              src={art.image}
              width={1024}
              height={1280}
              alt={art.title}
              className="max-h-[70vh] w-auto object-contain shadow-2xl"
            />
          </div>
        </section>
        <section className="flex flex-col justify-center">
          <h1 className="font-display text-6xl font-normal md:text-8xl">{art.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            {art.year}
          </p>
          {art.instagram && (
            <a
              href={art.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-base underline underline-offset-2 hover:text-ember"
            >
              See IG post
            </a>
          )}
          <dl className="mt-8 grid grid-cols-2 border-y border-border py-5 text-sm">
            <div>
              <dt className="uppercase text-muted-foreground">Dimensions</dt>
              <dd className="mt-1 text-lg">
                {art.width} × {art.height} cm
              </dd>
            </div>
            <div>
              <dt className="uppercase text-muted-foreground">Original</dt>
              <dd className="mt-1 text-lg">One of one</dd>
            </div>
          </dl>
          <fieldset className="mt-8">
            <legend className="mb-3 text-sm uppercase">Select frame</legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {frames.map((option) => (
                <button
                  key={option.key}
                  onClick={() => setFrame(option)}
                  className={`border px-3 py-3 text-left ${option.key === frame.key ? "border-primary bg-secondary" : "border-border"}`}
                >
                  <span className="block">{option.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {option.price ? `+ ${money(option.price)}` : "Included"}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-10 flex items-center justify-between gap-5">
            <span className="text-3xl">{money(art.price + frame.price)}</span>
            <Button variant="gallery" size="lg" onClick={() => cart.add(art, frame)}>
              Add to cart
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
