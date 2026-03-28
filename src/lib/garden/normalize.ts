import { getPlantsRecords, getSectionsRecords, type AirtableRecord } from "@/lib/garden/airtable";
import { slugify } from "@/lib/garden/slug";
import type { GardenLibrary, Plant, Section } from "@/lib/garden/types";

type SectionLookup = {
  byId: Map<string, Section>;
  byName: Map<string, Section>;
};

function asString(value: unknown) {
  if (typeof value === "string") {
    return value.trim();
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "object" && value !== null && "value" in value) {
    return asString((value as { value?: unknown }).value);
  }

  return "";
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => {
        if (typeof item === "string") {
          return item.split(",").map((part) => part.trim());
        }

        return [];
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  }

  return [];
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}

function firstDefinedField(fields: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (key in fields && fields[key] != null) {
      return fields[key];
    }
  }

  return undefined;
}

function normalizeSection(record: AirtableRecord) {
  // Keep this mapping table-style and explicit so field name tweaks in Airtable
  // are easy to update without touching the UI layer.
  const name =
    asString(firstDefinedField(record.fields, ["Section Name", "Name", "Title"])) ||
    "Untitled Section";
  const description = asString(
    firstDefinedField(record.fields, ["Description", "Notes", "Summary"]),
  );
  const sizeSqFt = asNumber(
    firstDefinedField(record.fields, ["Size (sq ft)", "Size", "Sq Ft"]),
  );
  const plantCount =
    asNumber(firstDefinedField(record.fields, ["Plant Count", "Count"])) ??
    asStringArray(firstDefinedField(record.fields, ["Plants"])).length;

  return {
    id: record.id,
    slug: slugify(name),
    name,
    description,
    sizeSqFt,
    plantCount,
  } satisfies Section;
}

function buildSectionLookup(sections: Section[]): SectionLookup {
  return {
    byId: new Map(sections.map((section) => [section.id, section])),
    byName: new Map(sections.map((section) => [section.name.toLowerCase(), section])),
  };
}

function resolveSection(
  rawLocation: unknown,
  rawSection: unknown,
  sections: SectionLookup,
) {
  const candidates = [
    ...asStringArray(rawSection),
    ...asStringArray(rawLocation),
    asString(rawSection),
    asString(rawLocation),
  ].filter(Boolean);

  for (const candidate of candidates) {
    const byId = sections.byId.get(candidate);
    if (byId) {
      return byId;
    }

    const byName = sections.byName.get(candidate.toLowerCase());
    if (byName) {
      return byName;
    }
  }

  return undefined;
}

function normalizePlant(record: AirtableRecord, sections: SectionLookup) {
  const name =
    asString(firstDefinedField(record.fields, ["Name", "Plant Name", "Title"])) ||
    "Unnamed Plant";
  const notes = asString(firstDefinedField(record.fields, ["Notes", "Description", "Summary"]));
  const care = asString(
    firstDefinedField(record.fields, [
      "Care",
      "Care Recommendations (AI)",
      "Care Notes",
      "Watering",
    ]),
  );
  const iconSource = firstDefinedField(record.fields, ["Icons", "Icon", "Emoji"]);
  const icon = asString(iconSource) || asStringArray(iconSource)[0] || undefined;
  const iconImageUrl =
    Array.isArray(iconSource) &&
    iconSource.length > 0 &&
    typeof iconSource[0] === "object" &&
    iconSource[0] !== null
      ? asString(
          (iconSource[0] as { thumbnails?: { large?: { url?: string } }; url?: string }).thumbnails?.large?.url ||
            (iconSource[0] as { url?: string }).url,
        ) || undefined
      : undefined;
  const tags = asStringArray(firstDefinedField(record.fields, ["Tags", "Tag List"]));
  const linkedSection = resolveSection(
    firstDefinedField(record.fields, ["Location", "Section", "Garden Section"]),
    firstDefinedField(record.fields, ["Section", "Garden Section"]),
    sections,
  );
  const locationName =
    linkedSection?.name ||
    asString(firstDefinedField(record.fields, ["Location", "Section", "Garden Section"])) ||
    undefined;

  return {
    id: record.id,
    slug: slugify(name),
    name,
    notes,
    care,
    locationName,
    locationSlug: linkedSection?.slug,
    tags,
    icon,
    iconImageUrl,
    sectionId: linkedSection?.id,
  } satisfies Plant;
}

export async function getGardenLibrary(): Promise<GardenLibrary> {
  const [sectionRecords, plantRecords] = await Promise.all([
    getSectionsRecords(),
    getPlantsRecords(),
  ]);

  const sections = sectionRecords.map(normalizeSection).sort((a, b) => a.name.localeCompare(b.name));
  const sectionLookup = buildSectionLookup(sections);
  const plants = plantRecords
    .map((record) => normalizePlant(record, sectionLookup))
    .sort((a, b) => a.name.localeCompare(b.name));

  const plantsBySectionId = new Map<string, number>();
  for (const plant of plants) {
    if (plant.sectionId) {
      plantsBySectionId.set(plant.sectionId, (plantsBySectionId.get(plant.sectionId) ?? 0) + 1);
    }
  }

  return {
    plants,
    sections: sections.map((section) => ({
      ...section,
      plantCount: plantsBySectionId.get(section.id) ?? section.plantCount,
    })),
  };
}

export async function getSections() {
  return (await getGardenLibrary()).sections;
}

export async function getPlants() {
  return (await getGardenLibrary()).plants;
}

export async function getSectionBySlug(slug: string) {
  return (await getGardenLibrary()).sections.find((section) => section.slug === slug);
}

export async function getPlantBySlug(slug: string) {
  return (await getGardenLibrary()).plants.find((plant) => plant.slug === slug);
}
