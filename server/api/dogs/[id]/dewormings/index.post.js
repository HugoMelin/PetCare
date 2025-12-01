import { addDewormingEntry, updateDewormingEntry } from "~~/server/utils/dewormings";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  const { medication, frequencyDays, lastDoseDate = new Date(), entryId } = body;

  if (!id) return { error: 'Dog ID is required' };
  if (!medication || !frequencyDays) {
    return { error: 'Medication and frequencyDays are required' };
  }

  const nextDoseDate = new Date(new Date(lastDoseDate).getTime() + frequencyDays * 24 * 60 * 60 * 1000);

  let result;
  if (entryId) {
    result = await updateDewormingEntry(entryId, medication, frequencyDays, nextDoseDate);
  } else {
    result = await addDewormingEntry(id, medication, frequencyDays, nextDoseDate, lastDoseDate);
  }

  return result;
});