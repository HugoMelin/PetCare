import { deleteDewormingEntry } from "~~/server/utils/dewormings";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: 'Deworming entry ID is required' };

  const result = await deleteDewormingEntry(id);

  return result;
});