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
      <div className="relative z-10 flex min-h-[100dvh] flex-col px-4 pb-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="intro-hero mx-auto max-w-md sm:max-w-lg">
            <div className="intro-logotype-rule mb-3" aria-hidden />
            <h1 className="intro-logotype">KARMA-LOGI</h1>
            <div className="intro-logotype-rule mt-3" aria-hidden />
          </div>

          <p className="intro-subtitle mt-4 uppercase">The Jain Scientific Expo</p>
        </div>

        <footer className="shrink-0">
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
