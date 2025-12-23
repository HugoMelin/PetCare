import { auth } from "~~/server/utils/auth";
import {
  removePetOwner,
  isUserPetOwner,
  isUserPetCreator,
} from "~~/server/utils/pets";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Non authentifié",
    });
  }

  const id = getRouterParam(event, "id");
  const body = await readBody(event);

  const hasAccess = await isUserPetOwner(session.user.id, id);
  const isCreatorUser = await isUserPetCreator(body.ownerUserId, id);
  if (!hasAccess && !isCreatorUser) {
    throw createError({
      statusCode: 403,
      message: "Accès refusé",
    });
  }

  const updatedPet = await removePetOwner(id, body.ownerUserId);

  return updatedPet;
});
