"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { haptic, playTone, resumeAudio } from "./audio";
import {
  burst,
  computeLayout,
  createStars,
  drawMasteryGlyph,
  nearestPetal,
  petalPos,
  renderFrame,
  stream,
} from "./canvas-renderer";
import {
  COLORS,
  findPrakritiById,
  GAME_SUBTITLE,
  GAME_TITLE,
  getKarmaDisplayName,
  KARMAS,
  LABELS,
  pickRandomPrakriti,
} from "./content";
import "./karma-chakra.css";
import { GAME_DURATION_MS, formatGameTime } from "@/lib/game-config";
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
  const [timeLeftMs, setTimeLeftMs] = useState(GAME_DURATION_MS);
  const [timeProgress, setTimeProgress] = useState(100);
  const [toast, setToast] = useState({ text: "", bad: false, visible: false });
  const [coachVisible, setCoachVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const [result, setResult] = useState<ResultState>({
    verdict: "JOURNEY COMPLETE",
    score: 0,
    accuracy: "0%",
    bestStreak: 0,
    metCount: "0/8",
    mastery: [],
  });

  const syncUi = useCallback(() => {
    const state = stateRef.current;
    const remaining = Math.max(0, state.endsAt - Date.now());
    setMode(state.mode);
    setLang(state.lang);
    setScore(state.score);
    setStreak(state.streak);
    setTimeLeftMs(remaining);
    setTimeProgress(state.endsAt ? (remaining / GAME_DURATION_MS) * 100 : 100);
    setMuted(state.muted);
  }, []);

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

      const mastery = KARMAS.map((karma, index) => ({
        name: getKarmaDisplayName(index, state.lang),
        met: state.met.has(index),
        glyph: karma.glyph,
        ghati: karma.g === 1,
      }));

      setResult({
        verdict: timeUp ? "TIME'S UP" : "ROUND COMPLETE",
        score: state.score,
        accuracy: `${state.tries ? Math.round((state.hits / state.tries) * 100) : 0}%`,
        bestStreak: state.best,
        metCount: `${state.met.size}/8`,
        mastery,
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
        showToast(`${LABELS[state.lang].released} +${points}`);
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
      showToast(LABELS[state.lang].bound, true);
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
    showToast(LABELS[state.lang].reached, true);
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
  }, [spawn, syncUi]);

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
    const context = canvas.getContext("2d");
    if (context) {
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    layoutRef.current = computeLayout(width, height);
  }, []);

  useEffect(() => {
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
      const { x, y } = event;
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
      const index = nearestPetal(layoutRef.current, event.clientX, event.clientY);
      if (index !== state.target) {
        state.target = index;
        if (index >= 0) {
          haptic(4, state.reduced);
          playTone("tick", state.muted);
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

    const loop = (now: number) => {
      const dt = Math.min((now - lastFrameRef.current) / 16.667, 3);
      lastFrameRef.current = now;
      const state = stateRef.current;
      const layout = layoutRef.current;
      const context = canvas.getContext("2d");

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
          if (!bond.warned || now - bond.warned > 620) {
            bond.warned = now;
            playTone("warn", state.muted);
          }
        }

        if (distance < layout.jiva + 14) {
          missed();
        }
      }

      if (state.mode === "play" && state.endsAt > 0 && now >= state.endsAt) {
        finish(true);
      }

      if (now - lastUiSyncRef.current > 100 && state.mode === "play") {
        lastUiSyncRef.current = now;
        const remaining = Math.max(0, state.endsAt - now);
        setTimeLeftMs(remaining);
        setTimeProgress((remaining / GAME_DURATION_MS) * 100);
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
          now,
          getComputedStyle(document.body).fontFamily,
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
  }, [finish, grade, missed, resize]);

  const toggleMuted = () => {
    stateRef.current.muted = !stateRef.current.muted;
    syncUi();
    if (!stateRef.current.muted) {
      playTone("tick", false);
    }
  };

  const labels = LABELS[lang];

  return (
    <div className={`karma-chakra-root ${mode === "play" ? "is-playing" : ""}`}>
      <button
        type="button"
        className="karma-chakra-pill karma-chakra-back"
        onClick={onExit}
      >
        ← Back
      </button>

      <canvas ref={canvasRef} className="karma-chakra-canvas" />

      <div className="karma-chakra-hud">
        <div className="karma-chakra-bar">
          <div className="karma-chakra-pill">
            <b>{score}</b>
          </div>
          <div className="karma-chakra-spacer" />
          <div className="karma-chakra-pill karma-chakra-timer">
            <b>{formatGameTime(timeLeftMs)}</b>
          </div>
          <button
            type="button"
            className="karma-chakra-pill"
            onClick={toggleMuted}
            aria-label="Toggle sound"
          >
            {muted ? "✕" : "♪"}
          </button>
        </div>

        <div className="karma-chakra-track">
          <i style={{ width: `${timeProgress}%` }} />
        </div>
        <div className="karma-chakra-wordmark">{GAME_TITLE}</div>
        <div className={`karma-chakra-streak ${streak >= 2 ? "on" : ""}`}>
          STREAK ×{streak}
        </div>
        <div
          className={`karma-chakra-toast ${toast.visible ? "on" : ""} ${
            toast.bad ? "bad" : ""
          }`}
        >
          {toast.text}
        </div>
        <div
          className="karma-chakra-coach"
          style={{ opacity: coachVisible && mode === "play" ? 1 : 0.25 }}
        >
          {labels.coach}
        </div>
      </div>

      <div className={`karma-chakra-screen ${mode === "start" ? "" : "hide"}`}>
        <div className="karma-chakra-screen-glow" aria-hidden />
        <h1 className="karma-chakra-logotype">{GAME_TITLE}</h1>
        <div className="karma-chakra-sub">{GAME_SUBTITLE}</div>
        <p className="karma-chakra-pitch">
          60 seconds · match each prakriti to its karma petal.
        </p>
        <button type="button" className="karma-chakra-cta" onClick={startGame}>
          {labels.begin}
        </button>
      </div>

      <div className={`karma-chakra-screen ${mode === "over" ? "" : "hide"}`}>
        <div className="karma-chakra-sub">{result.verdict}</div>
        <h1 className="karma-chakra-logotype" style={{ fontSize: 34, margin: "12px 0 0" }}>
          {result.score}
        </h1>
        <div className="karma-chakra-presents">TOTAL NIRJARĀ</div>
        <div className="karma-chakra-stats">
          <div className="karma-chakra-stat">
            <u>{result.accuracy}</u>
            <s>ACCURACY</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.bestStreak}</u>
            <s>BEST STREAK</s>
          </div>
          <div className="karma-chakra-stat">
            <u>{result.metCount}</u>
            <s>KARMAS MET</s>
          </div>
        </div>
        <div className="karma-chakra-mastery">
          <h3>THE EIGHT KARMAS</h3>
          {result.mastery.map((row) => (
            <div key={row.name} className="karma-chakra-mrow">
              <MasteryIcon glyph={row.glyph} ghati={row.ghati} met={row.met} />
              <span>{row.name}</span>
              <em className={row.met ? "hit" : undefined}>{row.met ? "MET" : "—"}</em>
            </div>
          ))}
        </div>
        <button type="button" className="karma-chakra-cta" onClick={startGame}>
          PLAY AGAIN
        </button>
      </div>
    </div>
  );
}

function MasteryIcon({
  glyph,
  ghati,
  met,
}: {
  glyph: string;
  ghati: boolean;
  met: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.setTransform(2, 0, 0, 2, 0, 0);
    context.clearRect(0, 0, 20, 20);
    drawMasteryGlyph(context, glyph, ghati, met);
  }, [glyph, ghati, met]);

  return <canvas ref={canvasRef} width={40} height={40} aria-hidden />;
}
