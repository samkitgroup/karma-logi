import type { Lang } from "./types";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!audioContext) {
    const AudioCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtor) {
      return null;
    }
    audioContext = new AudioCtor();
  }

  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  return audioContext;
}

export function playTone(
  kind: "good" | "bad" | "tick" | "warn" | "done",
  muted: boolean,
) {
  if (muted) {
    return;
  }

  try {
    const context = getAudioContext();
    if (!context) {
      return;
    }

    const now = context.currentTime;
    const play = (
      frequency: number,
      duration: number,
      type: OscillatorType,
      volume: number,
      slide?: number,
    ) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      if (slide) {
        oscillator.frequency.exponentialRampToValueAtTime(slide, now + duration * 0.8);
      }
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.02);
    };

    switch (kind) {
      case "good":
        play(523.25, 0.55, "sine", 0.1);
        play(783.99, 0.75, "sine", 0.055);
        play(1046.5, 0.4, "triangle", 0.02);
        break;
      case "bad":
        play(146.83, 0.5, "sine", 0.09, 110);
        break;
      case "tick":
        play(1320, 0.05, "triangle", 0.03);
        break;
      case "warn":
        play(196, 0.18, "sine", 0.05);
        break;
      case "done":
        play(392, 0.9, "sine", 0.09);
        play(587.33, 1.1, "sine", 0.06);
        play(880, 1.3, "sine", 0.035);
        break;
      default: {
        const _exhaustive: never = kind;
        return _exhaustive;
      }
    }
  } catch {
    // Audio is optional.
  }
}

export function haptic(pattern: number | number[], reduced: boolean) {
  if (reduced) {
    return;
  }

  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Haptics are optional.
  }
}

export function resumeAudio() {
  getAudioContext();
}

export type LangOption = Lang;
