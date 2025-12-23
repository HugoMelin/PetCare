import { getWeightsByPetId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: 'Pet ID is required' };

  const weights = await getWeightsByPetId(id);

  return weights;
});

