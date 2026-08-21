"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { GameInstructionsCard } from "@/components/game-instructions-card";
import { GamePlayHud } from "@/components/game-play-hud";
import { haptic, playTone, resumeAudio } from "./audio";
import {
  GAME_SUBTITLE,
  GAME_TITLE,
  KARMAS,
  LABELS,
  PRAKRITI_ITEMS,
  getKarmaDisplayName,
} from "./content";
import { KARMA_CELL_ICONS, KARMA_OPTION_ORDER } from "./grid-layout";
import "./karma-chakra.css";
import { GAME_DURATION_MS } from "@/lib/game-config";
import type { PrakritiItem } from "@/lib/karma-chakra-data";
import type { Lang } from "@/lib/language";

type GameMode = "start" | "play" | "over";

type RoundState = {
  prakriti: PrakritiItem;
};

type ResultState = {
  verdict: string;
  score: number;
  correct: number;
  accuracy: string;
  bestStreak: number;
};

const FEEDBACK_MS = 750;

function pickRandomRound(): PrakritiItem {
  return PRAKRITI_ITEMS[(Math.random() * PRAKRITI_ITEMS.length) | 0];
}

function scorePoints(streak: number): number {
  return 100 + Math.max(0, streak - 1) * 25;
}

function karmaOptionClass(
  index: number,
  feedbackWrong: number | null,
  feedbackCorrect: number | null,
  grading: boolean,
): string {
  const karma = KARMAS[index];
  const classes = [
    "karma-chakra-option",
    karma.g ? "is-ghati" : "is-aghati",
  ];

  if (feedbackWrong === index) {
    classes.push("is-wrong");
  } else if (feedbackCorrect === index) {
    classes.push(feedbackWrong !== null ? "is-correct-reveal" : "is-correct");
  } else if (grading) {
    classes.push("is-dimmed");
  }

  return classes.join(" ");
}

export function KarmaChakraGame({
  onExit,
  lang,
  onComplete,
}: {
  onExit: () => void;
  lang: Lang;
  onComplete?: (score: number) => void;
}) {
  const labels = LABELS[lang];
  const endsAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const toastRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const statsRef = useRef({ score: 0, hits: 0, tries: 0, bestStreak: 0 });
  const mutedRef = useRef(false);
  const reducedRef = useRef(false);

  const [mode, setMode] = useState<GameMode>("start");
  const [grading, setGrading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [tries, setTries] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [timeProgress, setTimeProgress] = useState(100);
  const [round, setRound] = useState<RoundState | null>(null);
  const [feedbackWrong, setFeedbackWrong] = useState<number | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState<number | null>(null);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState({ text: "", good: false, visible: false });
  const [result, setResult] = useState<ResultState>({
    verdict: "JOURNEY COMPLETE",
    score: 0,
    correct: 0,
    accuracy: "0%",
    bestStreak: 0,
  });

  useEffect(() => {
    statsRef.current = { score, hits, tries, bestStreak };
  }, [score, hits, tries, bestStreak]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const showToast = useCallback((text: string, good = false) => {
    setToast({ text, good, visible: true });
    if (toastRef.current) {
      window.clearTimeout(toastRef.current);
    }
    toastRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 850);
  }, []);

  const clearAdvanceTimer = useCallback(() => {
    if (advanceRef.current) {
      window.clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
  }, []);

  const finishGame = useCallback(
    (timeUp = false) => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      setGrading(false);
      clearAdvanceTimer();
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setMode("over");
      const stats = statsRef.current;
      setResult({
        verdict: timeUp ? labels.timeUp : labels.roundComplete,
        score: stats.score,
        correct: stats.hits,
        accuracy: `${stats.tries ? Math.round((stats.hits / stats.tries) * 100) : 0}%`,
        bestStreak: stats.bestStreak,
      });
      onComplete?.(stats.score);
      playTone("done", mutedRef.current);
      haptic([12, 60, 12, 60, 20], reducedRef.current);
    },
    [clearAdvanceTimer, labels.roundComplete, labels.timeUp, onComplete],
  );

  const loadNextRound = useCallback(() => {
    setGrading(false);
    setFeedbackWrong(null);
    setFeedbackCorrect(null);
    setShake(false);

    if (Date.now() >= endsAtRef.current) {
      finishGame(true);
      return;
    }

    setRound({ prakriti: pickRandomRound() });
  }, [finishGame]);

  const advanceAfter = useCallback(
    (delay: number) => {
      clearAdvanceTimer();
      advanceRef.current = window.setTimeout(() => {
        loadNextRound();
      }, delay);
    },
    [clearAdvanceTimer, loadNextRound],
  );

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      const remaining = Math.max(0, endsAtRef.current - Date.now());
      setTimeLeftMs(remaining);
      setTimeProgress((remaining / GAME_DURATION_MS) * 100);
      if (remaining <= 0) {
        finishGame(true);
      }
    }, 100);
  }, [finishGame]);

  const startGame = useCallback(() => {
    resumeAudio();
    endedRef.current = false;
    endsAtRef.current = Date.now() + GAME_DURATION_MS;
    setGrading(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setHits(0);
    setTries(0);
    setTimeLeftMs(GAME_DURATION_MS);
    setTimeProgress(100);
    setMode("play");
    startTimer();
    loadNextRound();
    playTone("tick", mutedRef.current);
  }, [loadNextRound, startTimer]);

  const pickKarma = useCallback(
    (index: number) => {
      if (!round || grading || mode !== "play") {
        return;
      }

      const correctIndex = round.prakriti.karmaIndex;
      setGrading(true);
      setTries((value) => value + 1);

      if (index === correctIndex) {
        setStreak((prevStreak) => {
          const nextStreak = prevStreak + 1;
          const points = scorePoints(nextStreak);
          setScore((value) => value + points);
          setHits((value) => value + 1);
          setBestStreak((value) => Math.max(value, nextStreak));
          setFeedbackCorrect(correctIndex);
          showToast(`${labels.released} +${points}`, true);
          playTone("good", mutedRef.current);
          haptic([8, 40, 14], reducedRef.current);
          advanceAfter(FEEDBACK_MS);
          return nextStreak;
        });
        return;
      }

      setStreak(0);
      setFeedbackWrong(index);
      setFeedbackCorrect(correctIndex);
      setShake(true);
      const correctName = getKarmaDisplayName(correctIndex, lang);
      showToast(`${labels.wrong} — ${correctName}`, false);
      playTone("bad", mutedRef.current);
      haptic(90, reducedRef.current);
      advanceAfter(FEEDBACK_MS);
    },
    [
      advanceAfter,
      grading,
      labels.released,
      labels.wrong,
      lang,
      mode,
      round,
      showToast,
    ],
  );

  const skipRound = useCallback(() => {
    if (!round || grading || mode !== "play") {
      return;
    }
    setGrading(true);
    setTries((value) => value + 1);
    setStreak(0);
    showToast(labels.skipped, false);
    playTone("tick", mutedRef.current);
    haptic(6, reducedRef.current);
    advanceAfter(420);
  }, [advanceAfter, grading, labels.skipped, mode, round, showToast]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      if (toastRef.current) {
        window.clearTimeout(toastRef.current);
      }
      clearAdvanceTimer();
    };
  }, [clearAdvanceTimer]);

  const toggleMuted = () => {
    setMuted((current) => {
      const next = !current;
      mutedRef.current = next;
      if (!next) {
        playTone("tick", false);
      }
      return next;
    });
  };

  return (
    <div className="karma-chakra-root">
      <div className="karma-chakra-chrome">
        {mode === "play" ? (
          <GamePlayHud
            title={GAME_TITLE}
            timeLeftMs={timeLeftMs}
            timeProgress={timeProgress}
            score={score}
            streak={streak}
            correct={hits}
            scoreLabel={labels.scoreLabel}
            streakLabel={labels.streakLabel}
            correctLabel={labels.correctLabel}
            timeLabel={labels.timeLeft}
            backLabel={labels.back}
            muted={muted}
            onExit={onExit}
            onToggleMute={toggleMuted}
            toast={toast}
          />
        ) : (
          <header className="karma-chakra-nav">
            <button type="button" className="karma-chakra-back" onClick={onExit}>
              {labels.back}
            </button>
            <div className="karma-chakra-title">{GAME_TITLE}</div>
            <button
              type="button"
              className="karma-chakra-icon-btn"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
            >
              {muted ? "✕" : "♪"}
            </button>
          </header>
        )}
      </div>

      {mode === "play" && round && (
        <main className="karma-chakra-main">
          <article className={`karma-chakra-play ${shake ? "shake" : ""}`}>
            <div className="karma-chakra-prompt">
              <span className="karma-chakra-badge">{labels.matchThis}</span>
              <p className="karma-chakra-prakriti">{round.prakriti.names[lang]}</p>
            </div>

            <div className="karma-chakra-options-wrap">
              <p className="karma-chakra-options-hint">{labels.tapKarma}</p>
              <div className="karma-chakra-options" role="group" aria-label={labels.tapKarma}>
                {KARMA_OPTION_ORDER.map((cell) => {
                  const isWrong = feedbackWrong === cell;
                  const isCorrect = feedbackCorrect === cell;

                  return (
                    <button
                      key={`karma-${cell}`}
                      type="button"
                      className={karmaOptionClass(
                        cell,
                        feedbackWrong,
                        feedbackCorrect,
                        grading,
                      )}
                      disabled={grading}
                      onClick={() => pickKarma(cell)}
                    >
                      <span className="karma-chakra-option-icon" aria-hidden>
                        {KARMA_CELL_ICONS[cell]}
                      </span>
                      <span className="karma-chakra-option-body">
                        <span className="karma-chakra-option-name">
                          {getKarmaDisplayName(cell, lang)}
                        </span>
                        <span className="karma-chakra-option-kind">
                          {KARMAS[cell].g ? labels.ghatiShort : labels.aghatiShort}
                        </span>
                      </span>
                      {isWrong && (
                        <span className="karma-chakra-option-mark is-wrong">✕</span>
                      )}
                      {isCorrect && (
                        <span className="karma-chakra-option-mark is-correct">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </article>

          <button
            type="button"
            className="karma-chakra-skip"
            onClick={skipRound}
            disabled={grading}
          >
            {labels.skip} →
          </button>
        </main>
      )}

      <div className={`karma-chakra-screen ${mode === "start" ? "" : "hide"}`}>
        <div className="text-center mb-6">
          <h1 className="karma-chakra-logotype">{GAME_TITLE}</h1>
          <p className="karma-chakra-sub mt-2">{GAME_SUBTITLE}</p>
        </div>

        <GameInstructionsCard
          howToPlay={labels.howToPlay}
          steps={labels.steps}
          timerNote={labels.timerNote}
        />

        <div className="flex justify-center">
          <button type="button" className="karma-chakra-cta" onClick={startGame}>
            {labels.begin}
          </button>
        </div>
      </div>

      <div className={`karma-chakra-screen ${mode === "over" ? "" : "hide"}`}>
        <div className="karma-chakra-sub">{result.verdict}</div>
        <h1 className="karma-chakra-logotype karma-chakra-score">{result.score}</h1>
        <div className="karma-chakra-presents">{labels.totalScore}</div>
        <div className="karma-chakra-stats">
          <div className="karma-chakra-stat">
            <u>{result.correct}</u>
            <s>{labels.correct.toUpperCase()}</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.accuracy}</u>
            <s>{labels.accuracy.toUpperCase()}</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.bestStreak}</u>
            <s>{labels.bestStreak.toUpperCase()}</s>
          </div>
        </div>
        <button
          type="button"
          className="karma-chakra-cta karma-chakra-cta--ghost"
          onClick={onExit}
        >
          {labels.back}
        </button>
      </div>
    </div>
  );
}
