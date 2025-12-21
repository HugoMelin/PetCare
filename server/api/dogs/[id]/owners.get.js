import { auth } from "~~/server/utils/auth";
import { getDogOwners } from "~~/server/utils/dog";

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

  const hasAccess = await isUserDogOwner(session.user.id, id);
  if (!hasAccess) {
    throw createError({
      statusCode: 403,
      message: 'Accès refusé',
    });
  }

  const owners = await getDogOwners(id);

  return owners;
});