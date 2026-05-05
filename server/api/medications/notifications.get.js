import { getAllMedicationsNotifications } from "~~/server/utils/medicationsNotfications";
import { medicationsReminderEmail } from "~~/server/mails/medications-reminder";
import { sendEmail } from "~~/server/utils/resend";

export default defineEventHandler(async () => {
  const data = [];

  const result = await getAllMedicationsNotifications();
  const medicationsUrl = `${process.env.CLIENT_URL}/medicaments`;
  const pets = result.map((pet) => pet);

  for (const pet of pets) {
    if (pet.medications.length > 0) {
      for (const owner of pet.owner) {
        try {
          const emailResult = await sendEmail(
            "Notifications PetCare <contact@petcare.torefi.fr>",
            owner.email,
            `Rappel médicament pour ${pet.name} - Ne pas répondre`,
            medicationsReminderEmail({
              clientName: owner.name,
              petName: pet.name,
              medications: pet.medications.map((medication) => ({
                name: medication.medication,
                nextDoseDate: medication.nextDoseDate,
                frequencyDays: medication.frequencyDays,
              })),
              medicationsUrl,
            })
          );

          data.push({
            to: owner.email,
            petId: pet.id,
            emailSent: true,
            emailResult,
          });
        } catch (error) {
          data.push({
            to: owner.email,
            petId: pet.id,
            emailSent: false,
            error: error instanceof Error ? error.message : "Erreur inconnue",
          });
        }
      }
    }
  }

  return data;

  /* return medicationsReminderEmail({
    clientName: "Hugo",
    petName: "Oslo",
    medications: [
      {
        name: "Bravecto",
        nextDoseDate: new Date("2026-04-22T00:00:00.000Z"),
        frequencyDays: 30,
      },
    ],
    medicationsUrl,
  }); */
});
