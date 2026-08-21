import { COLORS, KARMAS } from "./content";
import type {
  GameState,
  Lang,
  Layout,
  Mote,
  Particle,
  Star,
} from "./types";

type GlyphFn = (ctx: CanvasRenderingContext2D) => void;

const GLYPHS: Record<string, GlyphFn> = {
  veil(g) {
    g.beginPath();
    g.moveTo(-1, 0);
    g.quadraticCurveTo(0, -0.8, 1, 0);
    g.quadraticCurveTo(0, 0.8, -1, 0);
    g.stroke();
    g.beginPath();
    g.arc(0, 0, 0.3, 0, 7);
    g.stroke();
    g.beginPath();
    g.moveTo(-1.05, 0.34);
    g.lineTo(1.05, -0.34);
    g.stroke();
  },
  gate(g) {
    g.beginPath();
    g.moveTo(-0.75, 1);
    g.lineTo(-0.75, -0.25);
    g.quadraticCurveTo(0, -1.1, 0.75, -0.25);
    g.lineTo(0.75, 1);
    g.stroke();
    g.beginPath();
    g.moveTo(-1, 0.15);
    g.lineTo(1, 0.15);
    g.stroke();
  },
  cup(g) {
    g.beginPath();
    g.moveTo(-0.7, -0.75);
    g.lineTo(0.7, -0.75);
    g.lineTo(0.28, 0.2);
    g.lineTo(-0.28, 0.2);
    g.closePath();
    g.stroke();
    g.beginPath();
    g.moveTo(0, 0.2);
    g.lineTo(0, 0.75);
    g.moveTo(-0.5, 0.95);
    g.lineTo(0.5, 0.95);
    g.stroke();
  },
  chest(g) {
    g.beginPath();
    g.rect(-0.85, -0.2, 1.7, 1.05);
    g.stroke();
    g.beginPath();
    g.moveTo(-0.85, -0.2);
    g.quadraticCurveTo(0, -1, 0.85, -0.2);
    g.stroke();
    g.beginPath();
    g.arc(0, 0.2, 0.2, 0, 7);
    g.stroke();
  },
  sword(g) {
    g.beginPath();
    g.moveTo(0, -1);
    g.lineTo(0, 0.55);
    g.stroke();
    g.beginPath();
    g.moveTo(-0.55, 0.55);
    g.lineTo(0.55, 0.55);
    g.stroke();
    g.beginPath();
    g.moveTo(0, 0.55);
    g.lineTo(0, 1);
    g.stroke();
  },
  brush(g) {
    g.beginPath();
    g.moveTo(-0.85, -0.9);
    g.lineTo(0.2, 0.15);
    g.stroke();
    g.beginPath();
    g.moveTo(0.1, 0.05);
    g.lineTo(0.62, 0.57);
    g.lineTo(0.35, 0.85);
    g.lineTo(-0.16, 0.33);
    g.closePath();
    g.stroke();
  },
  pots(g) {
    g.beginPath();
    g.moveTo(-0.9, -0.55);
    g.quadraticCurveTo(-0.28, -0.1, -0.5, 0.9);
    g.lineTo(-0.95, 0.9);
    g.quadraticCurveTo(-1.2, -0.1, -0.9, -0.55);
    g.stroke();
    g.beginPath();
    g.moveTo(0.35, 0.05);
    g.quadraticCurveTo(1.05, 0.3, 0.85, 0.9);
    g.lineTo(0.2, 0.9);
    g.quadraticCurveTo(0, 0.3, 0.35, 0.05);
    g.stroke();
  },
  shackle(g) {
    g.beginPath();
    g.arc(-0.42, 0, 0.5, 0, 7);
    g.stroke();
    g.beginPath();
    g.arc(0.42, 0, 0.5, 0, 7);
    g.stroke();
    g.beginPath();
    g.moveTo(-0.42, -0.75);
    g.lineTo(0.42, -0.75);
    g.stroke();
  },
};

export function createStars(count = 70): Star[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    a: Math.random(),
    s: 0.25 + Math.random() * 0.8,
    tw: Math.random() * 6,
  }));
}

export function petalPos(layout: Layout, index: number) {
  const angle = -Math.PI / 2 + index * (Math.PI / 4);
  return {
    x: layout.cx + Math.cos(angle) * layout.r,
    y: layout.cy + Math.sin(angle) * layout.r,
    a: angle,
    i: index,
  };
}

export function nearestPetal(
  layout: Layout,
  x: number,
  y: number,
  max?: number,
): number {
  let bestIndex = -1;
  let bestDistance = Number.POSITIVE_INFINITY;

  for (let i = 0; i < 8; i++) {
    const petal = petalPos(layout, i);
    const distance = Math.hypot(x - petal.x, y - petal.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }

  return bestDistance < (max ?? layout.pw * 1.55) ? bestIndex : -1;
}

export function drawGlyph(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number,
  size: number,
  color: string,
  alpha = 1,
  lineWidth = 1.25,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = lineWidth / size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  (GLYPHS[name] ?? GLYPHS.veil)(ctx);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function petalPath(
  ctx: CanvasRenderingContext2D,
  hw: number,
  out: number,
  into: number,
) {
  ctx.beginPath();
  ctx.moveTo(0, out);
  ctx.bezierCurveTo(hw * 0.95, out * 0.42, hw, -into * 0.42, 0, -into);
  ctx.bezierCurveTo(-hw, -into * 0.42, -hw * 0.95, out * 0.42, 0, out);
  ctx.closePath();
}

function fitFont(
  ctx: CanvasRenderingContext2D,
  lines: string[],
  maxWidth: number,
  fontFamily: string,
) {
  let fontSize = 12;
  for (; fontSize >= 7.5; fontSize -= 0.5) {
    ctx.font = `600 ${fontSize}px ${fontFamily}`;
    if (lines.every((line) => ctx.measureText(line).width <= maxWidth)) {
      break;
    }
  }
  return fontSize;
}

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: Layout,
  state: GameState,
  lang: Lang,
  stars: Star[],
  particles: Particle[],
  motes: Mote[],
  time: number,
  fontFamily: string,
) {
  if (state.shake > 0 && !state.reduced) {
    const shake = state.shake;
    ctx.translate(
      (Math.random() - 0.5) * shake,
      (Math.random() - 0.5) * shake,
    );
    state.shake *= 0.86;
    if (state.shake < 0.3) {
      state.shake = 0;
    }
  }

  drawBackground(ctx, width, height, layout, state, stars, time);
  drawMandala(ctx, layout, state, time, fontFamily);
  drawPetals(ctx, layout, state, lang, fontFamily);
  if (state.bond) {
    drawThread(ctx, layout, state);
  }
  drawJiva(ctx, layout, state, time, fontFamily);
  if (state.bond) {
    drawBondWord(ctx, layout, state);
  }
  drawFx(ctx, particles, motes);
}

function drawBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  layout: Layout,
  state: GameState,
  stars: Star[],
  time: number,
) {
  const gradient = ctx.createRadialGradient(
    layout.cx,
    layout.cy - height * 0.06,
    20,
    layout.cx,
    layout.cy - height * 0.06,
    Math.max(width, height) * 0.8,
  );
  gradient.addColorStop(0, COLORS.inkMid);
  gradient.addColorStop(0.42, COLORS.ink);
  gradient.addColorStop(1, COLORS.inkDeep);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (const star of stars) {
    ctx.globalAlpha =
      0.1 + Math.abs(Math.sin(time / 2400 + star.tw)) * 0.3 * star.a;
    ctx.fillStyle = COLORS.star;
    ctx.beginPath();
    ctx.arc(star.x * width, star.y * height, star.s, 0, 7);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  if (state.pulse > 0) {
    const vignette = ctx.createRadialGradient(
      layout.cx,
      layout.cy,
      layout.r * 0.4,
      layout.cx,
      layout.cy,
      Math.max(width, height) * 0.75,
    );
    vignette.addColorStop(0, "rgba(255, 99, 99, 0)");
    vignette.addColorStop(1, `rgba(255, 77, 166, ${(state.pulse * 0.32).toFixed(3)})`);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);
  }
}

function drawMandala(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  state: GameState,
  time: number,
  fontFamily: string,
) {
  const { cx, cy, r } = layout;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = COLORS.mandala;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  for (const scale of [0.4, 0.7, 1.34]) {
    ctx.beginPath();
    ctx.arc(0, 0, r * scale, 0, 7);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.24;
  ctx.rotate(state.reduced ? 0 : time / 38000);
  for (let i = 0; i < 24; i++) {
    ctx.rotate(Math.PI / 12);
    ctx.beginPath();
    ctx.moveTo(r * 0.44, 0);
    ctx.lineTo(r * 1.33, 0);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.strokeStyle = COLORS.ghati;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.45, Math.PI * 1.06, Math.PI * 1.94);
  ctx.stroke();
  ctx.strokeStyle = COLORS.aghati;
  ctx.beginPath();
  ctx.arc(0, 0, r * 1.45, Math.PI * 0.06, Math.PI * 0.94);
  ctx.stroke();
  ctx.globalAlpha = 0.75;
  ctx.font = `600 8px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillStyle = COLORS.ghati;
  ctx.fillText("GHĀTI", 0, -r * 1.45 - 7);
  ctx.fillStyle = COLORS.aghati;
  ctx.fillText("AGHĀTI", 0, r * 1.45 + 13);
  ctx.restore();
  ctx.globalAlpha = 1;
}

function drawPetals(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  state: GameState,
  lang: Lang,
  fontFamily: string,
) {
  const { pw, out, into } = layout;

  for (let i = 0; i < 8; i++) {
    const petal = petalPos(layout, i);
    const karma = KARMAS[i];
    const isTarget = state.target === i && state.feedbackWrong < 0;
    const isWrong = state.feedbackWrong === i;
    const isCorrect = state.feedbackCorrect === i;
    const accent = karma.g ? COLORS.ghati : COLORS.aghati;

    ctx.save();
    ctx.translate(petal.x, petal.y);
    if (isTarget && !state.reduced) {
      ctx.scale(1.08, 1.08);
    }
    if (isWrong || isCorrect) {
      ctx.scale(1.1, 1.1);
    }
    ctx.rotate(petal.a - Math.PI / 2);
    petalPath(ctx, pw, out, into);

    if (isWrong) {
      ctx.fillStyle = "rgba(255, 99, 99, 0.22)";
      ctx.strokeStyle = COLORS.rust;
      ctx.lineWidth = 2.2;
    } else if (isCorrect) {
      ctx.fillStyle = "rgba(74, 222, 128, 0.22)";
      ctx.strokeStyle = COLORS.correct;
      ctx.lineWidth = 2.2;
    } else {
      ctx.fillStyle = isTarget
        ? COLORS.petalActive
        : karma.g
          ? COLORS.petalGhati
          : COLORS.petalAghati;
      ctx.lineWidth = isTarget ? 1.6 : 1;
      ctx.strokeStyle = isTarget ? COLORS.goldHi : accent;
    }

    ctx.fill();
    ctx.globalAlpha = isWrong || isCorrect || isTarget ? 1 : 0.62;
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    const lines = karma.n[lang];
    const glyphY = petal.y - (lines.length > 1 ? pw * 0.52 : pw * 0.42);
    const glyphColor = isWrong
      ? COLORS.rust
      : isCorrect
        ? COLORS.correct
        : isTarget
          ? COLORS.goldHi
          : accent;
    drawGlyph(
      ctx,
      karma.glyph,
      petal.x,
      glyphY,
      pw * 0.27,
      glyphColor,
      isWrong || isCorrect || isTarget ? 1 : 0.72,
      isWrong || isCorrect ? 1.6 : isTarget ? 1.5 : 1.15,
    );

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = isWrong
      ? COLORS.rust
      : isCorrect
        ? COLORS.correct
        : isTarget
          ? COLORS.goldHi
          : COLORS.parch;
    ctx.globalAlpha = isWrong || isCorrect || isTarget ? 1 : 0.88;
    const fontSize = fitFont(ctx, lines, pw * 1.78, fontFamily);
    const base = petal.y + (lines.length > 1 ? pw * 0.1 : pw * 0.2);
    lines.forEach((line, index) => {
      ctx.font = `600 ${fontSize}px ${fontFamily}`;
      ctx.fillText(line, petal.x, base + index * (fontSize + 2));
    });
    ctx.globalAlpha = 1;
  }
}

function drawJiva(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  state: GameState,
  time: number,
  fontFamily: string,
) {
  const { cx, cy } = layout;
  const radius = layout.jiva;

  if (state.streak > 0) {
    ctx.save();
    ctx.globalAlpha = Math.min(0.5, 0.12 + state.streak * 0.07);
    ctx.strokeStyle = COLORS.gold;
    ctx.lineWidth = 1;
    for (let i = 0; i < Math.min(state.streak, 5); i++) {
      ctx.beginPath();
      ctx.arc(
        cx,
        cy,
        radius + 8 + i * 5 + Math.sin(time / 700 + i) * 1.5,
        0,
        7,
      );
      ctx.stroke();
    }
    ctx.restore();
  }

  if (state.bond && state.mode === "play") {
    const total = state.bond.y0toC;
    const done =
      1 -
      (Math.hypot(state.bond.x - cx, state.bond.y - cy) - radius) / total;
    ctx.save();
    ctx.strokeStyle = done > 0.72 ? COLORS.rust : COLORS.gold;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.arc(
      cx,
      cy,
      radius + 13,
      -Math.PI / 2,
      -Math.PI / 2 + Math.PI * 2 * Math.max(0, Math.min(1, done)),
    );
    ctx.stroke();
    ctx.restore();
  }

  const breathe = state.reduced ? 0 : Math.sin(time / 900) * 1.6;
  const soulGradient = ctx.createRadialGradient(
    cx,
    cy,
    1,
    cx,
    cy,
    radius + breathe,
  );
  soulGradient.addColorStop(0, COLORS.goldHi);
  soulGradient.addColorStop(0.5, COLORS.gold);
  soulGradient.addColorStop(1, COLORS.accentCyan);
  ctx.fillStyle = soulGradient;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.52 + breathe, 0, 7);
  ctx.fill();
  ctx.strokeStyle = COLORS.goldDim;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, 7);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = COLORS.mute;
  ctx.textAlign = "center";
  ctx.font = `600 8px ${fontFamily}`;
  ctx.fillText("JĪVA", cx, cy + radius + 16);
}

function drawThread(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  state: GameState,
) {
  const bond = state.bond;
  if (!bond) {
    return;
  }

  const { cx, cy } = layout;
  const target =
    state.target >= 0 ? petalPos(layout, state.target) : { x: cx, y: cy };
  const danger = state.target < 0;

  ctx.save();
  ctx.setLineDash(danger ? [3, 7] : []);
  ctx.strokeStyle = danger
    ? `rgba(255, 99, 99, ${(0.25 + state.pulse * 0.5).toFixed(2)})`
    : "rgba(0, 229, 255, 0.78)";
  ctx.lineWidth = danger ? 1 : 1.8;
  ctx.beginPath();
  ctx.moveTo(bond.x, bond.y);
  ctx.quadraticCurveTo(
    (bond.x + target.x) / 2 + Math.sin(performance.now() / 600) * 6,
    (bond.y + target.y) / 2,
    target.x,
    target.y,
  );
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawBondWord(
  ctx: CanvasRenderingContext2D,
  layout: Layout,
  state: GameState,
) {
  const bond = state.bond;
  if (!bond) {
    return;
  }

  bond.t += 1 / 60;
  ctx.save();
  ctx.translate(bond.x, bond.y);

  if (bond.fx === "pulse" && !state.reduced) {
    const scale = 1 + Math.sin(bond.t * 7) * 0.045;
    ctx.scale(scale, scale);
  }
  if (bond.fx === "shift" && !state.reduced) {
    ctx.translate(Math.sin(bond.t * 5) * 3, 0);
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const fontSize = Math.min(
    30,
    Math.max(16, ((layout.cx * 2 * 0.62) / Math.max(7, bond.text.length)) * 1.5),
  );
  ctx.font = `${fontSize}px Georgia, serif`;
  const textWidth = ctx.measureText(bond.text).width;
  const pad = 16;
  const halfWidth = textWidth / 2 + pad;
  const halfHeight = fontSize * 0.86;

  ctx.beginPath();
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2, halfHeight);
  } else {
    ctx.rect(-halfWidth, -halfHeight, halfWidth * 2, halfHeight * 2);
  }
  ctx.fillStyle = COLORS.panel;
  ctx.fill();
  ctx.strokeStyle = state.drag ? COLORS.goldHi : COLORS.panelBorder;
  ctx.lineWidth = state.drag ? 1.5 : 1;
  ctx.stroke();

  if (bond.fx === "bars") {
    ctx.save();
    ctx.clip();
    ctx.strokeStyle = COLORS.panelBorder;
    ctx.globalAlpha = 0.55;
    for (let x = -halfWidth; x < halfWidth; x += 13) {
      ctx.beginPath();
      ctx.moveTo(x, -halfHeight);
      ctx.lineTo(x, halfHeight);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.fillStyle = COLORS.parch;
  ctx.fillText(bond.text, 0, 0);
  ctx.restore();
}

function drawFx(
  ctx: CanvasRenderingContext2D,
  particles: Particle[],
  motes: Mote[],
) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.975;
    particle.vy *= 0.975;
    particle.life -= 0.016;
    if (particle.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    ctx.globalAlpha = Math.max(0, particle.life);
    ctx.fillStyle = particle.c;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.s, 0, 7);
    ctx.fill();
  }

  for (let i = motes.length - 1; i >= 0; i--) {
    const mote = motes[i];
    mote.p += 0.016 * mote.sp;
    if (mote.p >= 1) {
      motes.splice(i, 1);
      continue;
    }
    const eased = 1 - (1 - mote.p) ** 3;
    const x = mote.x0 + (mote.x1 - mote.x0) * eased + Math.sin(mote.p * 6 + mote.o) * 10 * (1 - mote.p);
    const y = mote.y0 + (mote.y1 - mote.y0) * eased;
    ctx.globalAlpha = Math.sin(mote.p * Math.PI);
    ctx.fillStyle = COLORS.goldHi;
    ctx.beginPath();
    ctx.arc(x, y, 1.6, 0, 7);
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}

export function burst(
  particles: Particle[],
  x: number,
  y: number,
  color: string,
  count = 26,
) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 7;
    const speed = 0.6 + Math.random() * 3.4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      s: 0.6 + Math.random() * 2,
      life: 1,
      c: color,
    });
  }
}

export function stream(
  motes: Mote[],
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  count = 20,
) {
  for (let i = 0; i < count; i++) {
    motes.push({
      x0,
      y0,
      x1,
      y1,
      p: -i * 0.02,
      sp: 0.9 + Math.random() * 0.7,
      o: Math.random() * 6,
    });
  }
}

export function computeLayout(width: number, height: number): Layout {
  const radius = Math.min(width * 0.355, height * 0.235, 168);
  const petalOut = radius * 0.34;
  const petalIn = radius * 0.3;
  const cy = Math.min(height - (radius + petalOut + 26), height * 0.72);
  const layout: Layout = {
    r: radius,
    cx: width / 2,
    cy,
    pw: radius * 0.335,
    out: petalOut,
    into: petalIn,
    top: 96,
    spawnY: Math.max(120, cy - radius - petalOut - 76),
    jiva: Math.max(22, radius * 0.19),
  };
  layout.spawnY = Math.min(layout.spawnY, cy - radius * 1.1);
  return layout;
}

export function drawMasteryGlyph(
  ctx: CanvasRenderingContext2D,
  glyph: string,
  ghati: boolean,
  met: boolean,
) {
  drawGlyph(
    ctx,
    glyph,
    10,
    10,
    7,
    ghati ? COLORS.ghati : COLORS.aghati,
    met ? 1 : 0.35,
    1.2,
  );
}
