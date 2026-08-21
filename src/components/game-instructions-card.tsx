type GameInstructionsCardProps = {
  howToPlay: string;
  steps: readonly string[];
  timerNote: string;
};

export function GameInstructionsCard({
  howToPlay,
  steps,
  timerNote,
}: GameInstructionsCardProps) {
  return (
    <div className="game-instructions-card">
      <p className="game-instructions-heading">{howToPlay}</p>
      <ol className="game-instructions-list">
        {steps.map((step, index) => (
          <li key={step} className="game-instructions-item">
            <span className="game-instructions-num" aria-hidden>
              {index + 1}
            </span>
            <span className="game-instructions-text">{step}</span>
          </li>
        ))}
      </ol>
      <p className="game-instructions-timer">{timerNote}</p>
    </div>
  );
}
