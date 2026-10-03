import { auth } from "~~/server/utils/auth";
import { deleteUserService, verifyUserPassword } from "#server/utils/users";

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

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "ID utilisateur requis",
    });
  }

  if (session.user.id !== id) {
    throw createError({
      statusCode: 403,
      message: "Accès interdit",
    });
  }

  const body = await readBody<{ password?: string }>(event);
  if (typeof body?.password !== "string" || body.password.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Mot de passe requis",
    });
  }

  const password = body.password;
  await verifyUserPassword(event.headers, password);

  try {
    const response = await deleteUserService(id);
    return {
      message: "Utilisateur supprimé avec succès",
      data: response,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      message:
        error instanceof Error
          ? error.message
          : "Erreur de suppression : " + String(error),
    });
  }
});
