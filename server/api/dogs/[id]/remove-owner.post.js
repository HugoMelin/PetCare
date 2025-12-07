import { auth } from "~~/server/utils/auth";
import { removeDogOwner, isUserDogOwner, isUserDogCreator } from "~~/server/utils/dog";

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
  const isCreatorUser = await isUserDogCreator(body.ownerUserId, id);
  if (!hasAccess && !isCreatorUser) {
    throw createError({
      statusCode: 403,
      message: 'Accès refusé',
    });
  }

  const updatedDog = await removeDogOwner(id, body.ownerUserId);

  return updatedDog;
});