import { requireAuth } from "~~/server/utils/auth";
import { updateUserReminderStatus } from "~~/server/utils/medicationsNotfications";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

  const id = getRouterParam(event, "id");
  const { status } = await readBody(event);

  if (session.user.id !== id) {
    throw createError({
      statusCode: 403,
      message: "Accès interdit",
    });
  }

  try {
    await updateUserReminderStatus(session.user.id, status);
    return { success: true };
  } catch {
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la mise à jour du statut des rappels",
    });
  }
});
