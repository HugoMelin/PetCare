import { requireAuth, requireAdmin } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";
export default defineEventHandler(async (event) => {
  await requireAdmin(await requireAuth(event));
  const param = getRouterParam(event, "id");
  const id = Number(param);
  if (!param || !/^\d+$/.test(param) || !Number.isSafeInteger(id) || id <= 0) {
    throw createError({ statusCode: 400, message: "Identifiant invalide." });
  }
  const feature = await prisma.feature.findUnique({ where: { id } });
  if (!feature)
    throw createError({
      statusCode: 404,
      message: "Fonctionnalité introuvable.",
    });
  return feature;
});
