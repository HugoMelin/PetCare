import { getAllMedicationsByPetId } from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  if (!id) return { error: "Pet ID is required" };

  const medications = await getAllMedicationsByPetId(id);

  return medications;
});
