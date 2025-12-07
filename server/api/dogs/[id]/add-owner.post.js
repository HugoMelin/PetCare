import { auth } from "~~/server/utils/auth";
import { addDogOwners, isUserDogOwner } from "~~/server/utils/dog";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Non authentifié',
    });
  }

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);

  const hasAccess = await isUserDogOwner(session.user.id, id);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Accès refusé',
    });
  }

  const updatedDog = await addDogOwners(id, body.newOwnerUserId);

  return updatedDog;
});