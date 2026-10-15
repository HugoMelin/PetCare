export type Feature = {
  key: string;
  name: string;
  description?: string;
  enabledAt?: Date;
  enabled: boolean;
};

/** Fonctionnalité renvoyée par l’API : les dates sont sérialisées en JSON. */
export type FeatureResponse = Omit<Feature, "description" | "enabledAt"> & {
  id: number;
  description: string | null;
  enabledAt: string | null;
  createdAt: string;
  updatedAt: string;
};
