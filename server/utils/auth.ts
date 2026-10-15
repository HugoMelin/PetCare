import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { sendEmail } from "./resend";
import { resetPasswordEmail } from "../mails/reset-password";
import { verificationEmail } from "../mails/verification-email";
import { passwordChangedEmail } from "../mails/password-changed";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { petsCleaner } from "./users";

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
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await petsCleaner(user.id);
      },
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
    before: createAuthMiddleware(async (ctx) => {
      // Interdire la suppression par lien/token sans mot de passe.
      if (ctx.path === "/delete-user/callback") {
        throw new APIError("FORBIDDEN", {
          message: "La suppression nécessite votre mot de passe.",
        });
      }

      if (ctx.path !== "/delete-user") return;

      const password = ctx.body?.password;

      if (typeof password !== "string" || password.length === 0) {
        throw new APIError("BAD_REQUEST", {
          message: "Le mot de passe est obligatoire.",
        });
      }
    }),
  },
  plugins: [admin()],
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

export const requireAuth = async (event: {
  headers: Headers;
  context: Record<string, unknown>;
}) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (session?.user) {
    event.context.session = session;
    return session;
  }

  const bypassEnabled =
    process.env.APP_ENV === "development" &&
    process.env.NUXT_DISABLE_REQUIRE_AUTH === "true";

  if (bypassEnabled) {
    const userId = process.env.DEV_AUTH_USER_ID;

    if (!userId) {
      throw createError({
        statusCode: 500,
        statusMessage: "DEV_AUTH_USER_ID is required for local auth bypass",
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: "Local auth bypass user not found",
      });
    }

    const now = new Date();

    const localSession = {
      user,
      session: {
        id: "local-dev-session",
        token: "local-dev-token",
        userId: user.id,
        createdAt: now,
        updatedAt: now,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000),
        ipAddress: null,
        userAgent: null,
      },
    };

    event.context.session = localSession;
    return localSession;
  }

  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
  });
};
