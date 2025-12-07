import { auth } from '../../../utils/auth'
import { isUserDogCreator, deleteDog } from '~~/server/utils/dog';

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const id = getRouterParam(event, 'id');

  const hasAccess = await isUserDogCreator(session.user.id, id);
  if (!hasAccess) {
    throw createError({ statusCode: 403, message: 'Accès refusé' });
  }
  
  await deleteDog(id);

  return { success: true };
});