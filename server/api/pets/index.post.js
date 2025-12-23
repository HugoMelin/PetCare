import { createPet } from "../../utils/pets";
import { auth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Non authentifié" });
  }

  const body = await readBody(event);

  if (!body.name) {
    throw createError({
      statusCode: 400,
      message: "Le nom de l'animal est requis",
    });
  }

  const newPet = await createPet({
    ...body,
    userId: session.user.id,
  });

  return newPet;
});
