import { getActualDewormingsByDogId } from "~~/server/utils/dewormings";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: 'Dog ID is required' };

  const dewormings = await getActualDewormingsByDogId(id);

  return dewormings;
});