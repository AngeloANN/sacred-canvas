import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Artwork3D } from "@/components/store/artwork-3d.tsx";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { artworks, formats, money, sizeLabel, type FormatKey } from "@/lib/catalog";
import { useState } from "react";
import { useCart } from "@/components/store/cart.tsx";
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
  // Which format and size the customer picked. Starts on the first option of each.
  const [formatKey, setFormatKey] = useState<FormatKey>("mounted");
  const format = formats.find((f) => f.key === formatKey)!;
  const [sizeKey, setSizeKey] = useState(format.sizes[0]!.key);
  const size = format.sizes.find((s) => s.key === sizeKey) ?? format.sizes[0]!;

  // Switching format jumps to that format's first size, since the sizes are different.
  const pickFormat = (key: FormatKey) => {
    setFormatKey(key);
    setSizeKey(formats.find((f) => f.key === key)!.sizes[0]!.key);
  };

  // Flat or 3D preview
  const [view, setView] = useState<"flat" | "3d">("flat");
  // Tall pieces flip the size (10×8 becomes 8×10), same as the size buttons
  const tall = art.height > art.width;

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="mx-auto max-w-375 px-5 pt-24 lg:px-12">
        <Link
          to="/gallery"
          className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground transition-colors hover:text-ember"
        >
          <ArrowLeft className="size-4" /> Back to gallery
        </Link>
      </div>
      <div className="mx-auto grid max-w-375 gap-12 px-5 pb-20 pt-6 lg:grid-cols-[1.3fr_.7fr] lg:px-12">
        <section className="flex min-h-[65vh] items-center justify-center bg-museum-wall p-8 md:p-16">
          {/* Flat|3D switch on the top right of the wall */}
          <div className="absolute right-4 top-4 flex border border-border bg-background text-xs uppercase ">
            {/* Boolean to map out the user's choice*/}
            {(["flat", "3d"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-3 py-2 ${view === v} ? "bg-primary text-primary-foreground" : ""}`}
              >
                {v === "flat" ? "Flat" : "3D view"}
              </button>
            ))}
          </div>

          {/*The view if the option is Flat*/}
          {view === "flat" ? (
            <img
              src={art.image}
              width={1024}
              height={1280}
              alt={art.title}
              className="max-h-[70vh] w-auto object-contain shadow-2xl"
            />
          ) : (
            //The view if the option is 3D
            <Artwork3D
              image={art.image}
              title={art.title}
              widthIn={tall ? size.h : size.w}
              heightIn={tall ? size.w : size.h}
              format={formatKey}
            />
          )}
        </section>
        <section className="flex flex-col justify-center">
          <h1 className="font-display text-6xl font-normal md:text-8xl">{art.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{art.year}</p>
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
          {/* Format: Mounted Print | Canvas */}
          <fieldset className="mt-8">
            <legend className="mb-3 text-sm uppercase">Format</legend>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.key}
                  onClick={() => pickFormat(f.key)}
                  className={`border px-3 py-3 ${f.key === formatKey ? "border-primary bg-secondary" : "border-border"}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Size: changes with the format */}
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm uppercase">Size</legend>
            <div className="grid grid-cols-3 gap-2">
              {format.sizes.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSizeKey(s.key)}
                  className={`border px-3 py-3 text-left ${s.key === size.key ? "border-primary bg-secondary" : "border-border"}`}
                >
                  <span className="block">{sizeLabel(s, art)}</span>
                  <span className="text-xs text-muted-foreground">{money(s.price)}</span>
                </button>
              ))}
            </div>
          </fieldset>
          <div className="mt-10 flex items-center justify-between gap-5">
            <span className="text-3xl">{money(size.price)}</span>
            <Button variant="gallery" size="lg" onClick={() => cart.add(art, formatKey, size.key)}>
              Add to cart
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
