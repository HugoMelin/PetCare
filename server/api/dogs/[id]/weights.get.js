import { getWeightsByDogId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: 'Dog ID is required' };

  const weights = await getWeightsByDogId(id);

  return weights;
});

