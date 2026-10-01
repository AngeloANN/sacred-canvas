import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/store/header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICXC XZS" },
      {
        name: "description",
        content: "Enter a dark, reverent collection of original sacred canvas artwork.",
      },
      { property: "og:title", content: "ICXC — Sacred Canvas" },
      {
        property: "og:description",
        content: "Enter a dark, reverent collection of original sacred canvas artwork.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

// The lamp is fully lit at ~3s in the video, so the text fades in then.
const TEXT_REVEAL_AT = 3;

function Index() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showText, setShowText] = useState(false);
  const [useStill, setUseStill] = useState(false);

  // Reduced motion: skip the video, show the lit lamp and the text right away.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setUseStill(true);
      setShowText(true);
    }
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video && video.currentTime >= TEXT_REVEAL_AT) setShowText(true);
  };

  const handleVideoError = () => {
    setUseStill(true);
    setShowText(true);
  };

  // Video is mirrored (-scale-x-100) so the lamp sits on the left and the empty black space is on the right.
  const mediaClass = "h-full w-full -scale-x-100 object-cover object-[62%_50%] md:object-center";

  return (
    <main className="relative min-h-screen overflow-hidden text-ivory">
      <Header />

      <div className="relative flex min-h-screen flex-col pt-16 md:block">
        {/* Lamp video / still */}
        <div className="relative h-[62vh] w-full md:absolute md:inset-0 md:top-16 md:h-auto">
          {useStill ? (
            <img
              src="/lamp-on.png"
              alt="Antique lamp with a mask hanging on it, glowing warmly"
              className={mediaClass}
            />
          ) : (
            <video
              ref={videoRef}
              src="/lamp-intro.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setShowText(true)}
              onError={handleVideoError}
              aria-label="An antique lamp with a mask hanging on it flickers on in the dark"
              className={mediaClass}
            />
          )}
          {/* Mobile only: fade the bottom of the video into black so the text below blends in */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-night md:hidden" />
        </div>

        {/* Text */}
        <div
          className={`relative z-10 flex flex-1 flex-col items-center justify-start px-6 pb-16 text-center transition-all duration-[1400ms] ease-out md:absolute md:right-[6%] md:top-1/2 md:w-[34%] md:-translate-y-1/2 md:items-start md:p-0 md:text-left ${
            showText ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
          }`}
        >
          <h1 className="font-display text-[clamp(3.5rem,8vw,8rem)] font-normal leading-none text-ivory drop-shadow-[0_0_2px_var(--color-ember)]">
            ICXC XZS
          </h1>
          <p className="mt-3 font-typewriter text-2xl text-ivory/80 md:text-2xl">Talitha cumi</p>
          <div className="mt-10 flex gap-3">
            <Link
              to="/gallery"
              className="rounded-full bg-ember px-7 py-2.5 text-sm uppercase tracking-widest text-night transition hover:brightness-110"
            >
              Gallery
            </Link>
            <Link
              to="/fashion"
              className="rounded-full border border-ember px-7 py-2.5 text-sm uppercase tracking-widest text-ember transition hover:bg-ember hover:text-night"
            >
              Fashion
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
