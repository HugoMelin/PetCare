import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { getAllMedicationsByPetId } from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const { id } = event.context.params;

  if (!id) return { error: "Pet ID is required" };

  await requirePetOwner(event.context.session.user.id, id);

  const medications = await getAllMedicationsByPetId(id);

  return medications;
});
