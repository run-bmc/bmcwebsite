import { GardenShell } from "@/components/garden/GardenShell";
import { GardenDataState } from "@/components/garden/GardenDataState";
import { SearchAndFilterBar } from "@/components/garden/SearchAndFilterBar";
import { getGardenLibrary } from "@/lib/garden/normalize";

export const dynamic = "force-dynamic";

export default async function PlantsIndexPage() {
  let library;

  try {
    library = await getGardenLibrary();
  } catch (error) {
    return (
      <GardenShell eyebrow="All Plants" title="Plant library unavailable">
        <GardenDataState
          title="Unable to load plants"
          message={error instanceof Error ? error.message : "Unknown Airtable error."}
        />
      </GardenShell>
    );
  }

  const { plants, sections } = library;

  return (
    <GardenShell
      eyebrow="All Plants"
      title="The full library."
      intro="Search by name, scan by section, and narrow by tags."
    >
      {plants.length > 0 ? (
        <SearchAndFilterBar plants={plants} sections={sections} />
      ) : (
        <GardenDataState
          title="No plant records yet"
          message="Airtable didn't return any Plants records for the library."
        />
      )}
    </GardenShell>
  );
}
