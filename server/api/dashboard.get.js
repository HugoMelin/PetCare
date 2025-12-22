import { getAllMedicationsByPetId } from "~~/server/utils/medications";
import { getWeightsByPetId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { petId } = getQuery(event);

  if (!petId) return { error: "Pet ID is required" };

  const dewormings = await getAllMedicationsByPetId(petId);

  const isDewormingLate = dewormings.nextDoseDate < new Date();

  const weights = await getWeightsByPetId(petId);

  return {
    dewormings,
    weights,
    isDewormingLate,
  };
});
