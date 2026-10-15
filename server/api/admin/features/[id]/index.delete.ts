import { Prisma } from "~~/generated/prisma/client";
import { requireAuth, requireAdmin } from "~~/server/utils/auth";
import { deleteFeature } from "~~/server/utils/admin/feature";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  await requireAdmin(session);

  const param = getRouterParam(event, "id");
  const id = Number(param);
  if (!param || !/^\d+$/.test(param) || !Number.isSafeInteger(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      message: "L’identifiant de la fonctionnalité est invalide.",
      data: { code: "VALIDATION_ERROR" },
    });
  }

  try {
    return await deleteFeature(id);
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw createError({
        statusCode: 404,
        message: "Fonctionnalité introuvable.",
        data: { code: "FEATURE_NOT_FOUND" },
      });
    }

    console.error("[features.delete]", error);
    throw createError({
      statusCode: 500,
      message: "Impossible de supprimer la fonctionnalité.",
      data: { code: "FEATURE_DELETE_FAILED" },
    });
  }
});
