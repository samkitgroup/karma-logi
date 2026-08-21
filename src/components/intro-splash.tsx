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
      className="intro-splash cosmic-vignette relative flex min-h-[100dvh] w-full cursor-pointer flex-col overflow-hidden cosmic-bg outline-none"
      role="button"
      tabIndex={0}
      onClick={skipIntro}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          skipIntro();
        }
      }}
      aria-label="Skip intro and enter games"
    >
      <div className="safe-x safe-bottom relative z-10 flex min-h-[100dvh] flex-col px-4 pb-6">
        <div className="intro-splash-hero flex flex-1 flex-col items-center justify-center px-1 text-center">
          <p className="intro-presents intro-fade intro-fade-1 mb-5 uppercase tracking-[0.24em]">
            {auspices} Presents
          </p>

          <div className="intro-brand-wrap intro-fade intro-fade-2">
            <div className="intro-chakra-backdrop" aria-hidden>
              <ChakraMotif size={140} />
            </div>
            <div className="intro-brand-mark animate-float touch-target" aria-hidden>
              K
            </div>
          </div>

          <div className="intro-hero intro-fade intro-fade-3 mx-auto mt-5 max-w-md sm:max-w-lg">
            <div className="intro-logotype-rule mb-2.5" aria-hidden />
            <h1 className="intro-logotype">KARMA-LOGI</h1>
            <div className="intro-logotype-rule mt-2.5" aria-hidden />
          </div>

          <p className="intro-subtitle intro-fade intro-fade-4 mt-3 uppercase tracking-[0.24em]">
            The Jain Scientific Expo
          </p>
        </div>

        <footer className="intro-splash-footer safe-bottom shrink-0">
          <div className="intro-splash-divider intro-fade intro-fade-5" aria-hidden />

          <div className="intro-fade intro-fade-5">
            <SahebjiBanner variant="splash" />
          </div>

          <div className="intro-splash-skip intro-fade intro-fade-6">
            <div className="progress-track intro-splash-progress h-1 overflow-hidden rounded-full">
              <div
                className="progress-fill h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-gold-dim">
              Entering games · tap to skip
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
