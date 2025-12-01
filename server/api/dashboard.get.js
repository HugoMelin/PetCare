import { getActualDewormingsByDogId } from "~~/server/utils/dewormings";
import { getWeightsByDogId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  const { dogId } = getQuery(event);

  if (!dogId) return { error: 'Dog ID is required' };

  const dewormings = await getActualDewormingsByDogId(dogId);

  const isDewormingLate = dewormings.nextDoseDate < new Date();

  const weights = await getWeightsByDogId(dogId);


  return {
    dewormings,
    weights,
    isDewormingLate,
  };
});