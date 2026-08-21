"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { haptic, playTone, resumeAudio } from "@/games/karma-chakra/audio";
import { QUEST_LABELS } from "./labels";
import "./karma-quest.css";
import { GAME_DURATION_MS, formatGameTime } from "@/lib/game-config";
import {
  buildQuestDeck,
  buildQuestionOptions,
  scoreQuestAnswer,
  type KarmaOption,
  type KarmaQuestId,
  type QuestQuestion,
} from "@/lib/karma-quest-data";
import type { Lang } from "@/lib/language";

type GameMode = "start" | "play" | "over";

type RoundState = {
  question: QuestQuestion;
  options: KarmaOption[];
};

type ResultState = {
  score: number;
  solved: number;
  tries: number;
  bestStreak: number;
};

const FEEDBACK_MS = 900;

function buildRound(question: QuestQuestion): RoundState {
  return {
    question,
    options: buildQuestionOptions(question.karmaId),
  };
}

function optionClass(
  karmaId: KarmaQuestId,
  feedbackWrong: KarmaQuestId | null,
  feedbackCorrect: KarmaQuestId | null,
  grading: boolean,
): string {
  const classes = ["karma-quest-option"];

  if (feedbackWrong === karmaId) {
    classes.push("is-wrong");
  } else if (feedbackCorrect === karmaId) {
    classes.push(feedbackWrong ? "is-correct-reveal" : "is-correct");
  } else if (grading) {
    classes.push("is-dimmed");
  }

  return classes.join(" ");
}

function optionStatus(
  karmaId: KarmaQuestId,
  feedbackWrong: KarmaQuestId | null,
  feedbackCorrect: KarmaQuestId | null,
  grading: boolean,
): "wrong" | "correct" | null {
  if (!grading) {
    return null;
  }
  if (feedbackWrong === karmaId) {
    return "wrong";
  }
  if (feedbackCorrect === karmaId) {
    return "correct";
  }
  return null;
}

export function KarmaQuestGame({
  onExit,
  lang,
  onComplete,
}: {
  onExit: () => void;
  lang: Lang;
  onComplete?: (score: number) => void;
}) {
  const labels = QUEST_LABELS[lang];
  const deckRef = useRef<QuestQuestion[]>([]);
  const deckIndexRef = useRef(0);
  const endsAtRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const toastRef = useRef<number | null>(null);
  const advanceRef = useRef<number | null>(null);
  const endedRef = useRef(false);
  const statsRef = useRef({ score: 0, solved: 0, tries: 0, bestStreak: 0 });
  const mutedRef = useRef(false);
  const reducedRef = useRef(false);

  const [mode, setMode] = useState<GameMode>("start");
  const [grading, setGrading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [tries, setTries] = useState(0);
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [timeProgress, setTimeProgress] = useState(100);
  const [round, setRound] = useState<RoundState | null>(null);
  const [feedbackWrong, setFeedbackWrong] = useState<KarmaQuestId | null>(null);
  const [feedbackCorrect, setFeedbackCorrect] = useState<KarmaQuestId | null>(
    null,
  );
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState({ text: "", good: false, visible: false });
  const [result, setResult] = useState<ResultState>({
    score: 0,
    solved: 0,
    tries: 0,
    bestStreak: 0,
  });

  useEffect(() => {
    statsRef.current = { score, solved, tries, bestStreak };
  }, [score, solved, tries, bestStreak]);

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

  const finishGame = useCallback(() => {
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
    setResult({ ...statsRef.current });
    onComplete?.(statsRef.current.score);
    playTone("done", mutedRef.current);
    haptic([12, 60, 12, 60, 20], reducedRef.current);
  }, [clearAdvanceTimer, onComplete]);

  const loadNextRound = useCallback(() => {
    setGrading(false);
    setFeedbackWrong(null);
    setFeedbackCorrect(null);
    setShake(false);

    if (Date.now() >= endsAtRef.current) {
      finishGame();
      return;
    }

    const deck = deckRef.current;
    if (deck.length === 0) {
      finishGame();
      return;
    }

    if (deckIndexRef.current >= deck.length) {
      deckIndexRef.current = 0;
    }

    const question = deck[deckIndexRef.current];
    deckIndexRef.current += 1;
    setRound(buildRound(question));
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
        finishGame();
      }
    }, 100);
  }, [finishGame]);

  const startGame = useCallback(() => {
    resumeAudio();
    endedRef.current = false;
    deckRef.current = buildQuestDeck();
    deckIndexRef.current = 0;
    endsAtRef.current = Date.now() + GAME_DURATION_MS;
    setGrading(false);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSolved(0);
    setTries(0);
    setTimeLeftMs(GAME_DURATION_MS);
    setTimeProgress(100);
    setMode("play");
    startTimer();
    loadNextRound();
    playTone("tick", mutedRef.current);
  }, [loadNextRound, startTimer]);

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

  const answer = useCallback(
    (selectedId: KarmaQuestId) => {
      if (!round || grading || mode !== "play") {
        return;
      }

      setGrading(true);
      setTries((value) => value + 1);
      const correctId = round.question.karmaId;

      if (selectedId === correctId) {
        setStreak((prevStreak) => {
          const nextStreak = prevStreak + 1;
          const points = scoreQuestAnswer(nextStreak);
          setScore((value) => value + points);
          setSolved((value) => value + 1);
          setBestStreak((value) => Math.max(value, nextStreak));
          setFeedbackCorrect(correctId);
          showToast(`${labels.solved} +${points}`, true);
          playTone("good", mutedRef.current);
          haptic([8, 40, 14], reducedRef.current);
          advanceAfter(520);
          return nextStreak;
        });
        return;
      }

      setStreak(0);
      setFeedbackWrong(selectedId);
      setFeedbackCorrect(correctId);
      setShake(true);
      showToast(labels.wrong, false);
      playTone("bad", mutedRef.current);
      haptic(90, reducedRef.current);
      advanceAfter(FEEDBACK_MS);
    },
    [advanceAfter, grading, labels.solved, labels.wrong, mode, round, showToast],
  );

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
    <div className="karma-quest-root">
      <header className="karma-quest-top">
        <button type="button" className="karma-quest-back" onClick={onExit}>
          {labels.back}
        </button>
        <div className="karma-quest-title">{labels.title}</div>
        <div className="karma-quest-pill karma-quest-timer">
          <b>{formatGameTime(timeLeftMs)}</b>
        </div>
        <button
          type="button"
          className="karma-quest-pill"
          onClick={toggleMuted}
          aria-label="Toggle sound"
        >
          {muted ? "✕" : "♪"}
        </button>
      </header>

      {mode === "play" && (
        <div className="karma-quest-track" aria-hidden>
          <i style={{ width: `${timeProgress}%` }} />
        </div>
      )}

      {mode === "play" && round && (
        <main className="karma-quest-main">
          <div className="karma-quest-score-row">
            <span>
              {labels.scoreLabel} <b>{score}</b>
            </span>
            <span className={streak >= 2 ? "hot" : undefined}>
              {labels.streakLabel} <b>×{streak}</b>
            </span>
            <span>
              {labels.correctLabel} <b>{solved}</b>
            </span>
          </div>

          <section className={`karma-quest-card ${shake ? "shake" : ""}`}>
            <span className="karma-quest-badge">{labels.badge}</span>
            <p className="karma-quest-situation">
              {round.question.situation[lang]}
            </p>
          </section>

          <p className="karma-quest-prompt">{labels.prompt}</p>

          <div className="karma-quest-grid">
            {round.options.map((option) => {
              const status = optionStatus(
                option.id,
                feedbackWrong,
                feedbackCorrect,
                grading,
              );

              return (
                <button
                  key={option.id}
                  type="button"
                  className={optionClass(
                    option.id,
                    feedbackWrong,
                    feedbackCorrect,
                    grading,
                  )}
                  disabled={grading}
                  onClick={() => answer(option.id)}
                >
                  <span className="karma-quest-option-name">
                    {option.name[lang]}
                  </span>
                  {status === "wrong" && (
                    <span className="karma-quest-option-status is-wrong">
                      ✕
                    </span>
                  )}
                  {status === "correct" && (
                    <span className="karma-quest-option-status is-correct">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="karma-quest-skip"
            onClick={skipRound}
            disabled={grading}
          >
            {labels.skip} →
          </button>
        </main>
      )}

      <div
        className={`karma-quest-toast ${toast.visible ? "on" : ""} ${
          toast.good ? "good" : toast.text ? "bad" : ""
        }`}
      >
        {toast.text}
      </div>

      <div className={`karma-quest-screen ${mode === "start" ? "" : "hide"}`}>
        <h1 className="karma-quest-logotype">{labels.title}</h1>
        <p className="karma-quest-sub">{labels.subtitle}</p>
        <p className="karma-quest-sub">60 seconds · 30 situations · 4 options each.</p>
        <button type="button" className="karma-quest-cta" onClick={startGame}>
          {labels.begin}
        </button>
      </div>

      <div className={`karma-quest-screen ${mode === "over" ? "" : "hide"}`}>
        <p className="karma-quest-sub">{labels.timeUp}</p>
        <h1 className="karma-quest-logotype">{result.score}</h1>
        <p className="karma-quest-sub">{labels.score}</p>
        <div className="karma-quest-stats">
          <div className="karma-quest-stat">
            <u>{result.solved}</u>
            <s>{labels.solvedCount}</s>
          </div>
          <div className="karma-quest-stat">
            <u>{result.tries ? Math.round((result.solved / result.tries) * 100) : 0}%</u>
            <s>{labels.accuracy}</s>
          </div>
          <div className="karma-quest-stat">
            <u>{result.bestStreak}</u>
            <s>{labels.bestStreak}</s>
          </div>
        </div>
        <button type="button" className="karma-quest-cta karma-quest-cta--ghost" onClick={onExit}>
          {labels.back}
        </button>
      </div>
    </div>
  );
}
