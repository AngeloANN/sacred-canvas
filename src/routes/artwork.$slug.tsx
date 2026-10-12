import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/store/header";
import { Button } from "@/components/ui/button";
import { artworks, formats, money, sizeLabel, type FormatKey } from "@/lib/catalog";
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
          <div>
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
            {/* Temporarily disabled: we connect this to the cart in step 3 */}
            <Button variant="gallery" size="lg" disabled>
              Add to cart
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
