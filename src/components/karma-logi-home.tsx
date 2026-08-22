"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { GameCard } from "@/components/game-card";
import { GameComingSoon } from "@/components/game-coming-soon";
import { IntroSplash } from "@/components/intro-splash";
import { LanguageSelector } from "@/components/language-selector";
import { PlayerRegister } from "@/components/player-register";
import { SiteFooter } from "@/components/site-footer";
import { KarmaChakraGame } from "@/games/karma-chakra/karma-chakra-game";
import { KarmaQuestGame } from "@/games/karma-quest/karma-quest-game";
import { KarmaScrambleGame } from "@/games/karma-scramble/karma-scramble-game";
import { getGameById, karmaGames } from "@/lib/games";
import { DEFAULT_LANG, type Lang } from "@/lib/language";
import { fetchPlayerMe, submitPlayerScore } from "@/lib/player-api";
import { verifyVenueLocation } from "@/lib/location-access";
import type { PlayerScoreMap, PlayerSession } from "@/lib/player-types";

type KarmaLogiHomeProps = {
  locationRequired?: boolean;
};

export function KarmaLogiHome({ locationRequired = false }: KarmaLogiHomeProps) {
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState<Lang>(DEFAULT_LANG);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerSession | null>(null);
  const [scores, setScores] = useState<PlayerScoreMap>({});
  const [sessionReady, setSessionReady] = useState(false);
  const [checkingLocation, setCheckingLocation] = useState(false);
  const [notice, setNotice] = useState("");

  const finishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const closeGame = useCallback(() => {
    setActiveGameId(null);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("lang-en", "lang-hi", "lang-gu");
    root.classList.add(`lang-${lang}`);
    root.setAttribute("lang", lang);
  }, [lang]);

  useEffect(() => {
    let cancelled = false;

    fetchPlayerMe()
      .then((data) => {
        if (cancelled) {
          return;
        }
        setPlayer(data.player);
        setScores(data.scores);
      })
      .catch(() => {
        if (!cancelled) {
          setPlayer(null);
          setScores({});
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSessionReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleRegistered = useCallback(
    (nextPlayer: PlayerSession, nextScores: PlayerScoreMap) => {
      setPlayer(nextPlayer);
      setScores(nextScores);
      setNotice("");
    },
    [],
  );

  const handleGameComplete = useCallback(
    async (gameId: string, score: number) => {
      try {
        const result = await submitPlayerScore({ gameId, score });
        setScores(result.scores);
        setNotice(`Score saved: ${result.score} pts`);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unable to save score.";
        setNotice(message);
      }
    },
    [],
  );

  const selectGame = useCallback(
    async (gameId: string) => {
      if (scores[gameId] !== undefined) {
        setNotice("You have already played this game.");
        return;
      }

      if (locationRequired) {
        setCheckingLocation(true);
        setNotice("");

        try {
          const result = await verifyVenueLocation();
          if (!result.ok) {
            setNotice(result.message);
            return;
          }
        } finally {
          setCheckingLocation(false);
        }
      }

      setNotice("");
      setActiveGameId(gameId);
    },
    [locationRequired, scores],
  );

  const activeGame = activeGameId ? getGameById(activeGameId) : undefined;
  const onComplete = (score: number) => {
    if (activeGameId) {
      void handleGameComplete(activeGameId, score);
    }
  };

  if (activeGame?.id === "karma-quest" && activeGame.status === "available") {
    return (
      <KarmaQuestGame onExit={closeGame} lang={lang} onComplete={onComplete} />
    );
  }

  if (activeGame?.id === "karma-chakra" && activeGame.status === "available") {
    return (
      <KarmaChakraGame onExit={closeGame} lang={lang} onComplete={onComplete} />
    );
  }

  if (activeGame?.id === "karma-scramble" && activeGame.status === "available") {
    return (
      <KarmaScrambleGame
        onExit={closeGame}
        lang={lang}
        onComplete={onComplete}
      />
    );
  }

  if (activeGame?.status === "coming-soon") {
    return <GameComingSoon game={activeGame} onClose={closeGame} />;
  }

  if (showIntro) {
    return <IntroSplash onComplete={finishIntro} />;
  }

  if (!sessionReady) {
    return (
      <div className="cosmic-vignette flex min-h-[100dvh] items-center justify-center cosmic-bg">
        <p className="text-sm uppercase tracking-[0.16em] text-gold-dim">
          Loading…
        </p>
      </div>
    );
  }

  if (!player) {
    return <PlayerRegister onRegistered={handleRegistered} />;
  }

  const totalScore = Object.values(scores).reduce((sum, value) => sum + value, 0);

  return (
    <div className="cosmic-vignette relative min-h-[100dvh] overflow-x-hidden cosmic-bg flex flex-col">
      <main className="safe-x safe-bottom relative z-10 mx-auto w-full max-w-2xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-8 flex-1 flex flex-col justify-between gap-6">
        <header className="shrink-0 space-y-4">
          <div className="home-profile glass-panel rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="home-avatar" aria-hidden>
                  {player.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-bold text-foreground sm:text-xl">
                    {player.name}
                  </p>
                  <p className="mt-1 text-sm text-text-subtle">
                    Total{" "}
                    <span className="font-semibold tabular-nums text-amber-400">
                      {totalScore}
                    </span>{" "}
                    pts
                  </p>
                </div>
              </div>
              <Link href="/scorecard" className="home-scorecard-link">
                Scorecard
              </Link>
            </div>
          </div>

          <LanguageSelector value={lang} onChange={setLang} />
        </header>

        {notice ? (
          <p className="rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-center text-sm text-gold-bright shrink-0">
            {notice}
          </p>
        ) : locationRequired ? (
          <p className="mb-4 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-xs text-text-muted shrink-0">
            On-site play only — location is checked when you tap a game.
          </p>
        ) : null}

        <div className="flex-1 flex flex-col gap-4 py-1 sm:py-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-subtle px-1">
            Choose a game
          </p>
          <ul className="flex flex-col gap-3 sm:gap-4 w-full">
            {karmaGames.map((game) => (
              <li key={game.id}>
                <GameCard
                  game={game}
                  played={scores[game.id] !== undefined}
                  score={scores[game.id]}
                  onSelect={(gameId) => {
                    void selectGame(gameId);
                  }}
                  disabled={checkingLocation}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 shrink-0">
          <SiteFooter />
        </div>
      </main>
    </div>
  );
}
