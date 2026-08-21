type ChakraMotifProps = {
  className?: string;
  size?: number;
  animate?: boolean;
};

const GHATI = "#ff4da6";
const AGHATI = "#00f0b5";
const CYAN = "#00e5ff";
const VIOLET = "#a855f7";

export function ChakraMotif({
  className = "",
  size = 280,
  animate = true,
}: ChakraMotifProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={`chakra-motif ${animate ? "chakra-motif-spin" : ""} ${className}`}
      aria-hidden
    >
      <circle cx="100" cy="100" r="92" fill="none" stroke={VIOLET} strokeWidth="0.6" opacity="0.22" />
      <circle cx="100" cy="100" r="68" fill="none" stroke={CYAN} strokeWidth="0.5" opacity="0.2" />
      <circle cx="100" cy="100" r="44" fill="none" stroke={AGHATI} strokeWidth="0.5" opacity="0.18" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index * Math.PI) / 4 - Math.PI / 2;
        const x1 = 100 + Math.cos(angle) * 34;
        const y1 = 100 + Math.sin(angle) * 34;
        const x2 = 100 + Math.cos(angle) * 88;
        const y2 = 100 + Math.sin(angle) * 88;
        const isGhati = index < 4;

        return (
          <line
            key={index}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={isGhati ? GHATI : AGHATI}
            strokeWidth="0.9"
            opacity={isGhati ? 0.55 : 0.4}
          />
        );
      })}
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index * Math.PI) / 4 - Math.PI / 2;
        const x = 100 + Math.cos(angle) * 76;
        const y = 100 + Math.sin(angle) * 76;
        const isGhati = index < 4;

        return (
          <circle
            key={`petal-${index}`}
            cx={x}
            cy={y}
            r="5"
            fill={isGhati ? GHATI : AGHATI}
            opacity={0.85}
          />
        );
      })}
      <circle cx="100" cy="100" r="10" fill={CYAN} opacity="0.75" />
    </svg>
  );
}
