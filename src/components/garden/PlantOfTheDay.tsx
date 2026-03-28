import Image from "next/image";
import Link from "next/link";
import type { Plant } from "@/lib/garden/types";

function getDayIndex(total: number) {
  const now = new Date();
  const utcDate = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayNumber = Math.floor(utcDate / 86_400_000);
  return dayNumber % total;
}

export function PlantOfTheDay({ plants }: { plants: Plant[] }) {
  if (plants.length === 0) {
    return null;
  }

  const plant = plants[getDayIndex(plants.length)];

  return (
    <Link
      href={`/garden/plants/${plant.slug}`}
      className="garden-surface group relative block overflow-hidden px-6 py-6 transition duration-300 hover:border-white/18 hover:bg-[rgba(8,15,12,0.68)]"
    >
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">
            Plant of the Day
          </p>
          <div className="mt-4 flex items-center gap-4">
            <div className="garden-icon-frame relative h-20 w-20 overflow-hidden">
              {plant.iconImageUrl ? (
                <Image
                  src={plant.iconImageUrl}
                  alt={plant.name}
                  fill
                  sizes="80px"
                  className="object-cover [image-rendering:pixelated]"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[42px] text-[#f7f3ec]">
                  {plant.icon || "✿"}
                </div>
              )}
            </div>
            <div>
              <h2 className="garden-heading text-[2rem] leading-[1.02] text-[#f7f4ee] sm:text-[2.25rem]">
                {plant.name}
              </h2>
              {plant.locationName ? (
                <p className="mt-2 text-sm tracking-[0.08em] text-[#dbe2d7] uppercase">
                  {plant.locationName}
                </p>
              ) : null}
            </div>
          </div>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-[#e0e5dc]">
            {(plant.notes || plant.care || "A quiet resident of the garden library.").slice(0, 180)}
          </p>
        </div>
        <div className="garden-pill px-4 py-2 text-[11px] font-medium tracking-[0.08em] text-[#f3eee0] transition group-hover:-translate-y-px">
          Open plant record
        </div>
      </div>
    </Link>
  );
}
