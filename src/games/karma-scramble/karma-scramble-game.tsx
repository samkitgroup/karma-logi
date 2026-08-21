"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  applyManualHint,
  buildFillableIndices,
  buildLockedSlots,
  pickStarterHintIndices,
  remainingLetters,
  scoreForPuzzle,
  selectionMatchesAnswer,
  shuffleLetters,
  type LetterTile,
  type PuzzleState,
} from "./scramble-engine";
import { haptic, playTone, resumeAudio } from "@/games/karma-chakra/audio";
import { SCRAMBLE_CONTENT } from "./labels";
import "./karma-scramble.css";
import { GAME_DURATION_MS, formatGameTime } from "@/lib/game-config";
import { GAME_TITLES, GAME_UI } from "@/lib/game-ui-labels";
import {
  buildSessionDeck,
  getAnswerUnits,
  getDisplayAnswer,
  type ScrambleItem,
} from "@/lib/karma-scramble-data";
import type { Lang } from "@/lib/language";

type GameMode = "start" | "play" | "over";

type ResultState = {
  score: number;
  solved: number;
  tries: number;
  bestStreak: number;
};

function buildPuzzle(item: ScrambleItem, lang: Lang): PuzzleState {
  const answer = getAnswerUnits(item, lang);
  const starterIndices = pickStarterHintIndices(answer.length);
  const locked = buildLockedSlots(answer, starterIndices, "starter");
  const tiles = shuffleLetters(remainingLetters(answer, locked));

  return {
    item,
    answer,
    tiles,
    selection: [],
    locked,
    manualHintsUsed: 0,
  };
}

export function KarmaScrambleGame({
  onExit,
  lang,
  onComplete,
}: {
  onExit: () => void;
  lang: Lang;
  onComplete?: (score: number) => void;
}) {
  const content = SCRAMBLE_CONTENT[lang];
  const deckRef = useRef<ScrambleItem[]>([]);
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
  const [puzzle, setPuzzle] = useState<PuzzleState | null>(null);
  const [slotTone, setSlotTone] = useState<"idle" | "ok" | "bad">("idle");
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

  const usedTileIds = useMemo(
    () => new Set(puzzle?.selection.map((tile) => tile.id) ?? []),
    [puzzle?.selection],
  );

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

  const loadNextPuzzle = useCallback(() => {
    setGrading(false);
    setSlotTone("idle");
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

    const item = deck[deckIndexRef.current];
    deckIndexRef.current += 1;
    setPuzzle(buildPuzzle(item, lang));
  }, [finishGame, lang]);

  const advanceAfter = useCallback(
    (delay: number, onDone?: () => void) => {
      clearAdvanceTimer();
      advanceRef.current = window.setTimeout(() => {
        onDone?.();
        loadNextPuzzle();
      }, delay);
    },
    [clearAdvanceTimer, loadNextPuzzle],
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
    deckRef.current = buildSessionDeck();
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
    loadNextPuzzle();
    playTone("tick", mutedRef.current);
  }, [loadNextPuzzle, startTimer]);

  const clearSelection = useCallback(() => {
    if (!puzzle || grading) {
      return;
    }
    setSlotTone("idle");
    setPuzzle((current) => (current ? { ...current, selection: [] } : current));
    playTone("tick", mutedRef.current);
  }, [grading, puzzle]);

  const skipPuzzle = useCallback(() => {
    if (!puzzle || grading || mode !== "play") {
      return;
    }
    setGrading(true);
    setTries((value) => value + 1);
    setStreak(0);
    showToast(GAME_UI.skipped, false);
    playTone("tick", mutedRef.current);
    haptic(6, reducedRef.current);
    advanceAfter(420);
  }, [advanceAfter, grading, mode, puzzle, showToast]);

  const submitSelection = useCallback(
    (selection: LetterTile[], current: PuzzleState) => {
      setGrading(true);
      setTries((value) => value + 1);

      if (selectionMatchesAnswer(selection, current.answer, current.locked)) {
        setStreak((prevStreak) => {
          const nextStreak = prevStreak + 1;
          const points = scoreForPuzzle(
            current.answer.length,
            nextStreak,
            current.manualHintsUsed,
          );
          setScore((value) => value + points);
          setSolved((value) => value + 1);
          setBestStreak((value) => Math.max(value, nextStreak));
          setSlotTone("ok");
          const answerLabel = getDisplayAnswer(current.item, lang);
          showToast(`${answerLabel} — ${GAME_UI.solved} +${points}`, true);
          playTone("good", mutedRef.current);
          haptic([8, 40, 14], reducedRef.current);
          advanceAfter(520);
          return nextStreak;
        });
        return;
      }

      setStreak(0);
      setSlotTone("bad");
      setShake(true);
      showToast(GAME_UI.wrong, false);
      playTone("bad", mutedRef.current);
      haptic(90, reducedRef.current);
      advanceRef.current = window.setTimeout(() => {
        setGrading(false);
        setSlotTone("idle");
        setShake(false);
        setPuzzle((puzzleState) =>
          puzzleState ? { ...puzzleState, selection: [] } : puzzleState,
        );
      }, 700);
    },
    [advanceAfter, lang, showToast],
  );

  const pickLetter = useCallback(
    (tile: LetterTile) => {
      if (!puzzle || grading || usedTileIds.has(tile.id)) {
        return;
      }

      const fillableCount = buildFillableIndices(
        puzzle.answer.length,
        puzzle.locked,
      ).length;
      const nextSelection = [...puzzle.selection, tile];
      setSlotTone("idle");
      setPuzzle({ ...puzzle, selection: nextSelection });
      playTone("tick", mutedRef.current);
      haptic(4, reducedRef.current);

      if (nextSelection.length === fillableCount) {
        submitSelection(nextSelection, puzzle);
      }
    },
    [grading, puzzle, submitSelection, usedTileIds],
  );

  const useHint = useCallback(() => {
    if (!puzzle || grading || mode !== "play") {
      return;
    }

    const nextPuzzle = applyManualHint(puzzle);
    if (!nextPuzzle) {
      return;
    }

    setPuzzle(nextPuzzle);
    showToast(`${GAME_UI.hintUsed} (${GAME_UI.hintPenalty})`, false);
    playTone("tick", mutedRef.current);
    haptic(6, reducedRef.current);
  }, [grading, mode, puzzle, showToast]);

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

  const kindLabel =
    puzzle?.item.kind === "karma"
      ? GAME_UI.kindKarma
      : `${GAME_UI.kindPrakriti} · ${puzzle?.item.karmaName[lang] ?? ""}`;

  const description = puzzle?.item.description[lang] ?? "";

  const canUseHint =
    puzzle &&
    !grading &&
    buildFillableIndices(puzzle.answer.length, puzzle.locked).some(
      (_, selectionIndex) => !puzzle.selection[selectionIndex],
    );

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
    <div className="karma-scramble-root">
      <header className="karma-scramble-top">
        <button type="button" className="karma-scramble-back" onClick={onExit}>
          {GAME_UI.back}
        </button>
        <div className="karma-scramble-title">{GAME_TITLES.scramble}</div>
        <div className="karma-scramble-pill karma-scramble-timer">
          <b>{formatGameTime(timeLeftMs)}</b>
        </div>
        <button
          type="button"
          className="karma-scramble-pill"
          onClick={toggleMuted}
          aria-label="Toggle sound"
        >
          {muted ? "✕" : "♪"}
        </button>
      </header>

      {mode === "play" && (
        <div className="karma-scramble-track" aria-hidden>
          <i style={{ width: `${timeProgress}%` }} />
        </div>
      )}

      {mode === "play" && puzzle && (
        <main className="karma-scramble-main">
          <div className="karma-scramble-score-row">
            <span>
              Score <b>{score}</b>
            </span>
            <span>
              Streak <b>×{streak}</b>
            </span>
            <span>
              Solved <b>{solved}</b>
            </span>
          </div>

          <section className={`karma-scramble-card ${shake ? "shake" : ""}`}>
            <span className="karma-scramble-badge">{GAME_UI.badgeScramble}</span>

            <div className="karma-scramble-slots" aria-live="polite">
              {puzzle.answer.map((_, index) => {
                const locked = puzzle.locked[index];
                const fillable = buildFillableIndices(
                  puzzle.answer.length,
                  puzzle.locked,
                );
                const selectionIndex = fillable.indexOf(index);
                const char =
                  locked?.char ??
                  (selectionIndex >= 0
                    ? puzzle.selection[selectionIndex]?.char
                    : undefined);
                const tone = locked
                  ? "locked"
                  : slotTone === "idle"
                    ? "idle"
                    : slotTone === "ok"
                      ? "ok"
                      : "bad";
                return (
                  <span
                    key={`${puzzle.item.id}-${index}`}
                    className={`karma-scramble-slot ${char ? tone : "empty"}`}
                  >
                    {char ?? "—"}
                  </span>
                );
              })}
            </div>

            <p className="karma-scramble-kind">{kindLabel}</p>
            <p className="karma-scramble-hint">{description}</p>
            <div className="karma-scramble-prompt">{GAME_UI.tapLetters}</div>
          </section>

          <div className="karma-scramble-tiles">
            {puzzle.tiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                className={`karma-scramble-tile ${usedTileIds.has(tile.id) ? "used" : ""}`}
                disabled={usedTileIds.has(tile.id) || grading}
                onClick={() => pickLetter(tile)}
              >
                {tile.char}
              </button>
            ))}
          </div>

          <div className="karma-scramble-actions">
            <button
              type="button"
              className="karma-scramble-action hint"
              onClick={useHint}
              disabled={grading || !canUseHint}
            >
              💡 {GAME_UI.hint}
            </button>
            <button
              type="button"
              className="karma-scramble-action"
              onClick={clearSelection}
              disabled={
                grading ||
                puzzle.selection.length === 0 ||
                buildFillableIndices(puzzle.answer.length, puzzle.locked).length ===
                  0
              }
            >
              ↺ {GAME_UI.clear}
            </button>
            <button
              type="button"
              className="karma-scramble-action skip"
              onClick={skipPuzzle}
              disabled={grading}
            >
              {GAME_UI.skip} →
            </button>
          </div>
        </main>
      )}

      <div
        className={`karma-scramble-toast ${toast.visible ? "on" : ""} ${
          toast.good ? "good" : toast.text ? "bad" : ""
        }`}
      >
        {toast.text}
      </div>

      <div className={`karma-scramble-screen ${mode === "start" ? "" : "hide"}`}>
        {/* Title Group */}
        <div className="text-center mb-6">
          <h1 className="karma-scramble-logotype">{GAME_TITLES.scramble}</h1>
          <p className="mt-2 text-sm font-semibold tracking-wide text-gold-dim">
            {content.subtitle}
          </p>
        </div>

        {/* Grouped Instructions Card */}
        <div className="mx-auto w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.2)] mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-text-subtle border-b border-white/5 pb-2.5 mb-3.5 text-center">
            {GAME_UI.howToPlay}
          </p>
          <ul className="space-y-3.5 pl-1 text-left">
            {content.rules.split("·").map((rule, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[15.5px] font-bold text-foreground">
                <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-bright shadow-[0_0_8px_rgba(255,184,0,0.8)]" />
                <span className="leading-normal">{rule.trim()}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Play Button */}
        <div className="flex justify-center">
          <button type="button" className="karma-scramble-cta" onClick={startGame}>
            {GAME_UI.begin}
          </button>
        </div>
      </div>

      <div className={`karma-scramble-screen ${mode === "over" ? "" : "hide"}`}>
        <p className="karma-scramble-sub">{GAME_UI.timeUp}</p>
        <h1 className="karma-scramble-logotype">{result.score}</h1>
        <p className="karma-scramble-sub">{GAME_UI.score}</p>
        <div className="karma-scramble-stats">
          <div className="karma-scramble-stat">
            <u>{result.solved}</u>
            <s>{GAME_UI.solvedCountScramble}</s>
          </div>
          <div className="karma-scramble-stat">
            <u>{result.tries ? Math.round((result.solved / result.tries) * 100) : 0}%</u>
            <s>{GAME_UI.accuracy}</s>
          </div>
          <div className="karma-scramble-stat">
            <u>{result.bestStreak}</u>
            <s>{GAME_UI.bestStreak}</s>
          </div>
        </div>
        <button type="button" className="karma-scramble-cta karma-scramble-cta--ghost" onClick={onExit}>
          {GAME_UI.back}
        </button>
      </div>
    </div>
  );
}
