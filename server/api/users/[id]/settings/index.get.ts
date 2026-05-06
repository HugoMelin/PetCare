import { auth } from "~~/server/utils/auth";
import { getUserMedicationNotifications } from "~~/server/utils/medicationsNotfications";

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

  if (session.user.id !== id) {
    throw createError({
      statusCode: 403,
      message: "Accès interdit",
    });
  }

  const wantsRemindersMails = await getUserMedicationNotifications(id || "0");

  return {
    ...wantsRemindersMails,
  };
});
