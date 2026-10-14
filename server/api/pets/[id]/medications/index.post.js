import { prisma } from "~~/server/utils/prisma";
import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import {
  addMedicationEntry,
  updateMedicationEntry,
} from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const { id } = event.context.params;
  const body = await readBody(event);
  const {
    medication,
    frequencyDays,
    lastDoseDate = new Date(),
    entryId,
  } = body;

  if (!id) return { error: "Pet ID is required" };

  await requirePetOwner(event.context.session.user.id, id);
  if (!medication || !frequencyDays) {
    return { error: "Medication and frequencyDays are required" };
  }

  const nextDoseDate = new Date(
    new Date(lastDoseDate).getTime() + frequencyDays * 24 * 60 * 60 * 1000,
  );

  let result;
  if (entryId) {
    const entry = await prisma.medication.findFirst({
      where: { id: parseInt(entryId), petId: Number(id) },
      select: { id: true },
    });
    if (!entry) {
      throw createError({ statusCode: 404, message: "Médicament introuvable" });
    }

    result = await updateMedicationEntry(
      entryId,
      medication,
      frequencyDays,
      nextDoseDate,
      lastDoseDate,
    );
  } else {
    result = await addMedicationEntry(
      id,
      medication,
      frequencyDays,
      nextDoseDate,
      lastDoseDate,
    );
  }

  return result;
});
