import { prisma } from "~~/server/utils/prisma";
import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { deleteWeightEntry } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const { id } = event.context.params;

  if (!id) return { error: "Weight entry ID is required" };

  const entry = await prisma.weightEntry.findUnique({
    where: { id: parseInt(id) },
    select: { petId: true },
  });
  if (!entry) {
    throw createError({ statusCode: 404, message: "Poids introuvable" });
  }
  await requirePetOwner(event.context.session.user.id, entry.petId);

  return deleteWeightEntry(id);
});
