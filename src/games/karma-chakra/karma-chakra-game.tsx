"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { haptic, playTone, resumeAudio } from "./audio";
import {
  burst,
  computeLayout,
  createStars,
  nearestPetal,
  petalPos,
  renderFrame,
  stream,
} from "./canvas-renderer";
import {
  COLORS,
  CHAKRA_CONTENT,
  findPrakritiById,
  GAME_SUBTITLE,
  GAME_TITLE,
  CHAKRA_COACH,
  pickRandomPrakriti,
  getKarmaDisplayName,
} from "./content";
import "./karma-chakra.css";
import { GAME_DURATION_MS, formatGameTime } from "@/lib/game-config";
import { GAME_UI } from "@/lib/game-ui-labels";
import type { Lang } from "@/lib/language";
import type {
  GameMode,
  GameState,
  Mote,
  Particle,
  ResultState,
  Star,
} from "./types";

const FEEDBACK_MS = 750;
const SPAWN_DELAY_MS = 280;

function createInitialState(reduced: boolean, lang: Lang): GameState {
  return {
    mode: "start",
    lang,
    round: 0,
    total: 0,
    score: 0,
    streak: 0,
    best: 0,
    hits: 0,
    tries: 0,
    met: new Set<number>(),
    bond: null,
    drag: false,
    target: -1,
    feedbackWrong: -1,
    feedbackCorrect: -1,
    feedbackUntil: 0,
    grading: false,
    endsAt: 0,
    muted: false,
    shake: 0,
    pulse: 0,
    reduced,
  };
}

export function KarmaChakraGame({
  onExit,
  lang: langProp,
  onComplete,
}: {
  onExit: () => void;
  lang: Lang;
  onComplete?: (score: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const fontFamilyRef = useRef("Georgia, serif");
  const timerTextRef = useRef<HTMLSpanElement>(null);
  const timerBarRef = useRef<HTMLElement>(null);
  const stateRef = useRef<GameState>(
    createInitialState(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      langProp,
    ),
  );
  const layoutRef = useRef(computeLayout(390, 844));
  const starsRef = useRef<Star[]>(createStars());
  const particlesRef = useRef<Particle[]>([]);
  const motesRef = useRef<Mote[]>([]);
  const toastTimerRef = useRef<number | null>(null);
  const coachTimerRef = useRef<number | null>(null);
  const spawnTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);
  const lastUiSyncRef = useRef(0);

  const [mode, setMode] = useState<GameMode>("start");
  const [lang, setLang] = useState<Lang>("en");
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [hits, setHits] = useState(0);
  const [toast, setToast] = useState({ text: "", bad: false, visible: false });
  const [coachVisible, setCoachVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const [result, setResult] = useState<ResultState>({
    verdict: "JOURNEY COMPLETE",
    score: 0,
    correct: 0,
    accuracy: "0%",
    bestStreak: 0,
  });

  const updateTimerDisplay = useCallback((remainingMs: number) => {
    const clamped = Math.max(0, remainingMs);
    const progress = (clamped / GAME_DURATION_MS) * 100;
    if (timerTextRef.current) {
      timerTextRef.current.textContent = formatGameTime(clamped);
    }
    if (timerBarRef.current) {
      timerBarRef.current.style.width = `${progress}%`;
    }
  }, []);

  const syncUi = useCallback(() => {
    const state = stateRef.current;
    setMode(state.mode);
    setLang(state.lang);
    setScore(state.score);
    setStreak(state.streak);
    setHits(state.hits);
    setMuted(state.muted);
    if (state.mode === "play" && state.endsAt > 0) {
      updateTimerDisplay(state.endsAt - Date.now());
    }
  }, [updateTimerDisplay]);

  useEffect(() => {
    stateRef.current.lang = langProp;
    const bond = stateRef.current.bond;
    if (bond?.prakritiId) {
      const prakriti = findPrakritiById(bond.prakritiId);
      if (prakriti) {
        bond.text = prakriti.names[langProp];
      }
    }
    syncUi();
  }, [langProp, syncUi]);

  const showToast = useCallback((text: string, bad = false) => {
    setToast({ text, bad, visible: true });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 900);
  }, []);

  const finish = useCallback(
    (timeUp = false) => {
      const state = stateRef.current;
      if (state.mode === "over") {
        return;
      }
      state.mode = "over";
      state.bond = null;
      state.grading = false;
      state.feedbackWrong = -1;
      state.feedbackCorrect = -1;
      state.feedbackUntil = 0;
      if (spawnTimerRef.current) {
        window.clearTimeout(spawnTimerRef.current);
      }
      syncUi();

      setResult({
        verdict: timeUp ? GAME_UI.timeUp : GAME_UI.roundComplete,
        score: state.score,
        correct: state.hits,
        accuracy: `${state.tries ? Math.round((state.hits / state.tries) * 100) : 0}%`,
        bestStreak: state.best,
      });

      onComplete?.(state.score);
      playTone("done", state.muted);
      haptic([12, 60, 12, 60, 20], state.reduced);
    },
    [onComplete, syncUi],
  );

  const spawn = useCallback(() => {
    const state = stateRef.current;
    const layout = layoutRef.current;

    if (state.mode !== "play" || state.grading) {
      return;
    }

    if (Date.now() >= state.endsAt) {
      finish(true);
      return;
    }

    const karmaIndex = (Math.random() * 8) | 0;
    const prakriti = pickRandomPrakriti(karmaIndex);
    const speed = 46 + Math.min(state.round, 24) * 2.2;

    state.bond = {
      text: prakriti.names[state.lang],
      prakritiId: prakriti.id,
      k: karmaIndex,
      fx: prakriti.fx,
      x: layout.cx,
      y: layout.spawnY,
      t: 0,
      speed,
      y0toC: Math.max(
        60,
        Math.hypot(layout.cx - layout.cx, layout.spawnY - layout.cy) - layout.jiva,
      ),
    };
    state.round += 1;
    state.target = -1;
    state.pulse = 0;
    syncUi();
  }, [finish, syncUi]);

  const scheduleSpawn = useCallback(
    (delay = SPAWN_DELAY_MS) => {
      if (spawnTimerRef.current) {
        window.clearTimeout(spawnTimerRef.current);
      }
      spawnTimerRef.current = window.setTimeout(() => {
        const state = stateRef.current;
        if (state.mode !== "play" || state.grading || Date.now() >= state.endsAt) {
          if (state.mode === "play" && Date.now() >= state.endsAt) {
            finish(true);
          }
          return;
        }
        spawn();
      }, delay);
    },
    [finish, spawn],
  );

  const showFeedback = useCallback(
    (wrongIndex: number, correctIndex: number) => {
      const state = stateRef.current;
      state.grading = true;
      state.feedbackWrong = wrongIndex;
      state.feedbackCorrect = correctIndex;
      state.feedbackUntil = performance.now() + FEEDBACK_MS;
      state.bond = null;
      state.target = -1;
      state.drag = false;
      state.pulse = 0;
      syncUi();

      if (spawnTimerRef.current) {
        window.clearTimeout(spawnTimerRef.current);
      }
      spawnTimerRef.current = window.setTimeout(() => {
        const current = stateRef.current;
        if (current.mode !== "play") {
          return;
        }
        current.grading = false;
        current.feedbackWrong = -1;
        current.feedbackCorrect = -1;
        current.feedbackUntil = 0;
        syncUi();
        if (Date.now() >= current.endsAt) {
          finish(true);
          return;
        }
        scheduleSpawn();
      }, FEEDBACK_MS);
    },
    [finish, scheduleSpawn, syncUi],
  );

  const grade = useCallback(
    (index: number) => {
      const state = stateRef.current;
      const bond = state.bond;
      if (!bond || state.mode !== "play" || state.grading) {
        return;
      }

      const layout = layoutRef.current;
      const ok = index === bond.k;
      const petal = petalPos(layout, bond.k);
      state.tries += 1;
      state.met.add(bond.k);

      if (ok) {
        state.hits += 1;
        state.streak += 1;
        state.best = Math.max(state.best, state.streak);
        const fast = bond.y < layout.cy - layout.r * 0.75 ? 2 : 1;
        const points = (100 + (state.streak - 1) * 25) * fast;
        state.score += points;
        stream(motesRef.current, bond.x, bond.y, petal.x, petal.y, 22);
        burst(particlesRef.current, petal.x, petal.y, COLORS.goldHi, 30);
        showToast(`${GAME_UI.released} +${points}`);
        playTone("good", state.muted);
        haptic([8, 40, 14], state.reduced);
        state.bond = null;
        state.target = -1;
        state.drag = false;
        state.pulse = 0;
        syncUi();
        scheduleSpawn();
        return;
      }

      state.streak = 0;
      burst(particlesRef.current, bond.x, bond.y, COLORS.rust, 16);
      state.shake = 6;
      
      const correctKarmaName = getKarmaDisplayName(bond.k, state.lang);
      const wrongMsg = state.lang === "hi"
        ? `गलत! यह ${correctKarmaName} से संबंधित है।`
        : state.lang === "gu"
          ? `ખોટું! આ ${correctKarmaName} નું છે.`
          : `Incorrect! It belongs to ${correctKarmaName}.`;
      showToast(wrongMsg, true);

      playTone("bad", state.muted);
      haptic(90, state.reduced);
      showFeedback(index, bond.k);
    },
    [scheduleSpawn, showFeedback, showToast, syncUi],
  );

  const missed = useCallback(() => {
    const state = stateRef.current;
    const bond = state.bond;
    if (!bond || state.grading) {
      return;
    }

    const layout = layoutRef.current;
    state.streak = 0;
    state.tries += 1;
    state.met.add(bond.k);
    burst(particlesRef.current, layout.cx, layout.cy, COLORS.rust, 34);
    state.shake = 9;
    
    const correctKarmaName = getKarmaDisplayName(bond.k, state.lang);
    const missedMsg = state.lang === "hi"
      ? `प्रकृति आत्मा तक पहुँची! (सही: ${correctKarmaName})`
      : state.lang === "gu"
        ? `પ્રકૃતિ આત્મા સુધી પહોંચી! (સાચું: ${correctKarmaName})`
        : `Prakriti reached Jiva! (Correct: ${correctKarmaName})`;
    showToast(missedMsg, true);

    playTone("bad", state.muted);
    haptic([30, 60, 30], state.reduced);
    showFeedback(-1, bond.k);
  }, [showFeedback, showToast]);

  const startGame = useCallback(() => {
    resumeAudio();
    const state = stateRef.current;
    state.mode = "play";
    state.round = 0;
    state.score = 0;
    state.streak = 0;
    state.best = 0;
    state.hits = 0;
    state.tries = 0;
    state.met = new Set();
    state.bond = null;
    state.grading = false;
    state.feedbackWrong = -1;
    state.feedbackCorrect = -1;
    state.feedbackUntil = 0;
    state.endsAt = Date.now() + GAME_DURATION_MS;
    updateTimerDisplay(GAME_DURATION_MS);
    syncUi();
    setCoachVisible(true);
    if (coachTimerRef.current) {
      window.clearTimeout(coachTimerRef.current);
    }
    coachTimerRef.current = window.setTimeout(() => {
      setCoachVisible(false);
    }, 6000);
    spawn();
    playTone("tick", state.muted);
  }, [spawn, syncUi, updateTimerDisplay]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const context = canvas.getContext("2d", { alpha: false });
    if (context) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctxRef.current = context;
    }
    layoutRef.current = computeLayout(width, height);
  }, []);

  useEffect(() => {
    fontFamilyRef.current = getComputedStyle(document.body).fontFamily;
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("orientationchange", () => {
      window.setTimeout(resize, 120);
    });

    const canvas = canvasRef.current;
    if (!canvas) {
      return () => {
        window.removeEventListener("resize", resize);
      };
    }

    const onPointerDown = (event: PointerEvent) => {
      const state = stateRef.current;
      if (state.mode !== "play" || !state.bond || state.grading) {
        return;
      }

      const layout = layoutRef.current;
      const x = event.clientX;
      const y = event.clientY;
      if (
        Math.hypot(x - state.bond.x, y - state.bond.y) <
        Math.max(64, layout.pw * 1.1)
      ) {
        state.drag = true;
        canvas.setPointerCapture(event.pointerId);
        haptic(6, state.reduced);
        playTone("tick", state.muted);
        return;
      }

      const index = nearestPetal(layout, x, y, layout.pw * 1.35);
      if (index >= 0) {
        grade(index);
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      const state = stateRef.current;
      if (!state.drag || !state.bond) {
        return;
      }

      state.bond.x = event.clientX;
      state.bond.y = event.clientY;
      const index = nearestPetal(
        layoutRef.current,
        event.clientX,
        event.clientY,
      );
      if (index !== state.target) {
        state.target = index;
        if (index >= 0) {
          haptic(4, state.reduced);
        }
      }
    };

    const release = () => {
      const state = stateRef.current;
      if (!state.drag || !state.bond || state.grading) {
        state.drag = false;
        return;
      }

      state.drag = false;
      if (state.target >= 0) {
        grade(state.target);
      } else {
        state.bond.ret = true;
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);

    const loop = (frameTime: number) => {
      if (lastFrameRef.current === 0) {
        lastFrameRef.current = frameTime;
      }
      const dt = Math.min((frameTime - lastFrameRef.current) / 16.667, 3);
      const deltaSec = Math.min((frameTime - lastFrameRef.current) / 1000, 0.05);
      lastFrameRef.current = frameTime;
      const state = stateRef.current;
      const layout = layoutRef.current;
      const context = ctxRef.current;

      if (state.mode === "play" && state.bond && !state.grading) {
        const bond = state.bond;
        const { cx, cy } = layout;

        if (!state.drag) {
          if (bond.ret) {
            bond.x += (cx - bond.x) * 0.14 * dt;
            bond.y += (bond.speed / 60) * dt;
            if (Math.abs(bond.x - cx) < 1.5) {
              bond.x = cx;
              bond.ret = false;
            }
          } else {
            bond.y += (bond.speed / 60) * dt;
            bond.x += (cx - bond.x) * 0.06 * dt;
          }
          state.target = -1;
        }

        const distance = Math.hypot(bond.x - cx, bond.y - cy);
        state.pulse = Math.max(0, 1 - (distance - layout.jiva) / (layout.r * 0.9));

        if (state.pulse > 0.55 && !state.drag) {
          if (!bond.warned || frameTime - bond.warned > 620) {
            bond.warned = frameTime;
            playTone("warn", state.muted);
          }
        }

        if (distance < layout.jiva + 14 && !state.grading) {
          missed();
        }
      }

      if (state.mode === "play" && state.endsAt > 0) {
        const wallNow = Date.now();
        if (wallNow >= state.endsAt) {
          finish(true);
        } else if (frameTime - lastUiSyncRef.current > 100) {
          lastUiSyncRef.current = frameTime;
          updateTimerDisplay(state.endsAt - wallNow);
        }
      }

      if (context) {
        context.save();
        renderFrame(
          context,
          window.innerWidth,
          window.innerHeight,
          layout,
          state,
          state.lang,
          starsRef.current,
          particlesRef.current,
          motesRef.current,
          frameTime,
          fontFamilyRef.current,
          deltaSec,
        );
        context.restore();
      }

      frameRef.current = window.requestAnimationFrame(loop);
    };

    frameRef.current = window.requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
      if (spawnTimerRef.current) {
        window.clearTimeout(spawnTimerRef.current);
      }
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (coachTimerRef.current) {
        window.clearTimeout(coachTimerRef.current);
      }
    };
  }, [finish, grade, missed, resize, updateTimerDisplay]);

  const toggleMuted = () => {
    stateRef.current.muted = !stateRef.current.muted;
    syncUi();
    if (!stateRef.current.muted) {
      playTone("tick", false);
    }
  };

  const content = CHAKRA_CONTENT[lang];

  return (
    <div className={`karma-chakra-root ${mode === "play" ? "is-playing" : ""}`}>
      <header className="karma-chakra-top">
        <button type="button" className="karma-chakra-back" onClick={onExit}>
          {GAME_UI.back}
        </button>
        <div className="karma-chakra-title">{GAME_TITLE}</div>
        {mode === "play" ? (
          <>
            <div className="karma-chakra-pill karma-chakra-timer">
              <b ref={timerTextRef}>{formatGameTime(GAME_DURATION_MS)}</b>
            </div>
            <button
              type="button"
              className="karma-chakra-pill"
              onClick={toggleMuted}
              aria-label="Toggle sound"
            >
              {muted ? "✕" : "♪"}
            </button>
          </>
        ) : (
          <button
            type="button"
            className="karma-chakra-pill karma-chakra-mute"
            onClick={toggleMuted}
            aria-label="Toggle sound"
          >
            {muted ? "✕" : "♪"}
          </button>
        )}
      </header>

      {mode === "play" && (
        <>
          <div className="karma-chakra-track" aria-hidden>
            <i ref={timerBarRef} style={{ width: "100%" }} />
          </div>
          <div className="karma-chakra-score-row">
            <span>
              {GAME_UI.scoreLabel} <b>{score}</b>
            </span>
            <span className={streak >= 2 ? "hot" : undefined}>
              {GAME_UI.streakLabel} <b>×{streak}</b>
            </span>
            <span>
              {GAME_UI.correctLabel} <b>{hits}</b>
            </span>
          </div>
        </>
      )}

      <canvas ref={canvasRef} className="karma-chakra-canvas" />

      <div className="karma-chakra-hud">
        <div
          className={`karma-chakra-toast ${toast.visible ? "on" : ""} ${
            toast.bad ? "bad" : ""
          }`}
        >
          {toast.text}
        </div>
        {mode === "play" && (
          <div
            className={`karma-chakra-coach ${coachVisible ? "prominent" : ""}`}
          >
            {CHAKRA_COACH}
          </div>
        )}
      </div>

      <div className={`karma-chakra-screen ${mode === "start" ? "" : "hide"}`}>
        <div className="karma-chakra-screen-glow" aria-hidden />
        {/* Title Group */}
        <div className="text-center mb-6">
          <h1 className="karma-chakra-logotype">{GAME_TITLE}</h1>
          <p className="karma-chakra-sub mt-2 max-w-[280px] mx-auto leading-relaxed">
            {GAME_SUBTITLE}
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
          <button type="button" className="karma-chakra-cta" onClick={startGame}>
            {GAME_UI.begin}
          </button>
        </div>
      </div>

      <div className={`karma-chakra-screen ${mode === "over" ? "" : "hide"}`}>
        <div className="karma-chakra-sub">{result.verdict}</div>
        <h1 className="karma-chakra-logotype karma-chakra-score">{result.score}</h1>
        <div className="karma-chakra-presents">{GAME_UI.totalScore}</div>
        <div className="karma-chakra-stats karma-chakra-stats--over">
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
        <button type="button" className="karma-chakra-cta karma-chakra-cta--ghost" onClick={onExit}>
          {GAME_UI.back}
        </button>
      </div>
    </div>
  );
}
