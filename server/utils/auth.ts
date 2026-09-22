import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./resend";
import { resetPasswordEmail } from "../mails/reset-password";

const resetPasswordExpiresInSeconds = 60 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,

    resetPasswordTokenExpiresIn: resetPasswordExpiresInSeconds,
    revokeSessionsOnPasswordReset: true,

    sendResetPassword: async ({ user, url }) => {
      const from = process.env.MAIL_FROM;

      if (!from) {
        throw new Error("MAIL_FROM environment variable is not set");
      }

      void sendEmail(
        from,
        user.email,
        "Réinitialisation de votre mot de passe PetCare",
        resetPasswordEmail({
          clientName: user.name,
          resetUrl: url,
          expiresInMinutes: resetPasswordExpiresInSeconds / 60,
        }),
      )
        .then(({ error }) => {
          if (error) {
            console.error(
              "Échec de l’email de réinitialisation :",
              error.message,
            );
          }
        })
        .catch(() => {
          console.error("Erreur réseau lors de l’email de réinitialisation.");
        });
    },
  },
});
