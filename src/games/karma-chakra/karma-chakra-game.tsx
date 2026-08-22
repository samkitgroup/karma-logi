"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { GameInstructionsCard } from "@/components/game-instructions-card";
import { GamePlayHud } from "@/components/game-play-hud";
import { GAME_UI } from "@/lib/game-ui-labels";
import { haptic, playTone, resumeAudio } from "./audio";
import {
  CHAKRA_CONTENT,
  GAME_SUBTITLE,
  GAME_TITLE,
  getDisplayLines,
  getKarmaDisplayName,
  getKarmaWheelLines,
} from "./content";
import { buildChakraDeck } from "@/lib/karma-chakra-data";
import { KARMA_CELL_ICONS, KARMA_OPTION_ORDER } from "./grid-layout";
import {
  RING_INNER_RADIUS,
  RING_LABEL_RADIUS,
  RING_MID_RADIUS,
  RING_OUTER_RADIUS,
  octagonClipPath,
  segmentLabelPosition,
  wedgeClipPath,
} from "./ring-segment";
import "./karma-chakra.css";
import { GAME_DURATION_MS } from "@/lib/game-config";
import type { PrakritiItem } from "@/lib/karma-chakra-data";
import type { Lang } from "@/lib/language";
import { SessionDeck } from "@/lib/session-deck";

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

function scorePoints(streak: number): number {
  return 100 + Math.max(0, streak - 1) * 25;
}

function karmaSegmentStateClass(
  index: number,
  feedbackWrong: number | null,
  feedbackCorrect: number | null,
  grading: boolean,
  base: string,
): string {
  const classes = [base];

  if (feedbackWrong === index) {
    classes.push("is-wrong");
  } else if (feedbackCorrect === index) {
    classes.push(feedbackWrong !== null ? "is-correct-reveal" : "is-correct");
  } else if (grading) {
    classes.push("is-dimmed");
  }

  return classes.join(" ");
}

function karmaOptionClass(
  index: number,
  feedbackWrong: number | null,
  feedbackCorrect: number | null,
  grading: boolean,
): string {
  return karmaSegmentStateClass(
    index,
    feedbackWrong,
    feedbackCorrect,
    grading,
    "karma-chakra-segment",
  );
}

function karmaLabelClass(
  index: number,
  feedbackWrong: number | null,
  feedbackCorrect: number | null,
  grading: boolean,
): string {
  return karmaSegmentStateClass(
    index,
    feedbackWrong,
    feedbackCorrect,
    grading,
    "karma-chakra-segment-label",
  );
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
  const content = CHAKRA_CONTENT[lang];
  const deckRef = useRef<SessionDeck<PrakritiItem> | null>(null);
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
        verdict: timeUp ? GAME_UI.timeUp : GAME_UI.roundComplete,
        score: stats.score,
        correct: stats.hits,
        accuracy: `${stats.tries ? Math.round((stats.hits / stats.tries) * 100) : 0}%`,
        bestStreak: stats.bestStreak,
      });
      onComplete?.(stats.score);
      playTone("done", mutedRef.current);
      haptic([12, 60, 12, 60, 20], reducedRef.current);
    },
    [clearAdvanceTimer, onComplete],
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

    const deck = deckRef.current;
    if (!deck) {
      finishGame(false);
      return;
    }

    const prakriti = deck.drawNext();
    if (!prakriti) {
      finishGame(false);
      return;
    }

    setRound({ prakriti });
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
    deckRef.current = new SessionDeck(buildChakraDeck(), (item) => item.id);
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
          showToast(`${GAME_UI.released} +${points}`, true);
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
      showToast(`${GAME_UI.wrongKarma} — ${correctName}`, false);
      playTone("bad", mutedRef.current);
      haptic(90, reducedRef.current);
      advanceAfter(FEEDBACK_MS);
    },
    [
      advanceAfter,
      grading,
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
    showToast(GAME_UI.skipped, false);
    playTone("tick", mutedRef.current);
    haptic(6, reducedRef.current);
    advanceAfter(420);
  }, [advanceAfter, grading, mode, round, showToast]);

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
    <div className={`karma-chakra-root ${mode === "play" ? "is-playing" : ""}`}>
      <div className="karma-chakra-chrome">
        {mode === "play" ? (
          <GamePlayHud
            title={GAME_TITLE}
            timeLeftMs={timeLeftMs}
            timeProgress={timeProgress}
            score={score}
            streak={streak}
            correct={hits}
            scoreLabel={GAME_UI.scoreLabel}
            streakLabel={GAME_UI.streakLabel}
            correctLabel={GAME_UI.correctLabel}
            timeLabel={GAME_UI.timeLeft}
            backLabel={GAME_UI.back}
            muted={muted}
            onExit={onExit}
            onToggleMute={toggleMuted}
            toast={toast}
          />
        ) : (
          <header className="karma-chakra-nav">
            <button type="button" className="karma-chakra-back" onClick={onExit}>
              {GAME_UI.back}
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
            <div className="karma-chakra-wheel-area">
              <div
                className={`karma-chakra-wheel ${streak >= 3 ? "is-hot" : ""}`}
                key={round.prakriti.id}
                role="group"
                aria-label={GAME_UI.tapKarma}
                style={{ "--orbit-r": RING_MID_RADIUS } as React.CSSProperties}
              >
                <div className="karma-chakra-mandala" aria-hidden="true">
                  <span className="karma-chakra-ambient" />
                  <span className="karma-chakra-spokes" />
                  <span className="karma-chakra-ring karma-chakra-ring--mid" />
                  <span className="karma-chakra-orbit" />
                  <span className="karma-chakra-ring karma-chakra-ring--outer" />
                  <span className="karma-chakra-orbit-dots" />
                </div>
                <div
                  className="karma-chakra-hex-aura"
                  aria-hidden="true"
                  style={{ clipPath: octagonClipPath(RING_OUTER_RADIUS) }}
                />
                <div
                  className="karma-chakra-hex-sparkles"
                  aria-hidden="true"
                  style={{ clipPath: octagonClipPath(RING_OUTER_RADIUS) }}
                />

                <div className="karma-chakra-ring-segments">
                  {KARMA_OPTION_ORDER.map((cell, segmentIndex) => {
                    const karmaName = getKarmaDisplayName(cell, lang);

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
                        style={
                          {
                            "--seg-i": segmentIndex,
                            clipPath: wedgeClipPath(
                              segmentIndex,
                              RING_INNER_RADIUS,
                              RING_OUTER_RADIUS,
                            ),
                          } as React.CSSProperties
                        }
                        aria-label={karmaName}
                        disabled={grading}
                        onClick={() => pickKarma(cell)}
                      />
                    );
                  })}
                </div>

                <div className="karma-chakra-ring-labels" aria-hidden="true">
                  {KARMA_OPTION_ORDER.map((cell, segmentIndex) => {
                    const isWrong = feedbackWrong === cell;
                    const isCorrect = feedbackCorrect === cell;
                    const karmaName = getKarmaDisplayName(cell, lang);
                    const labelPos = segmentLabelPosition(
                      segmentIndex,
                      RING_LABEL_RADIUS,
                    );

                    return (
                      <div
                        key={`label-${cell}`}
                        className={karmaLabelClass(
                          cell,
                          feedbackWrong,
                          feedbackCorrect,
                          grading,
                        )}
                        style={
                          {
                            "--seg-i": segmentIndex,
                            left: labelPos.left,
                            top: labelPos.top,
                          } as React.CSSProperties
                        }
                      >
                        <div className="karma-chakra-label-chip">
                          <span className="karma-chakra-option-icon" aria-hidden>
                            {KARMA_CELL_ICONS[cell]}
                          </span>
                          <span className="karma-chakra-option-name">
                            {getKarmaWheelLines(cell, lang).map(
                              (line, lineIndex) => (
                                <span
                                  key={`${cell}-${lineIndex}`}
                                  className="karma-chakra-option-line"
                                >
                                  {line}
                                </span>
                              ),
                            )}
                          </span>
                        </div>
                        {isWrong && (
                          <span className="karma-chakra-option-mark is-wrong">✕</span>
                        )}
                        {isCorrect && (
                          <span className="karma-chakra-option-mark is-correct">✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="karma-chakra-center">
                  <span className="karma-chakra-center-aura" aria-hidden="true" />
                  <span className="karma-chakra-center-label">{GAME_UI.matchThis}</span>
                  <p className="karma-chakra-center-word" key={round.prakriti.id}>
                    {getDisplayLines(round.prakriti.names[lang], lang).map(
                      (line, lineIndex) => (
                        <span
                          key={`${round.prakriti.id}-${lineIndex}`}
                          className="karma-chakra-center-line"
                        >
                          {line}
                        </span>
                      ),
                    )}
                  </p>
                </div>
              </div>

              <p className="karma-chakra-options-hint">{GAME_UI.tapKarma}</p>
            </div>
          </article>

          <button
            type="button"
            className="karma-chakra-skip"
            onClick={skipRound}
            disabled={grading}
          >
            {GAME_UI.skip} →
          </button>
        </main>
      )}

      <div className={`karma-chakra-screen ${mode === "start" ? "" : "hide"}`}>
        <div className="text-center mb-6">
          <h1 className="karma-chakra-logotype">{GAME_TITLE}</h1>
          <p className="karma-chakra-sub mt-2">{GAME_SUBTITLE}</p>
        </div>

        <GameInstructionsCard
          howToPlay={GAME_UI.howToPlay}
          steps={content.steps}
          timerNote={content.timerNote}
        />

        <div className="flex justify-center">
          <button type="button" className="karma-chakra-cta" onClick={startGame}>
            {GAME_UI.begin}
          </button>
        </div>
      </div>

      <div className={`karma-chakra-screen ${mode === "over" ? "" : "hide"}`}>
        <div className="karma-chakra-sub">{result.verdict}</div>
        <h1 className="karma-chakra-logotype karma-chakra-score">{result.score}</h1>
        <div className="karma-chakra-presents">{GAME_UI.totalScore}</div>
        <div className="karma-chakra-stats">
          <div className="karma-chakra-stat">
            <u>{result.correct}</u>
            <s>{GAME_UI.correctLabel.toUpperCase()}</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.accuracy}</u>
            <s>{GAME_UI.accuracy}</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.bestStreak}</u>
            <s>{GAME_UI.bestStreak}</s>
          </div>
        </div>
        <button
          type="button"
          className="karma-chakra-cta karma-chakra-cta--ghost"
          onClick={onExit}
        >
          {GAME_UI.back}
        </button>
      </div>
    </div>
  );
}
