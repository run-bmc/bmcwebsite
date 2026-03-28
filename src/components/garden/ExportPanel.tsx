"use client";

import { useMemo, useState } from "react";
import type { Plant, Section } from "@/lib/garden/types";

type ExportMode = "section" | "flat";

function lineForPlant(plant: Plant) {
  const summary = plant.notes || plant.care || "No notes yet.";
  return `${plant.name}${plant.locationName ? ` — ${plant.locationName}` : ""} — ${summary}`;
}

function buildSectionExport(sections: Section[], plants: Plant[]) {
  const grouped = sections
    .map((section) => {
      const sectionPlants = plants.filter((plant) => plant.sectionId === section.id);
      if (sectionPlants.length === 0) {
        return "";
      }

      return [
        section.name,
        ...sectionPlants.map((plant) => `- ${plant.name}: ${plant.notes || plant.care || "No notes yet."}`),
      ].join("\n");
    })
    .filter(Boolean);

  const unassigned = plants.filter((plant) => !plant.sectionId);
  if (unassigned.length > 0) {
    grouped.push(
      ["Unassigned", ...unassigned.map((plant) => `- ${plant.name}: ${plant.notes || plant.care || "No notes yet."}`)].join(
        "\n",
      ),
    );
  }

  return grouped.join("\n\n");
}

function buildFlatExport(plants: Plant[]) {
  return plants.map((plant) => `- ${lineForPlant(plant)}`).join("\n");
}

export function ExportPanel({
  sections,
  plants,
}: {
  sections: Section[];
  plants: Plant[];
}) {
  const [mode, setMode] = useState<ExportMode>("section");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    return mode === "section" ? buildSectionExport(sections, plants) : buildFlatExport(plants);
  }, [mode, plants, sections]);

  async function handleCopy() {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className="garden-surface px-5 py-5">
        <p className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">Export Mode</p>
        <div className="mt-4 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => setMode("section")}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              mode === "section"
                ? "border-white/18 bg-[rgba(10,18,14,0.68)] text-[#f7f4ee]"
                : "border-white/10 bg-[rgba(8,15,12,0.44)] text-[#d7ded3]"
            }`}
          >
            Grouped by section
          </button>
          <button
            type="button"
            onClick={() => setMode("flat")}
            className={`rounded-2xl border px-4 py-3 text-left text-sm transition ${
              mode === "flat"
                ? "border-white/18 bg-[rgba(10,18,14,0.68)] text-[#f7f4ee]"
                : "border-white/10 bg-[rgba(8,15,12,0.44)] text-[#d7ded3]"
            }`}
          >
            Flat alphabetical list
          </button>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="mt-6 w-full rounded-full border border-white/12 bg-[rgba(8,15,12,0.52)] px-4 py-3 text-sm font-medium text-[#f2ede3] transition hover:-translate-y-px hover:border-white/18"
        >
          {copied ? "Copied" : "Copy to clipboard"}
        </button>
      </div>

      <div className="garden-surface px-5 py-5">
        <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap text-sm leading-7 text-[#e0e8d6]">
          {output || "No plants available to export yet."}
        </pre>
      </div>
    </section>
  );
}
