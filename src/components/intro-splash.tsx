"use client";

import { useEffect, useState } from "react";

import { ChakraMotif } from "@/components/chakra-motif";
import { SahebjiBanner } from "@/components/sahebji-banner";
import { auspices } from "@/lib/event";

const INTRO_MS = 5500;

type IntroSplashProps = {
  onComplete: () => void;
};

export function IntroSplash({ onComplete }: IntroSplashProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startedAt = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startedAt;
      setProgress(Math.min(100, (elapsed / INTRO_MS) * 100));

      if (elapsed >= INTRO_MS) {
        window.clearInterval(interval);
        onComplete();
      }
    }, 50);

    return () => window.clearInterval(interval);
  }, [onComplete]);

  function skipIntro() {
    onComplete();
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={skipIntro}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          skipIntro();
        }
      }}
      className="intro-splash cosmic-vignette relative flex min-h-[100dvh] w-full cursor-pointer flex-col overflow-hidden cosmic-bg outline-none"
      aria-label="Skip intro and go to games"
    >
      <div className="pointer-events-none absolute left-1/2 top-[38%] z-0 -translate-x-1/2 -translate-y-1/2 opacity-70">
        <ChakraMotif size={320} />
      </div>

      <div className="safe-x safe-bottom relative z-10 flex min-h-[100dvh] flex-col px-4 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
          <div className="intro-brand-mark animate-float touch-target" aria-hidden>
            K
          </div>

          <p className="intro-presents mb-3 mt-4 uppercase">{auspices} Presents</p>

          <div className="intro-hero mx-auto max-w-md sm:max-w-lg">
            <div className="intro-logotype-rule mb-3" aria-hidden />
            <h1 className="intro-logotype">KARMA-LOGI</h1>
            <div className="intro-logotype-rule mt-3" aria-hidden />
          </div>

          <p className="intro-subtitle mt-4 uppercase">The Jain Scientific Expo</p>
        </div>

        <footer className="safe-bottom shrink-0">
          <SahebjiBanner variant="compact" />

          <div className="mx-auto mt-5 w-full max-w-[15rem] sm:max-w-xs">
            <div className="progress-track h-1 overflow-hidden rounded-full">
              <div
                className="progress-fill h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2.5 text-center text-[8px] uppercase tracking-[0.22em] text-gold-dim sm:text-[9px]">
              Entering games · tap to skip
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
