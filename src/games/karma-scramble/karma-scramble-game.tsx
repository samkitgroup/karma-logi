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
import { GameInstructionsCard } from "@/components/game-instructions-card";
import { GamePlayHud } from "@/components/game-play-hud";
import { GAME_TITLES, GAME_UI } from "@/lib/game-ui-labels";
import { SCRAMBLE_CONTENT } from "./labels";
import "./karma-scramble.css";
import { GAME_DURATION_MS } from "@/lib/game-config";
import {
  buildSessionDeck,
  getAnswerUnits,
  getDisplayAnswer,
  type ScrambleItem,
} from "@/lib/karma-scramble-data";
import type { Lang } from "@/lib/language";
import { SessionDeck } from "@/lib/session-deck";

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
  const deckRef = useRef<SessionDeck<ScrambleItem> | null>(null);
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
    if (!deck) {
      finishGame();
      return;
    }

    const item = deck.drawNext();
    if (!item) {
      finishGame();
      return;
    }

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
    deckRef.current = new SessionDeck(buildSessionDeck(), (item) => item.id, {
      shuffle: false,
    });
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
      showToast(GAME_UI.wrongTryAgain, false);
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
      ? content.kindKarma
      : `${content.kindPrakriti} · ${puzzle?.item.karmaName[lang] ?? ""}`;

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
      <div className="karma-scramble-chrome">
        {mode === "play" ? (
          <GamePlayHud
            title={GAME_TITLES.scramble}
            timeLeftMs={timeLeftMs}
            timeProgress={timeProgress}
            score={score}
            streak={streak}
            correct={solved}
            scoreLabel={GAME_UI.scoreLabel}
            streakLabel={GAME_UI.streakLabel}
            correctLabel={GAME_UI.solvedCountScramble}
            timeLabel={GAME_UI.timeLeft}
            backLabel={GAME_UI.back}
            muted={muted}
            onExit={onExit}
            onToggleMute={toggleMuted}
            toast={toast}
          />
        ) : (
          <header className="karma-scramble-nav">
            <button type="button" className="karma-scramble-back" onClick={onExit}>
              {GAME_UI.back}
            </button>
            <div className="karma-scramble-title">{GAME_TITLES.scramble}</div>
            <button
              type="button"
              className="karma-scramble-icon-btn"
              onClick={toggleMuted}
              aria-label={muted ? "Unmute sound" : "Mute sound"}
            >
              {muted ? "✕" : "♪"}
            </button>
          </header>
        )}
      </div>

      {mode === "play" && puzzle && (
        <main className="karma-scramble-main">
          <article className={`karma-scramble-play ${shake ? "shake" : ""}`}>
            <div className="karma-scramble-puzzle">
              <span className="karma-scramble-kind">{kindLabel}</span>
              <p className="karma-scramble-hint">{description}</p>

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
                      {char ?? ""}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="karma-scramble-keyboard">
              <p className="karma-scramble-prompt">{GAME_UI.tapLetters}</p>
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
            </div>
          </article>

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

      <div className={`karma-scramble-screen ${mode === "start" ? "" : "hide"}`}>
        {/* Title Group */}
        <div className="text-center mb-6">
          <h1 className="karma-scramble-logotype">{GAME_TITLES.scramble}</h1>
          <p className="mt-2 text-sm font-semibold tracking-wide text-gold-dim">
            {content.subtitle}
          </p>
        </div>

        <GameInstructionsCard
          howToPlay={GAME_UI.howToPlay}
          steps={content.steps}
          timerNote={content.timerNote}
        />

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
        <button
          type="button"
          className="karma-scramble-cta karma-scramble-cta--ghost"
          onClick={onExit}
        >
          {GAME_UI.back}
        </button>
      </div>
    </div>
  );
}
