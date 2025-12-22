import { deleteMedicationEntry } from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: "Deworming entry ID is required" };

  const result = await deleteMedicationEntry(id);

  return result;
});
