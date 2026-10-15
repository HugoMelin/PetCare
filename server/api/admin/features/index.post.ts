import { Prisma } from "~~/generated/prisma/client";
import { requireAuth, requireAdmin } from "~~/server/utils/auth";
import { createFeature } from "~~/server/utils/admin/feature";
import { validateFeatureInput } from "~~/server/utils/admin/feature-validation";

export default defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  await requireAdmin(session);

  const newFeature = validateFeatureInput(
    await readBody<unknown>(event),
    "create",
  );

  try {
    const feature = await createFeature(newFeature);
    setResponseStatus(event, 201);
    return feature;
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw createError({
        statusCode: 409,
        message: "Cette clé de fonctionnalité existe déjà.",
        data: {
          code: "FEATURE_KEY_CONFLICT",
          fields: { key: "Cette clé existe déjà." },
        },
      });
    }

    console.error("[features.create]", error);
    throw createError({
      statusCode: 500,
      message: "Impossible de créer la fonctionnalité.",
      data: { code: "FEATURE_CREATE_FAILED" },
    });
  }
});
