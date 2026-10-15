import { Prisma } from "~~/generated/prisma/client";
import { requireAuth, requireAdmin } from "~~/server/utils/auth";
import { modifyFeature } from "~~/server/utils/admin/feature";
import { validateFeatureInput } from "~~/server/utils/admin/feature-validation";

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

  const update = validateFeatureInput(await readBody<unknown>(event), "update");

  try {
    return await modifyFeature(id, update);
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw createError({
          statusCode: 404,
          message: "Fonctionnalité introuvable.",
          data: { code: "FEATURE_NOT_FOUND" },
        });
      }
      if (error.code === "P2002") {
        throw createError({
          statusCode: 409,
          message: "Cette clé de fonctionnalité existe déjà.",
          data: {
            code: "FEATURE_KEY_CONFLICT",
            fields: { key: "Cette clé existe déjà." },
          },
        });
      }
    }

    console.error("[features.update]", error);
    throw createError({
      statusCode: 500,
      message: "Impossible de modifier la fonctionnalité.",
      data: { code: "FEATURE_UPDATE_FAILED" },
    });
  }
});
