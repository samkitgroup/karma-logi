"use client";

import { useEffect, useState } from "react";

import { ChakraMotif } from "@/components/chakra-motif";
import { SahebjiBanner } from "@/components/sahebji-banner";
import { auspices } from "@/lib/event";

const INTRO_MS = 5500000;

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
    <div className="intro-splash cosmic-vignette relative flex min-h-[100dvh] w-full flex-col overflow-hidden cosmic-bg outline-none">
      <div className="safe-x safe-bottom relative z-10 flex min-h-[100dvh] flex-col px-4 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center px-1 text-center">
          <p className="intro-presents mb-6 uppercase tracking-[0.24em] text-[10px]">
            {auspices} Presents
          </p>

          <div className="intro-brand-wrap">
            <div className="intro-chakra-backdrop" aria-hidden>
              <ChakraMotif size={152} />
            </div>
            <div className="intro-brand-mark animate-float touch-target" aria-hidden>
              K
            </div>
          </div>

          <div className="intro-hero mx-auto mt-6 max-w-md sm:max-w-lg">
            <h1 className="intro-logotype">KARMA-LOGI</h1>
          </div>

          <p className="intro-subtitle mt-3.5 uppercase tracking-[0.24em] text-xs text-gold-bright">
            The Jain Scientific Expo
          </p>
        </div>

        <footer className="safe-bottom shrink-0">
          <SahebjiBanner variant="compact" />

          <button
            type="button"
            className="intro-skip mx-auto mt-6 block w-full max-w-[15rem] border-0 bg-transparent p-0 sm:max-w-xs"
            onClick={skipIntro}
          >
            <div className="progress-track h-1.5 overflow-hidden rounded-full">
              <div
                className="progress-fill h-full rounded-full transition-[width] duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2.5 text-center text-[10.5px] uppercase tracking-[0.18em] text-gold-dim sm:text-xs">
              Entering games · tap to skip
            </p>
          </button>
        </footer>
      </div>
    </div>
  );
}
