type ScoreDisplayProps = {
  score: number;
  highScore: number;
  gunLevel: number;
  visible: boolean;
};

const GUN_LABELS = [
  "Single",
  "Double",
  "Triple",
  "Spray III",
  "Spray V",
];

export function ScoreDisplay({
  score,
  highScore,
  gunLevel,
  visible,
}: ScoreDisplayProps) {
  return (
    <div
      className={`pointer-events-none absolute left-4 top-4 rounded-full border border-white/10 bg-black/45 px-3 py-2 font-mono text-[11px] tracking-[0.24em] text-stone-200 uppercase backdrop-blur-sm transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      Score {score} • High {highScore} • {GUN_LABELS[gunLevel]}
    </div>
  );
}
