import { requireAuth } from "~~/server/utils/auth";
import { updatePet, isUserPetOwner } from "~~/server/utils/pets";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const hasAccess = await isUserPetOwner(session.user.id, id);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: "Accès refusé",
    });
  }

  const updatedPet = await updatePet(id, body);

  return updatedPet;
});
