import { auth } from "~~/server/utils/auth";
import { updateUserReminderStatus } from "~~/server/utils/medicationsNotfications";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session) {
    throw createError({
      statusCode: 401,
      message: "Utilisateur non authentifié",
    });
  }

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
