"use client";

import { useMemo, useState } from "react";
import { PlantCard } from "@/components/garden/GardenCards";
import type { Plant, Section } from "@/lib/garden/types";

type SearchAndFilterBarProps = {
  plants: Plant[];
  sections: Section[];
};

export function SearchAndFilterBar({ plants, sections }: SearchAndFilterBarProps) {
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("all");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    return Array.from(new Set(plants.flatMap((plant) => plant.tags))).sort((a, b) =>
      a.localeCompare(b),
    );
  }, [plants]);

  const filteredPlants = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return plants.filter((plant) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        plant.name.toLowerCase().includes(normalizedQuery) ||
        plant.notes.toLowerCase().includes(normalizedQuery) ||
        plant.tags.some((item) => item.toLowerCase().includes(normalizedQuery));

      const matchesSection = section === "all" || plant.locationSlug === section;
      const matchesTag = tag === "all" || plant.tags.includes(tag);

      return matchesQuery && matchesSection && matchesTag;
    });
  }, [plants, query, section, tag]);

  return (
    <div className="space-y-6">
      <section className="garden-panel px-5 py-5">
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)]">
          <label className="space-y-2">
            <span className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">
              Search
            </span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by plant name, notes, or tag"
              className="w-full rounded-2xl border border-white/10 bg-[rgba(8,15,12,0.44)] px-4 py-3 text-sm text-[#f0f2ec] outline-none transition placeholder:text-[#bcc5b9] focus:border-white/18 focus:bg-[rgba(8,15,12,0.58)]"
            />
          </label>
          <label className="space-y-2">
            <span className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">
              Section
            </span>
            <select
              value={section}
              onChange={(event) => setSection(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[rgba(8,15,12,0.44)] px-4 py-3 text-sm text-[#f0f2ec] outline-none focus:border-white/18 focus:bg-[rgba(8,15,12,0.58)]"
            >
              <option value="all">All sections</option>
              {sections.map((item) => (
                <option key={item.id} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="garden-eyebrow text-[11px] text-[#dbe4d6] uppercase">
              Tag
            </span>
            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-[rgba(8,15,12,0.44)] px-4 py-3 text-sm text-[#f0f2ec] outline-none focus:border-white/18 focus:bg-[rgba(8,15,12,0.58)]"
            >
              <option value="all">All tags</option>
              {tags.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-[#e0e5dc]">
          Showing {filteredPlants.length} of {plants.length} plants.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredPlants.map((plant) => (
          <PlantCard key={plant.id} plant={plant} compact />
        ))}
      </section>
    </div>
  );
}
