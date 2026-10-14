import { requirePetOwner } from "~~/server/utils/pets";
import { requireAuth } from "~~/server/utils/auth";
import { addWeightEntry } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event);

  if (!body.petId || !body.weight)
    return { error: "petId and weight are required" };

  await requirePetOwner(event.context.session.user.id, body.petId);

  const newWeightEntry = await addWeightEntry(body);

  return newWeightEntry;
});
