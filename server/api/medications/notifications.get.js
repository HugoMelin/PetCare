import { getAllMedicationsNotifications } from "~~/server/utils/medicationsNotfications";
import { sendEmail } from "~~/server/utils/resend";

export default defineEventHandler(async () => {
  const result = await getAllMedicationsNotifications();

  const emailHTML =
    "<p>Congrats on sending your <strong>first email</strong>!</p>";

  try {
    await sendEmail(
      "Notifications PetCare <contact@petcare.torefi.fr>",
      "hugo.melin@torefi.fr",
      "Hello World",
      emailHTML,
    );

    return {
      result,
      emailSent: true,
    };
  } catch (error) {
    return {
      result,
      emailSent: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
});
