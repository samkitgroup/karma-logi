import { formatGameTime } from "@/lib/game-config";

type GamePlayHudProps = {
  title: string;
  timeLeftMs: number;
  timeProgress: number;
  score: number;
  streak: number;
  correct: number;
  scoreLabel: string;
  streakLabel: string;
  correctLabel: string;
  timeLabel: string;
  backLabel: string;
  muted: boolean;
  onExit: () => void;
  onToggleMute: () => void;
  toast?: {
    visible: boolean;
    text: string;
    good?: boolean;
  };
};

export function GamePlayHud({
  title,
  timeLeftMs,
  timeProgress,
  score,
  streak,
  correct,
  scoreLabel,
  streakLabel,
  correctLabel,
  timeLabel,
  backLabel,
  muted,
  onExit,
  onToggleMute,
  toast,
}: GamePlayHudProps) {
  return (
    <div className="game-play-hud">
      <div className="game-play-bar">
        <button
          type="button"
          className="game-play-back"
          onClick={onExit}
          aria-label={backLabel}
        >
          ←
        </button>

        <div className="game-play-bar-main">
          <h1 className="game-play-title">{title}</h1>
          <div className="game-play-pods" aria-label="Game stats">
            <div className="game-play-pod game-play-pod--score">
              <span className="game-play-pod-label">{scoreLabel}</span>
              <span className="game-play-pod-value">{score}</span>
            </div>
            <div
              className={`game-play-pod game-play-pod--streak ${streak >= 2 ? "is-hot" : ""}`}
            >
              <span className="game-play-pod-label">{streakLabel}</span>
              <span className="game-play-pod-value">×{streak}</span>
            </div>
            <div className="game-play-pod game-play-pod--correct">
              <span className="game-play-pod-label">{correctLabel}</span>
              <span className="game-play-pod-value">{correct}</span>
            </div>
            <div className="game-play-pod game-play-pod--time">
              <span className="game-play-pod-label">{timeLabel}</span>
              <span className="game-play-pod-value">
                {formatGameTime(timeLeftMs)}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="game-play-mute"
          onClick={onToggleMute}
          aria-label={muted ? "Unmute sound" : "Mute sound"}
        >
          {muted ? "✕" : "♪"}
        </button>
      </div>

      <div className="game-play-track" aria-hidden>
        <i style={{ width: `${timeProgress}%` }} />
      </div>

      {toast?.visible && (
        <div
          className={`game-play-toast ${toast.good ? "is-good" : toast.text ? "is-bad" : ""}`}
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {toast.text}
        </div>
      )}
    </div>
  );
}
