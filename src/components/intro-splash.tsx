"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { SahebjiBanner } from "@/components/sahebji-banner";

const INTRO_MS = 5500;

export function IntroSplash() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / INTRO_MS) * 100));

      if (elapsed >= INTRO_MS) {
        window.clearInterval(interval);
        router.replace("/games");
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [router]);

  function skipIntro() {
    router.replace("/games");
  }

  return (
    <button
      type="button"
      onClick={skipIntro}
      className="cosmic-vignette relative flex min-h-[100dvh] w-full flex-col overflow-hidden cosmic-bg text-left"
      aria-label="Skip intro and go to games"
    >
      <div className="relative z-10 flex min-h-[100dvh] flex-col px-4 pb-8 pt-6 sm:px-6 sm:pt-8">
        <header className="shrink-0 text-center">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-gold-dim sm:text-[10px]">
            Shri Jawahar Nagar Jain Sangh Presents
          </p>

          <h1 className="title-glow mt-3 font-serif text-[2.75rem] leading-none tracking-[0.1em] text-gold-bright sm:text-6xl">
            KARMA<span className="text-ghati">·</span>LOGI
          </h1>

          <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.34em] text-gold sm:text-xs">
            The Jain Scientific Expo
          </p>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="w-full max-w-[17rem] sm:max-w-xs">
            <h2 className="font-serif text-xl leading-tight text-gold-bright sm:text-2xl">
              Why Me?
            </h2>
            <h2 className="font-serif text-xl leading-tight text-gold-gradient sm:text-2xl">
              Why Always Me?
            </h2>
          </div>

          <p className="mx-auto mt-4 max-w-[16rem] font-serif text-sm leading-relaxed text-parch/70 sm:max-w-xs">
            Eight karmas bind the soul. Witness how cause and effect shape our
            destiny.
          </p>
        </div>

        <footer className="shrink-0">
          <SahebjiBanner variant="compact" />

          <div className="mx-auto mt-6 w-full max-w-[15rem] sm:max-w-xs">
            <div className="progress-track h-1 overflow-hidden rounded-full">
              <div
                className="progress-fill h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-center text-[9px] uppercase tracking-[0.24em] text-gold-dim sm:text-[10px]">
              Entering games · tap to skip
            </p>
          </div>
        </footer>
      </div>
    </button>
  );
}
