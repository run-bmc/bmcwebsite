import Image from "next/image";
import Link from "next/link";
import type { Plant, Section } from "@/lib/garden/types";

export function SummaryCard({
  label,
  value,
  detail,
  href,
  interactive = false,
}: {
  label: string;
  value: string | number;
  detail: string;
  href?: string;
  interactive?: boolean;
}) {
  const content = (
    <article
      className={`garden-surface relative overflow-hidden px-5 py-5 ${
        interactive
          ? "border-2 border-[#1f5b34] transition duration-300 hover:-translate-y-1 hover:border-[#2a7a45] hover:bg-[rgba(8,15,12,0.68)]"
          : ""
      }`}
    >
      <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">{label}</p>
      <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#f5f2eb] sm:text-[2.15rem]">{value}</p>
      <p className="mt-3 text-sm leading-6 text-[#e0e5dc] sm:text-[15px]">{detail}</p>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

export function SectionCard({
  section,
  examplePlant,
}: {
  section: Section;
  examplePlant?: Plant;
}) {
  return (
    <Link
      href={`/garden/sections/${section.slug}`}
      className="garden-surface group block overflow-hidden px-6 py-5 transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-[rgba(8,15,12,0.68)]"
    >
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <PlantSprite plant={examplePlant} compact />
          <div className="min-w-0">
            <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">
              Garden Section
            </p>
            <h2 className="garden-heading mt-4 text-[1.85rem] leading-[1.02] text-[#f6f4ee]">
              {section.name}
            </h2>
          </div>
        </div>
        <div className="garden-pill px-3 py-1.5 text-[11px] font-medium tracking-[0.08em] text-[#f3eee0]">
          {section.plantCount} plants
        </div>
      </div>
      <p className="mt-4 min-h-16 text-[15px] leading-7 text-[#e0e5dc]">
        {section.description || "A quiet patch of the garden with its own texture, light, and rhythm."}
      </p>
      <div className="mt-5 flex items-center justify-between text-sm text-[#d2dacf]">
        <span>{section.sizeSqFt ? `${section.sizeSqFt} sq ft` : "Size unknown"}</span>
        <span className="font-medium text-[#f1e8d3] transition group-hover:translate-x-1">
          open
        </span>
      </div>
    </Link>
  );
}

export function PlantCard({
  plant,
  compact = false,
}: {
  plant: Plant;
  compact?: boolean;
}) {
  return (
    <Link
      href={`/garden/plants/${plant.slug}`}
      className="garden-surface group flex h-full flex-col overflow-hidden px-5 py-5 transition duration-300 hover:-translate-y-1 hover:border-white/18 hover:bg-[rgba(8,15,12,0.68)]"
    >
      <div className="relative flex items-start gap-4">
        <PlantSprite plant={plant} />
        <div className="min-w-0">
          <h3 className="garden-heading text-[1.45rem] leading-[1.02] text-[#f7f3ec]">{plant.name}</h3>
          {plant.locationName ? (
            <p className="garden-eyebrow mt-2 text-[11px] text-[#d7e0d4] uppercase">
              {plant.locationName}
            </p>
          ) : null}
        </div>
      </div>
      <p
        className={`mt-4 text-[15px] leading-7 text-[#e0e5dc] ${
          compact ? "line-clamp-3" : "line-clamp-4"
        }`}
      >
        {plant.notes || plant.care || "No notes yet in Airtable."}
      </p>
      {plant.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {plant.tags.slice(0, compact ? 2 : 4).map((tag) => (
            <span
              key={tag}
              className="garden-pill px-2.5 py-1 text-[11px] text-[#f0eee6]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}

function PlantSprite({ plant, compact = false }: { plant?: Plant; compact?: boolean }) {
  const frameSize = compact ? "h-14 w-14" : "h-16 w-16";
  const iconSize = compact ? "56px" : "64px";

  if (plant?.iconImageUrl) {
    return (
      <div className={`garden-icon-frame relative shrink-0 overflow-hidden ${frameSize}`}>
        <Image
          src={plant.iconImageUrl}
          alt={plant.name}
          fill
          sizes={iconSize}
          className="object-cover [image-rendering:pixelated]"
        />
      </div>
    );
  }

  return (
    <div
      className={`garden-icon-frame flex shrink-0 items-center justify-center text-[#f7f3ea] ${frameSize} ${
        compact ? "text-[26px]" : "text-[30px]"
      }`}
    >
      {plant?.icon || "✿"}
    </div>
  );
}
