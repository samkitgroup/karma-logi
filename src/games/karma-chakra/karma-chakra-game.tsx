"use client";

import Link from "next/link";
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
  formatKarmaName,
  GAME_SUBTITLE,
  GAME_TITLE,
  KARMAS,
  LABELS,
  WORDS,
} from "./content";
import "./karma-chakra.css";
import type {
  GameMode,
  GameState,
  Lang,
  LearnState,
  Mote,
  Particle,
  ResultState,
  Star,
} from "./types";

function createInitialState(reduced: boolean): GameState {
  return {
    mode: "start",
    lang: "en",
    round: 0,
    total: 16,
    score: 0,
    streak: 0,
    best: 0,
    lives: 3,
    hits: 0,
    tries: 0,
    met: new Set<number>(),
    deck: [],
    bond: null,
    drag: false,
    target: -1,
    muted: false,
    shake: 0,
    pulse: 0,
    reduced,
  };
}

export function KarmaChakraGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(
    createInitialState(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  );
  const layoutRef = useRef(computeLayout(390, 844));
  const starsRef = useRef<Star[]>(createStars());
  const particlesRef = useRef<Particle[]>([]);
  const motesRef = useRef<Mote[]>([]);
  const learnTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);
  const coachTimerRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef(0);

  const [mode, setMode] = useState<GameMode>("start");
  const [lang, setLang] = useState<Lang>("en");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState({ text: "", bad: false, visible: false });
  const [coachVisible, setCoachVisible] = useState(true);
  const [muted, setMuted] = useState(false);
  const [learn, setLearn] = useState<LearnState>({
    open: false,
    tag: "",
    tagClass: "g",
    name: "",
    native: "",
    simile: "",
    fn: "",
    nextLabel: "NEXT",
    timerProgress: 1,
  });
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
    setMode(state.mode);
    setLang(state.lang);
    setScore(state.score);
    setLives(state.lives);
    setStreak(state.streak);
    setProgress((state.round / state.total) * 100);
    setMuted(state.muted);
  }, []);

  const showToast = useCallback((text: string, bad = false) => {
    setToast({ text, bad, visible: true });
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }));
    }, 900);
  }, []);

  const buildDeck = useCallback(() => {
    const deck: number[] = [];
    for (let i = 0; i < 8; i++) {
      deck.push(i, i);
    }
    for (let i = deck.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    for (let i = 1; i < deck.length; i++) {
      if (deck[i] === deck[i - 1] && i + 1 < deck.length) {
        [deck[i], deck[i + 1]] = [deck[i + 1], deck[i]];
      }
    }
    stateRef.current.deck = deck;
  }, []);

  const finish = useCallback(
    (dead = false) => {
      const state = stateRef.current;
      state.mode = "over";
      state.bond = null;
      syncUi();

      const mastery = KARMAS.map((karma, index) => ({
        name: formatKarmaName(karma.n.en),
        met: state.met.has(index),
        glyph: karma.glyph,
        ghati: karma.g === 1,
      }));

      setResult({
        verdict: dead ? "THE JĪVA IS OVERLOADED" : "JOURNEY COMPLETE",
        score: state.score,
        accuracy: `${state.tries ? Math.round((state.hits / state.tries) * 100) : 0}%`,
        bestStreak: state.best,
        metCount: `${state.met.size}/8`,
        mastery,
      });

      playTone("done", state.muted);
      haptic([12, 60, 12, 60, 20], state.reduced);
    },
    [syncUi],
  );

  const spawn = useCallback(() => {
    const state = stateRef.current;
    const layout = layoutRef.current;

    if (state.round >= state.total) {
      finish();
      return;
    }

    const karmaIndex = state.deck[state.round];
    const pool = WORDS.filter((word) => word[1] === karmaIndex);
    const word = pool[(Math.random() * pool.length) | 0];
    const speed = 42 + state.round * 3.4;

    state.bond = {
      text: word[0],
      k: karmaIndex,
      fx: word[2],
      x: layout.cx,
      y: layout.spawnY,
      t: 0,
      speed,
      y0toC: Math.max(
        60,
        Math.hypot(layout.cx - layout.cx, layout.spawnY - layout.cy) - layout.jiva,
      ),
    };
    state.target = -1;
    state.pulse = 0;
    syncUi();
  }, [finish, syncUi]);

  const closeLearn = useCallback(() => {
    if (learnTimerRef.current) {
      window.clearTimeout(learnTimerRef.current);
    }

    setLearn((current) => ({ ...current, open: false }));
    const state = stateRef.current;
    state.round += 1;
    state.mode = "play";
    syncUi();
    window.setTimeout(spawn, 260);
  }, [spawn, syncUi]);

  const openLearn = useCallback(
    (index: number) => {
      const state = stateRef.current;
      const karma = KARMAS[index];
      const labels = LABELS[state.lang];

      setLearn({
        open: true,
        tag: karma.g ? labels.ghati : labels.aghati,
        tagClass: karma.g ? "g" : "a",
        name: formatKarmaName(karma.n.en),
        native: `${karma.n.hi.join("")}  ·  ${karma.n.gu.join("")}`,
        simile: `“${karma.s[state.lang]}”`,
        fn: karma.f[state.lang],
        nextLabel: labels.next,
        timerProgress: 1,
      });

      state.mode = "learn";
      syncUi();

      window.requestAnimationFrame(() => {
        setLearn((current) => ({ ...current, timerProgress: 0 }));
      });

      if (learnTimerRef.current) {
        window.clearTimeout(learnTimerRef.current);
      }
      learnTimerRef.current = window.setTimeout(closeLearn, 3500);
    },
    [closeLearn, syncUi],
  );

  const grade = useCallback(
    (index: number) => {
      const state = stateRef.current;
      const bond = state.bond;
      if (!bond || state.mode !== "play") {
        return;
      }

      const layout = layoutRef.current;
      const ok = index === bond.k;
      const petal = petalPos(layout, bond.k);
      state.tries += 1;

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
      } else {
        state.streak = 0;
        burst(particlesRef.current, bond.x, bond.y, COLORS.rust, 16);
        state.shake = 6;
        showToast(LABELS[state.lang].bound, true);
        playTone("bad", state.muted);
        haptic(90, state.reduced);
      }

      state.met.add(bond.k);
      state.bond = null;
      state.target = -1;
      state.drag = false;
      state.pulse = 0;
      syncUi();
      window.setTimeout(() => openLearn(bond.k), 420);
    },
    [openLearn, showToast, syncUi],
  );

  const missed = useCallback(() => {
    const state = stateRef.current;
    const bond = state.bond;
    if (!bond) {
      return;
    }

    const layout = layoutRef.current;
    state.streak = 0;
    state.lives -= 1;
    state.tries += 1;
    burst(particlesRef.current, layout.cx, layout.cy, COLORS.rust, 34);
    state.shake = 9;
    showToast(LABELS[state.lang].reached, true);
    playTone("bad", state.muted);
    haptic([30, 60, 30], state.reduced);
    state.met.add(bond.k);
    state.bond = null;
    state.target = -1;
    state.pulse = 0;
    syncUi();

    if (state.lives <= 0) {
      window.setTimeout(() => finish(true), 700);
      return;
    }

    window.setTimeout(() => openLearn(bond.k), 420);
  }, [finish, openLearn, showToast, syncUi]);

  const startGame = useCallback(() => {
    resumeAudio();
    const state = stateRef.current;
    state.mode = "play";
    state.round = 0;
    state.score = 0;
    state.streak = 0;
    state.best = 0;
    state.lives = 3;
    state.hits = 0;
    state.tries = 0;
    state.met = new Set();
    buildDeck();
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
  }, [buildDeck, spawn, syncUi]);

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
      if (state.mode !== "play" || !state.bond) {
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
      if (!state.drag || !state.bond) {
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

      if (state.mode === "play" && state.bond) {
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
      if (learnTimerRef.current) {
        window.clearTimeout(learnTimerRef.current);
      }
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      if (coachTimerRef.current) {
        window.clearTimeout(coachTimerRef.current);
      }
    };
  }, [grade, missed, resize]);

  const setLanguage = (nextLang: Lang) => {
    stateRef.current.lang = nextLang;
    syncUi();
  };

  const toggleMuted = () => {
    stateRef.current.muted = !stateRef.current.muted;
    syncUi();
    if (!stateRef.current.muted) {
      playTone("tick", false);
    }
  };

  const labels = LABELS[lang];

  return (
    <div className="karma-chakra-root">
      <Link href="/games" className="karma-chakra-pill karma-chakra-back">
        ← Games
      </Link>

      <canvas ref={canvasRef} className="karma-chakra-canvas" />

      <div className="karma-chakra-hud">
        <div className="karma-chakra-bar">
          <div className="karma-chakra-pill">
            <b>{score}</b>
          </div>
          <div className="karma-chakra-spacer" />
          <div className="karma-chakra-pill karma-chakra-dots">
            {[0, 1, 2].map((index) => (
              <i key={index} className={index >= lives ? "off" : undefined} />
            ))}
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
          <i style={{ width: `${progress}%` }} />
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

      <div
        className={`karma-chakra-sheet ${learn.open ? "up" : ""}`}
        onClick={closeLearn}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            closeLearn();
          }
        }}
        role="dialog"
        aria-modal="true"
        tabIndex={0}
      >
        <span className={`karma-chakra-tag ${learn.tagClass}`}>{learn.tag}</span>
        <h2>{learn.name}</h2>
        <div className="karma-chakra-native">{learn.native}</div>
        <div
          className="karma-chakra-simile"
          style={{
            borderLeftColor: learn.tagClass === "g" ? COLORS.ghati : COLORS.aghati,
          }}
        >
          {learn.simile}
        </div>
        <div className="karma-chakra-fn">{learn.fn}</div>
        <div className="karma-chakra-sheet-foot">
          <div className="karma-chakra-timerbar">
            <i
              style={{
                transform: `scaleX(${learn.timerProgress})`,
                transition: learn.open ? "transform 3.4s linear" : "none",
              }}
            />
          </div>
          <button
            type="button"
            className="karma-chakra-next"
            onClick={(event) => {
              event.stopPropagation();
              closeLearn();
            }}
          >
            {learn.nextLabel}
          </button>
        </div>
      </div>

      <div className={`karma-chakra-screen ${mode === "start" ? "" : "hide"}`}>
        <h1 className="karma-chakra-logotype">{GAME_TITLE}</h1>
        <div className="karma-chakra-sub">{GAME_SUBTITLE}</div>
        <p className="karma-chakra-pitch">
          Eight karmas bind the soul. Catch each bond as it falls — and release
          it before it reaches the jīva.
        </p>
        <div className="karma-chakra-langrow">
          {(["en", "hi", "gu"] as Lang[]).map((option) => (
            <button
              key={option}
              type="button"
              className={lang === option ? "on" : ""}
              onClick={() => setLanguage(option)}
            >
              {option === "en" ? "English" : option === "hi" ? "हिंदी" : "ગુજરાતી"}
            </button>
          ))}
        </div>
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
