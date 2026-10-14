import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { getWeightsByPetId } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const { id } = event.context.params;

  if (!id) return { error: "Pet ID is required" };

  await requirePetOwner(event.context.session.user.id, id);

  const weights = await getWeightsByPetId(id);

  return weights;
});
