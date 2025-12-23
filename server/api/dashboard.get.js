import { getAllMedicationsByPetId } from "~~/server/utils/medications";
import { getWeightsByPetId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { petId } = getQuery(event);

  if (!petId) return { error: "Pet ID is required" };

  const medications = await getAllMedicationsByPetId(petId);

  const isMedicationLate = medications.nextDoseDate < new Date();

  const weights = await getWeightsByPetId(petId);

  return {
    medications,
    weights,
    isMedicationLate,
  };
});
