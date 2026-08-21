"use client";

import { useState } from "react";

import { registerPlayer } from "@/lib/player-api";
import type { PlayerScoreMap, PlayerSession } from "@/lib/player-types";

type PlayerRegisterProps = {
  onRegistered: (player: PlayerSession, scores: PlayerScoreMap) => void;
};

export function PlayerRegister({ onRegistered }: PlayerRegisterProps) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await registerPlayer({ name, mobile });
      onRegistered(result.player, result.scores);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cosmic-vignette relative flex min-h-[100dvh] items-center justify-center overflow-x-hidden cosmic-bg px-4 py-10">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 sm:p-8">
        <h1 className="text-center text-2xl font-semibold text-gold-gradient">
          Join Karma Logi
        </h1>
        <p className="mt-3 text-center text-sm leading-relaxed text-text-muted">
          Enter your name and mobile to play. Each game can be played once per
          mobile number. Your total score appears on the scorecard.
        </p>

        <form className="mt-8 space-y-4" onSubmit={submit}>
          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dim">
              Name
            </span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-foreground outline-none transition focus:border-gold/40"
              placeholder="Your name"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-dim">
              Mobile
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={mobile}
              onChange={(event) => setMobile(event.target.value)}
              autoComplete="tel"
              required
              minLength={10}
              maxLength={15}
              className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base text-foreground outline-none transition focus:border-gold/40"
              placeholder="10-digit mobile"
            />
          </label>

          {error ? (
            <p className="rounded-xl border border-rust/30 bg-rust/10 px-4 py-3 text-sm text-rust">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="touch-target w-full rounded-full border border-gold/40 bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-gold-bright shadow-[0_0_28px_rgba(0,229,255,0.25)] transition active:scale-[0.98] disabled:opacity-60"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
