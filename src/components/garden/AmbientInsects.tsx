"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

type Species = "monarch" | "swallowtail" | "bat";

type Insect = {
  id: string;
  species: Species;
  startX: number;
  startY: number;
  pointOneX: number;
  pointOneY: number;
  pointTwoX: number;
  pointTwoY: number;
  pointThreeX: number;
  pointThreeY: number;
  endX: number;
  endY: number;
  duration: number;
  delay: number;
  size: number;
  tiltOne: number;
  tiltTwo: number;
  tiltThree: number;
  tiltFour: number;
  flip: 1 | -1;
  flutterDuration: number;
};

const SPECIES: Species[] = ["monarch", "swallowtail", "bat"];

const ASSET_BY_SPECIES: Record<Species, string> = {
  monarch: "/insects/isolated3/insect-monarch.png",
  swallowtail: "/insects/isolated3/insect-swallowtail.png",
  bat: "/insects/isolated3/insect-bat.png",
};

const ASPECT_BY_SPECIES: Record<Species, number> = {
  monarch: 1481 / 1593,
  swallowtail: 1491 / 1531,
  bat: 1840 / 1838,
};

const NATIVE_FACING: Record<Species, 1 | -1> = {
  monarch: -1,
  swallowtail: 1,
  bat: 1,
};

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function buildInsect(id: string): Insect {
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  const fromLeft = Math.random() > 0.5;
  const movingRight = fromLeft;
  const startX = fromLeft ? randomBetween(-8, 4) : randomBetween(100, 110);
  const endX = fromLeft ? randomBetween(82, 108) : randomBetween(-10, 20);
  const startY = randomBetween(10, 84);
  const travel = endX - startX;
  const flutterRange =
    species === "bat" ? randomBetween(2.5, 5.5) : randomBetween(4.5, 10.5);
  const pointOneX = startX + travel * randomBetween(0.18, 0.26);
  const pointTwoX = startX + travel * randomBetween(0.42, 0.58);
  const pointThreeX = startX + travel * randomBetween(0.7, 0.82);
  const pointOneY = startY + randomBetween(-flutterRange, flutterRange);
  const pointTwoY = startY + randomBetween(-flutterRange * 1.2, flutterRange * 1.2);
  const pointThreeY = startY + randomBetween(-flutterRange, flutterRange);
  const endY = startY + randomBetween(-flutterRange * 0.8, flutterRange * 0.8);
  const flip = movingRight === (NATIVE_FACING[species] === 1) ? 1 : -1;

  return {
    id,
    species,
    startX,
    startY,
    pointOneX,
    pointOneY,
    pointTwoX,
    pointTwoY,
    pointThreeX,
    pointThreeY,
    endX,
    endY,
    duration:
      species === "bat"
        ? randomBetween(20, 28)
        : randomBetween(16, 24),
    delay: randomBetween(-8, 0),
    size:
      species === "bat"
        ? randomBetween(30, 38)
        : randomBetween(26, 34),
    tiltOne: randomBetween(-8, 8),
    tiltTwo: randomBetween(-12, 12),
    tiltThree: randomBetween(-10, 10),
    tiltFour: randomBetween(-7, 7),
    flip,
    flutterDuration:
      species === "bat"
        ? randomBetween(0.55, 0.85)
        : randomBetween(0.7, 1.2),
  };
}

export function AmbientInsects() {
  const [insects, setInsects] = useState<Insect[]>([]);

  const initialInsects = useMemo(() => {
    return Array.from({ length: 3 }, (_, index) => buildInsect(`initial-${index}`));
  }, []);

  useEffect(() => {
    setInsects(initialInsects);
  }, [initialInsects]);

  return (
    <div className="garden-insects pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {insects.map((insect) => (
        <div
          key={insect.id}
          className={`garden-insect garden-insect--${insect.species}`}
          onAnimationIteration={() => {
            setInsects((current) =>
              current.map((item) =>
                item.id === insect.id ? buildInsect(`refresh-${Date.now()}-${item.id}`) : item,
              ),
            );
          }}
          style={
            {
              width: `${insect.size}px`,
              aspectRatio: `${ASPECT_BY_SPECIES[insect.species]}`,
              "--garden-start-x": `${insect.startX}vw`,
              "--garden-start-y": `${insect.startY}vh`,
              "--garden-point-one-x": `${insect.pointOneX}vw`,
              "--garden-point-one-y": `${insect.pointOneY}vh`,
              "--garden-point-two-x": `${insect.pointTwoX}vw`,
              "--garden-point-two-y": `${insect.pointTwoY}vh`,
              "--garden-point-three-x": `${insect.pointThreeX}vw`,
              "--garden-point-three-y": `${insect.pointThreeY}vh`,
              "--garden-end-x": `${insect.endX}vw`,
              "--garden-end-y": `${insect.endY}vh`,
              "--garden-duration": `${insect.duration}s`,
              "--garden-delay": `${insect.delay}s`,
              "--garden-tilt-one": `${insect.tiltOne}deg`,
              "--garden-tilt-two": `${insect.tiltTwo}deg`,
              "--garden-tilt-three": `${insect.tiltThree}deg`,
              "--garden-tilt-four": `${insect.tiltFour}deg`,
              "--garden-flip": `${insect.flip}`,
              "--garden-flutter-duration": `${insect.flutterDuration}s`,
            } as CSSProperties
          }
        >
          <span className="garden-insect-trail" />
          <Image
            className="garden-insect-image"
            src={ASSET_BY_SPECIES[insect.species]}
            alt=""
            fill
            sizes={`${Math.ceil(insect.size)}px`}
            draggable={false}
          />
        </div>
      ))}
    </div>
  );
}
