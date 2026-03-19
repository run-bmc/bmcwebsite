"use client";

import { useEffect, useRef, useState } from "react";
import { Overlay } from "@/components/Overlay";
import { ScoreDisplay } from "@/components/ScoreDisplay";
import { attachKeyboardListeners, consumeStartPress, createInputState } from "@/game/input";
import { stepWorld } from "@/game/loop";
import { renderWorld } from "@/game/render";
import { createWorld, GAME_HEIGHT, GAME_WIDTH, startWorld, type GamePhase } from "@/game/state";

function detectMobilePreview() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
}

export function GameShell() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inputRef = useRef(createInputState());
  const worldRef = useRef(createWorld());
  const frameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const phaseStateRef = useRef<GamePhase>("idle");
  const scoreStateRef = useRef(0);
  const gunLevelStateRef = useRef(0);
  const highScoreRef = useRef(0);

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gunLevel, setGunLevel] = useState(0);

  useEffect(() => {
    let syncFrame = 0;
    const stored = window.localStorage.getItem("space-demo-high-score");
    if (!stored) {
      return undefined;
    }

    const parsed = Number(stored);
    if (!Number.isNaN(parsed)) {
      highScoreRef.current = parsed;
      syncFrame = window.requestAnimationFrame(() => {
        setHighScore(parsed);
      });
    }

    return () => window.cancelAnimationFrame(syncFrame);
  }, []);

  useEffect(() => {
    let syncFrame = 0;

    const syncViewportMode = () => {
      const nextPhase: GamePhase = detectMobilePreview() ? "mobilePreview" : "idle";

      worldRef.current = createWorld(nextPhase);
      phaseStateRef.current = nextPhase;
      scoreStateRef.current = 0;
      gunLevelStateRef.current = 0;
      setPhase(nextPhase);
      setScore(0);
      setGunLevel(0);
    };

    const onResize = () => {
      if (worldRef.current.phase === "playing") {
        return;
      }

      window.cancelAnimationFrame(syncFrame);
      syncFrame = window.requestAnimationFrame(syncViewportMode);
    };

    syncFrame = window.requestAnimationFrame(syncViewportMode);
    window.addEventListener("resize", onResize);

    return () => {
      window.cancelAnimationFrame(syncFrame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => attachKeyboardListeners(inputRef.current), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    context.imageSmoothingEnabled = false;

    const tick = (timestamp: number) => {
      const dt = lastTimeRef.current === 0 ? 0 : (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      const input = inputRef.current;
      const currentWorld = worldRef.current;

      if (
        input.startPressed &&
        (currentWorld.phase === "idle" || currentWorld.phase === "gameOver")
      ) {
        worldRef.current = startWorld(currentWorld);
      }

      consumeStartPress(input);

      stepWorld(worldRef.current, input, dt);
      renderWorld(context, worldRef.current, timestamp);

      if (phaseStateRef.current !== worldRef.current.phase) {
        phaseStateRef.current = worldRef.current.phase;
        setPhase(worldRef.current.phase);
      }

      if (scoreStateRef.current !== worldRef.current.score) {
        scoreStateRef.current = worldRef.current.score;
        setScore(worldRef.current.score);

        if (worldRef.current.score > highScoreRef.current) {
          highScoreRef.current = worldRef.current.score;
          setHighScore(worldRef.current.score);
          window.localStorage.setItem(
            "space-demo-high-score",
            String(worldRef.current.score),
          );
        }
      }

      if (gunLevelStateRef.current !== worldRef.current.gunLevel) {
        gunLevelStateRef.current = worldRef.current.gunLevel;
        setGunLevel(worldRef.current.gunLevel);
      }

      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pb-4 pt-24 sm:px-6 sm:pb-6 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(100,125,220,0.08),transparent_34%),radial-gradient(circle_at_50%_75%,rgba(255,255,255,0.025),transparent_26%)]" />
      <div className="relative flex min-h-[calc(100vh-7rem)] w-full items-center justify-center">
        <div className="relative aspect-[2/3] w-full max-w-[34rem] overflow-hidden bg-[#060816]">
          <ScoreDisplay
            score={score}
            highScore={highScore}
            gunLevel={gunLevel}
            visible={phase === "playing"}
          />
          <Overlay phase={phase} />
          <canvas
            ref={canvasRef}
            aria-label="Top-down space shooter demo"
            className="h-full w-full object-cover [image-rendering:pixelated]"
          />
        </div>
      </div>
    </section>
  );
}
