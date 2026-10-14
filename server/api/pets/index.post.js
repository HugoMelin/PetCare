import { createPet } from "../../utils/pets";
import { requireAuth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

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
