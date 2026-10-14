import { prisma } from "~~/server/utils/prisma";
import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { deleteMedicationEntry } from "~~/server/utils/medications";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const { id } = event.context.params;

  if (!id) return { error: "Medication entry ID is required" };

  const entry = await prisma.medication.findUnique({
    where: { id: parseInt(id) },
    select: { petId: true },
  });
  if (!entry) {
    throw createError({ statusCode: 404, message: "Médicament introuvable" });
  }
  await requirePetOwner(event.context.session.user.id, entry.petId);

  const result = await deleteMedicationEntry(id);

  return result;
});
