import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./resend";
import { resetPasswordEmail } from "../mails/reset-password";
import { verificationEmail } from "../mails/verification-email";

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
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: false,
    },
  },
  emailVerification: {
    expiresIn: 60 * 60,
    sendOnSignUp: false,
    sendOnSignIn: false,
    sendVerificationEmail: async ({ user, url }) => {
      const from = process.env.MAIL_FROM;
      if (!from) {
        throw new Error("MAIL_FROM environment variable is not set");
      }

      const { error } = await sendEmail(
        from,
        user.email,
        "Confirmez votre adresse email PetCare",
        verificationEmail({ verificationUrl: url }),
      );
      if (error) {
        throw new Error("Impossible d’envoyer l’email de confirmation.");
      }
    },
  },
});
