import { GardenDataState } from "@/components/garden/GardenDataState";
import { GardenShell } from "@/components/garden/GardenShell";
import { ExportPanel } from "@/components/garden/ExportPanel";
import { getGardenLibrary } from "@/lib/garden/normalize";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  let library;

  try {
    library = await getGardenLibrary();
  } catch (error) {
    return (
      <GardenShell eyebrow="Export" title="Export unavailable">
        <GardenDataState
          title="Unable to build export"
          message={error instanceof Error ? error.message : "Unknown Airtable error."}
        />
      </GardenShell>
    );
  }

  const { plants, sections } = library;

  return (
    <GardenShell
      eyebrow="Export"
      title="Plain text, ready for reuse."
      intro="A simple copy surface for bringing the garden into ChatGPT or any other text-first workflow."
    >
      <ExportPanel plants={plants} sections={sections} />
    </GardenShell>
  );
}
