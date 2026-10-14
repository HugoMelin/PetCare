import { getPetsOwnedByUserId } from "~~/server/utils/pets";
import { requireAuth } from "../../utils/auth";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

  const pets = await getPetsOwnedByUserId(session.user.id);

  return pets;
});
