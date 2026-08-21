"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { GameCard } from "@/components/game-card";
import { GameComingSoon } from "@/components/game-coming-soon";
import { IntroSplash } from "@/components/intro-splash";
import { LanguageSelector } from "@/components/language-selector";
import { PlayerRegister } from "@/components/player-register";
import { KarmaChakraGame } from "@/games/karma-chakra/karma-chakra-game";
import { KarmaQuestGame } from "@/games/karma-quest/karma-quest-game";
import { KarmaScrambleGame } from "@/games/karma-scramble/karma-scramble-game";
import { getGameById, karmaGames } from "@/lib/games";
import type { Lang } from "@/lib/language";
import { fetchPlayerMe, submitPlayerScore } from "@/lib/player-api";
import type { PlayerScoreMap, PlayerSession } from "@/lib/player-types";

export function KarmaLogiHome() {
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState<Lang>("en");
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [player, setPlayer] = useState<PlayerSession | null>(null);
  const [scores, setScores] = useState<PlayerScoreMap>({});
  const [sessionReady, setSessionReady] = useState(false);
  const [notice, setNotice] = useState("");

  const finishIntro = useCallback(() => {
    setShowIntro(false);
  }, []);

  const closeGame = useCallback(() => {
    setActiveGameId(null);
  }, []);

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
    (gameId: string) => {
      if (scores[gameId] !== undefined) {
        setNotice("You have already played this game with this mobile number.");
        return;
      }

      setNotice("");
      setActiveGameId(gameId);
    },
    [scores],
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
    <div className="cosmic-vignette relative min-h-[100dvh] overflow-x-hidden cosmic-bg">
      <main className="safe-x safe-bottom relative z-10 mx-auto max-w-2xl px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <header className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-between gap-3">
            <p className="text-left text-sm text-text-muted">
              Hi, <span className="text-foreground">{player.name}</span>
            </p>
            <Link
              href="/scorecard"
              className="rounded-full border border-gold/30 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-bright transition hover:border-gold/50"
            >
              Scorecard
            </Link>
          </div>

          <h1 className="text-2xl font-semibold tracking-wide text-gold-gradient sm:text-3xl">
            Select a Game
          </h1>
          <p className="mt-2 text-sm text-text-muted">
            Total score: <span className="text-gold-bright">{totalScore}</span> ·
            one play per game
          </p>
          <div className="section-rule mx-auto mt-4 w-20" aria-hidden />

          <LanguageSelector
            value={lang}
            onChange={setLang}
            className="mx-auto mt-6 justify-center"
          />
        </header>

        {notice ? (
          <p className="mb-4 rounded-xl border border-gold/20 bg-gold/10 px-4 py-3 text-center text-sm text-gold-bright">
            {notice}
          </p>
        ) : null}

        <ul className="flex flex-col gap-3 sm:gap-4">
          {karmaGames.map((game) => (
            <li key={game.id}>
              <GameCard
                game={game}
                played={scores[game.id] !== undefined}
                score={scores[game.id]}
                onSelect={selectGame}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
