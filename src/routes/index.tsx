import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/store/header";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ICXC — Sacred Canvas" },
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

  const skipIntro = () => {
    const video = videoRef.current;
    if (video && Number.isFinite(video.duration)) {
      video.pause();
      video.currentTime = video.duration - 0.05; // land on the lit final frame
    }
    setShowText(true);
  };

  const handleVideoError = () => {
    setUseStill(true);
    setShowText(true);
  };

  // Video is mirrored (-scale-x-100) so the lamp sits on the left and the empty black space is on the right.
  const mediaClass = "h-full w-full -scale-x-100 object-cover object-[62%_50%] md:object-center";

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-ivory">
      <Header />

      <div className="relative flex min-h-screen flex-col pt-16 md:block">
        {/* Lamp video / still */}
        <div className="relative h-[62vh] w-full md:absolute md:inset-0 md:top-16 md:h-auto">
          {useStill ? (
            <img
              src="/lamp-on.jpg"
              alt="Antique lamp with a mask hanging on it, glowing warmly"
              className={mediaClass}
            />
          ) : (
            <video
              ref={videoRef}
              src="/lamp-intro.mp4"
              poster="/lamp-on.jpg"
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
          <h1 className="font-display text-[clamp(4.5rem,11vw,10rem)] font-normal leading-none text-ivory drop-shadow-[0_0_22px_var(--color-ember)]">
            ICXC
          </h1>
          <p className="mt-2 text-2xl italic text-ivory/80 md:text-3xl">Talitha cumi</p>
          <Link
            to="/gallery"
            className="mt-10 border-b border-ivory/40 pb-1 text-sm uppercase tracking-widest text-ivory transition-colors hover:border-ember hover:text-ember"
          >
            Enter the Gallery
          </Link>
        </div>
      </div>

      {!showText && (
        <button
          onClick={skipIntro}
          className="absolute bottom-5 right-5 z-20 text-xs uppercase tracking-widest text-ivory/55 hover:text-ivory"
        >
          Skip intro
        </button>
      )}
    </main>
  );
}
