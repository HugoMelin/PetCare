import { getPetsOwnedByUserId } from "~~/server/utils/pets";
import { auth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({ statusCode: 401, message: "Non authentifié" });
  }

  const pets = await getPetsOwnedByUserId(session.user.id);

  return pets;
});
