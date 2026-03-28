import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GardenShell } from "@/components/garden/GardenShell";
import { GardenDataState } from "@/components/garden/GardenDataState";
import { getGardenLibrary } from "@/lib/garden/normalize";

export const dynamic = "force-dynamic";

export default async function PlantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let library;

  try {
    library = await getGardenLibrary();
  } catch (error) {
    return (
      <GardenShell eyebrow="Plant Record" title="Plant unavailable">
        <GardenDataState
          title="Unable to load plant"
          message={error instanceof Error ? error.message : "Unknown Airtable error."}
        />
      </GardenShell>
    );
  }

  const plant = library.plants.find((item) => item.slug === slug);

  if (!plant) {
    notFound();
  }

  return (
    <GardenShell eyebrow="Plant Record" title={plant.name} intro={plant.notes || "A text-forward plant detail page sourced directly from Airtable."}>
      <article className="garden-surface mx-auto max-w-4xl overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
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
                <div className="flex h-full w-full items-center justify-center text-[40px] text-[#f7f4ee]">
                  {plant.icon || "❋"}
                </div>
              )}
            </div>
            <div>
              <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">Plant</p>
              <h2 className="garden-heading mt-3 text-[2.1rem] leading-[1.02] text-[#f7f4ee] sm:text-[2.5rem]">{plant.name}</h2>
              {plant.locationName ? (
                <p className="mt-2 text-[15px] leading-7 text-[#d4decb]">
                  Located in{" "}
                  {plant.locationSlug ? (
                    <Link className="text-[#f3ead7] underline decoration-white/30 underline-offset-4" href={`/garden/sections/${plant.locationSlug}`}>
                      {plant.locationName}
                    </Link>
                  ) : (
                    plant.locationName
                  )}
                </p>
              ) : null}
            </div>
          </div>
          {plant.tags.length > 0 ? (
            <div className="flex max-w-sm flex-wrap gap-2">
              {plant.tags.map((tag) => (
                <span
                  key={tag}
                  className="garden-pill px-2.5 py-1 text-[11px] text-[#f0eee6]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="garden-subpanel px-5 py-5">
            <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">Notes</p>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-[#dfe8d5]">
              {plant.notes || "No notes recorded yet."}
            </p>
          </section>
          <section className="garden-subpanel px-5 py-5">
            <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">Care</p>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-[#dfe8d5]">
              {plant.care || "No care guidance recorded yet."}
            </p>
          </section>
        </div>
      </article>
    </GardenShell>
  );
}
