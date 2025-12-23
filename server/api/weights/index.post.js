import { addWeightEntry } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  if (!body.petId || !body.weight) return { error: 'petId and weight are required' };

  const newWeightEntry = await addWeightEntry(body);

  return newWeightEntry;
});