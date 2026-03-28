import { notFound } from "next/navigation";
import { GardenShell } from "@/components/garden/GardenShell";
import { GardenDataState } from "@/components/garden/GardenDataState";
import { PlantCard, SummaryCard } from "@/components/garden/GardenCards";
import { getGardenLibrary } from "@/lib/garden/normalize";

export const dynamic = "force-dynamic";

export default async function SectionDetailPage({
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
      <GardenShell eyebrow="Garden Section" title="Section unavailable">
        <GardenDataState
          title="Unable to load section"
          message={error instanceof Error ? error.message : "Unknown Airtable error."}
        />
      </GardenShell>
    );
  }

  const section = library.sections.find((item) => item.slug === slug);

  if (!section) {
    notFound();
  }

  const sectionPlants = library.plants.filter((plant) => plant.sectionId === section.id);

  return (
    <GardenShell
      eyebrow="Garden Section"
      title={section.name}
      intro={section.description || "A section-level view of the library, meant for browsing plants in place and in relation to each other."}
    >
      <div className="space-y-8">
        <section className="grid gap-4 md:grid-cols-2">
          <SummaryCard
            label="Plants Here"
            value={sectionPlants.length}
            detail="Plants currently associated with this section."
          />
          <SummaryCard
            label="Footprint"
            value={section.sizeSqFt ? `${section.sizeSqFt}` : "n/a"}
            detail={section.sizeSqFt ? "Square feet recorded in Airtable." : "No size recorded in Airtable yet."}
          />
        </section>

        {sectionPlants.length > 0 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sectionPlants.map((plant) => (
              <PlantCard key={plant.id} plant={plant} />
            ))}
          </section>
        ) : (
          <GardenDataState
            title="No plants linked yet"
            message="This section exists, but no plant records were matched to it from the current Airtable data."
          />
        )}
      </div>
    </GardenShell>
  );
}
