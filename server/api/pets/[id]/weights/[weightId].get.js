import { getWeightsByPetIdAndId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { id, weightId } = event.context.params;

  if (!id) return { error: "Pet ID is required" };
  if (!weightId) return { error: "Weight ID is required" };

  const weight = await getWeightsByPetIdAndId(id, weightId);

  if (!weight) {
    return { error: "Weight entry not found" };
  }

  return weight;
});