import { updateWeightEntry } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: "Weight entry ID is required" };

  const body = await readBody(event);

  const { weight = null, date = null, comment = null } = body;

  const result = await updateWeightEntry(id, weight, comment, date);

  return result;
});
