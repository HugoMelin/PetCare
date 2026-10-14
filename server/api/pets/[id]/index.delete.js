import { requireAuth } from "../../../utils/auth";
import { isUserPetCreator, deletePet } from "~~/server/utils/pets";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

  const id = getRouterParam(event, "id");

  const hasAccess = await isUserPetCreator(session.user.id, id);
  if (!hasAccess) {
    throw createError({ statusCode: 403, message: "Accès refusé" });
  }

  await deletePet(id);

  return { success: true };
});
