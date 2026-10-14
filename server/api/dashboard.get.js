import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { getAllMedicationsByPetId } from "~~/server/utils/medications";
import { getWeightsByPetId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const { petId } = getQuery(event);

  if (!petId) return { error: "Pet ID is required" };

  await requirePetOwner(event.context.session.user.id, petId);

  const medications = await getAllMedicationsByPetId(petId);

  const isMedicationLate = medications.nextDoseDate < new Date();

  const weights = await getWeightsByPetId(petId);

  return {
    medications,
    weights,
    isMedicationLate,
  };
});
