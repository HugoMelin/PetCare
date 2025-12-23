import {
  addMedicationEntry,
  updateMedicationEntry,
} from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const body = await readBody(event);
  const {
    medication,
    frequencyDays,
    lastDoseDate = new Date(),
    entryId,
  } = body;

  if (!id) return { error: "Pet ID is required" };
  if (!medication || !frequencyDays) {
    return { error: "Medication and frequencyDays are required" };
  }

  const nextDoseDate = new Date(
    new Date(lastDoseDate).getTime() + frequencyDays * 24 * 60 * 60 * 1000
  );

  let result;
  if (entryId) {
    result = await updateMedicationEntry(
      entryId,
      medication,
      frequencyDays,
      nextDoseDate,
      lastDoseDate
    );
  } else {
    result = await addMedicationEntry(
      id,
      medication,
      frequencyDays,
      nextDoseDate,
      lastDoseDate
    );
  }

  return result;
});
