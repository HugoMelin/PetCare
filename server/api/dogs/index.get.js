import { getDogsOwnedByUserId } from '~~/server/utils/dog';
import { auth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const dogs = await getDogsOwnedByUserId(session.user.id);

  return dogs;
});