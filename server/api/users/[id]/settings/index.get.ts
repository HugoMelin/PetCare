import { requireAuth } from "~~/server/utils/auth";
import { getUserMedicationNotifications } from "~~/server/utils/medicationsNotfications";

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const session = event.context.session;

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
