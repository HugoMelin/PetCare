import { medicationsReminderEmail } from "~~/server/mails/medications-reminder";

export default defineEventHandler(async (event) => {
  const secret = getHeader(event, "x-secret");

  if (secret !== process.env.CRON_SECRET) {
    throw createError({ statusCode: 401, message: "Unauthorized" });
  }

  const medicationsUrl = `${process.env.CLIENT_URL}/medicaments`;

  return medicationsReminderEmail({
    clientName: "Hugo",
    petName: "Oslo",
    medications: [
      {
        name: "Bravecto",
        nextDoseDate: new Date("2026-06-22T00:00:00.000Z"),
        frequencyDays: 30,
      },
    ],
    medicationsUrl,
  });
});