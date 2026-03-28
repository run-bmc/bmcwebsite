const AIRTABLE_API_BASE = "https://api.airtable.com/v0";

export const AIRTABLE_TABLES = {
  plants: "Plants",
  sections: "Garden Sections",
} as const;

type AirtableRecord = {
  id: string;
  fields: Record<string, unknown>;
  createdTime: string;
};

type AirtableListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function getAirtableConfig() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    throw new Error(
      "Missing Airtable configuration. Set AIRTABLE_TOKEN and AIRTABLE_BASE_ID.",
    );
  }

  return { token, baseId };
}

async function fetchAirtableTable(tableName: string) {
  const { token, baseId } = getAirtableConfig();
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const params = new URLSearchParams();
    if (offset) {
      params.set("offset", offset);
    }

    const response = await fetch(
      `${AIRTABLE_API_BASE}/${baseId}/${encodeURIComponent(tableName)}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `Airtable request failed for ${tableName}: ${response.status} ${response.statusText}`,
      );
    }

    const data = (await response.json()) as AirtableListResponse;
    records.push(...data.records);
    offset = data.offset;
  } while (offset);

  return records;
}

export async function getPlantsRecords() {
  return fetchAirtableTable(AIRTABLE_TABLES.plants);
}

export async function getSectionsRecords() {
  return fetchAirtableTable(AIRTABLE_TABLES.sections);
}

export type { AirtableRecord };
