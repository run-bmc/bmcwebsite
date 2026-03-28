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

  return (
    <GardenShell
      eyebrow="Garden Library"
      title="A living index of the understory."
      intro="Fresh data from Airtable, organized around the garden itself: sections first, plants second, with a calm utility layer for searching and export."
    >
      <div className="space-y-8">
        <PlantOfTheDay plants={plants} />

        <section className="grid gap-4 md:grid-cols-2">
          <SummaryCard
            label="Plants"
            value={plants.length}
            detail="The full current library, fetched fresh on every page load."
          />
          <SummaryCard
            label="Sections"
            value={sections.length}
            detail="Spatial groupings that shape the primary browsing experience."
          />
        </section>

        <section className="flex flex-wrap gap-3">
          <Link
            href="/garden/plants"
            className="rounded-full border border-[#d3c4873b] bg-[#d3c48712] px-4 py-2 text-sm text-[#efe3ba] transition hover:bg-[#d3c4871f]"
          >
            Browse all plants
          </Link>
          <Link
            href="/garden/export"
            className="rounded-full border border-[#8ca7892d] bg-[#0b1712] px-4 py-2 text-sm text-[#c4d0bd] transition hover:border-[#a8b89a46]"
          >
            Open export surface
          </Link>
        </section>

        {sections.length > 0 ? (
          <section className="grid gap-5 lg:grid-cols-2">
            {sections.map((section) => (
              <SectionCard key={section.id} section={section} />
            ))}
          </section>
        ) : (
          <GardenDataState
            title="No sections yet"
            message="The garden home is ready, but Airtable didn't return any Garden Sections records."
          />
        )}
      </div>
    </GardenShell>
  );
}
