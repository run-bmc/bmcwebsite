import Link from "next/link";
import { GardenDataState } from "@/components/garden/GardenDataState";
import { GardenShell } from "@/components/garden/GardenShell";
import { PlantOfTheDay } from "@/components/garden/PlantOfTheDay";
import { SectionCard, SummaryCard } from "@/components/garden/GardenCards";
import { getGardenLibrary } from "@/lib/garden/normalize";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Garden Library",
  description: "A quiet, section-first library for Blake McDowall's garden.",
};

export default async function GardenHomePage() {
  let library;

  try {
    library = await getGardenLibrary();
  } catch (error) {
    return (
      <GardenShell
        eyebrow="Garden Library"
        title="Garden data is not connected yet."
        intro="The interface is in place, but the Airtable connection needs environment configuration before records can load."
      >
        <GardenDataState
          title="Airtable configuration needed"
          message={error instanceof Error ? error.message : "Unknown Airtable error."}
        />
      </GardenShell>
    );
  }

  const { plants, sections } = library;
  const usedPlantIds = new Set<string>();
  const examplePlantBySectionId = new Map(
    sections.map((section) => {
      const sectionPlants = plants.filter((plant) => plant.sectionId === section.id);
      const preferred =
        sectionPlants.find((plant) => plant.iconImageUrl && !usedPlantIds.has(plant.id)) ??
        sectionPlants.find((plant) => plant.icon && !usedPlantIds.has(plant.id)) ??
        sectionPlants.find((plant) => !usedPlantIds.has(plant.id)) ??
        sectionPlants[0];

      if (preferred) {
        usedPlantIds.add(preferred.id);
      }

      return [section.id, preferred] as const;
    }),
  );

  return (
    <GardenShell
      eyebrow="Garden Library"
      title="The Gardens at 400 Florence"
      intro="An interactive map of my garden, where you can explore each section and see my selection of plants."
    >
      <div className="space-y-8">
        <PlantOfTheDay plants={plants} />

        <section className="grid gap-4 md:grid-cols-2">
          <SummaryCard
            label="Plants"
            value={plants.length}
            detail="The full current library, fetched fresh on every page load."
            href="/garden/plants"
            interactive
          />
          <SummaryCard
            label="Sections"
            value={sections.length}
            detail="Spatial groupings that shape the primary browsing experience."
          />
        </section>

        {sections.length > 0 ? (
          <section className="grid gap-5 lg:grid-cols-2">
            {sections.map((section) => (
              <SectionCard
                key={section.id}
                section={section}
                examplePlant={examplePlantBySectionId.get(section.id)}
              />
            ))}
          </section>
        ) : (
          <GardenDataState
            title="No sections yet"
            message="The garden home is ready, but Airtable didn't return any Garden Sections records."
          />
        )}

        <section className="flex justify-start pt-2">
          <Link
            href="/garden/export"
            className="rounded-full border border-[#8ca78933] bg-[rgba(8,15,12,0.52)] px-4 py-2 text-sm text-[#d6dfcf] transition hover:-translate-y-0.5 hover:border-white/18"
          >
            Open export
          </Link>
        </section>
      </div>
    </GardenShell>
  );
}
