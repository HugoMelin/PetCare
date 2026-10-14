import { requireAuth } from "~~/server/utils/auth";
import {
  removePetOwner,
  isUserPetOwner,
  isUserPetCreator,
} from "~~/server/utils/pets";

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

  const isCreatorUser = await isUserPetCreator(body.ownerUserId, id);
  if (isCreatorUser) {
    throw createError({
      statusCode: 403,
      message: "Le propriétaire principal ne peut pas être retiré",
    });
  }

  const updatedPet = await removePetOwner(id, body.ownerUserId);

  return updatedPet;
});
