import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./resend";
import { resetPasswordEmail } from "../mails/reset-password";
import { verificationEmail } from "../mails/verification-email";
import { passwordChangedEmail } from "../mails/password-changed";
import { createAuthMiddleware, APIError } from "better-auth/api";

const resetPasswordExpiresInSeconds = 60 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,

    resetPasswordTokenExpiresIn: resetPasswordExpiresInSeconds,
    revokeSessionsOnPasswordReset: true,
    onPasswordReset: async ({ user }) => {
      await notifyPasswordChanged(user);
    },
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const result = ctx.context.returned;
      if (!result || result instanceof APIError) return;

      if (ctx.path === "/change-password") {
        const user = ctx.context.session?.user;
        if (!user) return;

        await notifyPasswordChanged(user);
      }
    }),
  },
});

async function notifyPasswordChanged(user: { email: string; name: string }) {
  try {
    const from = process.env.MAIL_FROM;
    const baseUrl = process.env.CLIENT_URL || process.env.BETTER_AUTH_URL;

    if (!from || !baseUrl) {
      console.error(
        "Alerte de sécurité non envoyée : MAIL_FROM et CLIENT_URL (ou BETTER_AUTH_URL) sont requis.",
      );
      return;
    }

    const recoveryUrl = new URL("/mot-de-passe-oublie", baseUrl);

    const { error } = await sendEmail(
      from,
      user.email,
      "Votre mot de passe PetCare a été modifié",
      passwordChangedEmail({
        clientName: user.name,
        recoveryUrl: recoveryUrl.href,
      }),
    );

    if (error) {
      console.error(
        "Échec de l’envoi de l’alerte de sécurité :",
        error.message,
      );
    }
  } catch {
    console.error("Erreur lors de l’envoi de l’alerte de sécurité.");
  }
}
