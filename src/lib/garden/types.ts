export type Section = {
  id: string;
  slug: string;
  name: string;
  description: string;
  sizeSqFt?: number;
  plantCount: number;
};

export type Plant = {
  id: string;
  slug: string;
  name: string;
  notes: string;
  care: string;
  locationName?: string;
  locationSlug?: string;
  tags: string[];
  icon?: string;
  iconImageUrl?: string;
  sectionId?: string;
};

export type GardenLibrary = {
  plants: Plant[];
  sections: Section[];
};
