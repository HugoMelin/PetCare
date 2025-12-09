import { createDog } from '../../utils/dog'
import { auth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  })

  if (!session?.user) {
    throw createError({ statusCode: 401, message: 'Non authentifié' })
  }

  const body = await readBody(event);

  if (!body.name) {
    throw createError({ statusCode: 400, message: 'Le nom du chien est requis' })
  }

  const newDog = await createDog({
    ...body,
    userId: session.user.id,
  });

  return newDog;
});