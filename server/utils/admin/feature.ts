import { prisma } from "~~/server/utils/prisma";
import type { Feature } from "~~/shared/types/feature";

export const createFeature = async (feature: Feature) => {
  return await prisma.feature.create({
    data: {
      key: feature.key,
      name: feature.name,
      description: feature.description || undefined,
      enabledAt: feature.enabledAt || undefined,
      enabled: feature.enabled || false,
    },
  });
};

export type FeatureUpdate = Partial<
  Omit<Feature, "description" | "enabledAt">
> & {
  description?: string | null;
  enabledAt?: Date | null;
};

export const modifyFeature = async (id: number, feature: FeatureUpdate) => {
  return await prisma.feature.update({
    where: { id },
    data: {
      key: feature.key,
      name: feature.name,
      description: feature.description,
      enabledAt: feature.enabledAt,
      enabled: feature.enabled,
    },
  });
};

export const deleteFeature = async (id: number) => {
  return await prisma.feature.delete({
    where: { id },
  });
};
