import type { GamePhase } from "@/game/state";

type OverlayProps = {
  phase: GamePhase;
};

export function Overlay({ phase }: OverlayProps) {
  if (phase === "playing") {
    return null;
  }

  const content =
    phase === "gameOver"
      ? {
          title: "Game over",
          lines: ["Press space to restart"],
        }
      : phase === "mobilePreview"
        ? {
            title: "Desktop demo",
            lines: ["Best experienced on desktop", "Or use the links above"],
          }
        : {
            title: "Press space to start",
            lines: [
              "\u2190 \u2192 to move",
              "Space to shoot",
              "Catch pills to upgrade",
              "Or use the links above",
            ],
          };

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="rounded-2xl border border-white/10 bg-black/45 px-6 py-5 text-center backdrop-blur-sm">
        <p className="text-sm font-medium tracking-[0.22em] text-stone-100 uppercase">
          {content.title}
        </p>
        <div className="mt-3 space-y-1 font-mono text-[11px] tracking-[0.18em] text-stone-400 uppercase">
          {content.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
