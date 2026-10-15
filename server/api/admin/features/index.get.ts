import type { Prisma } from "~~/generated/prisma/client";
import { requireAuth, requireAdmin } from "~~/server/utils/auth";
import { prisma } from "~~/server/utils/prisma";

export default defineEventHandler(async (event) => {
  await requireAdmin(await requireAuth(event));
  const query = getQuery(event);
  const sortBy = query.sortBy ?? "name";
  const sortOrder = query.sortOrder ?? "asc";
  const search = query.search ?? "";
  const sortableFields = ["name", "key", "enabledAt", "enabled"];

  if (
    typeof sortBy !== "string" ||
    !sortableFields.includes(sortBy) ||
    (sortOrder !== "asc" && sortOrder !== "desc") ||
    typeof search !== "string" ||
    search.length > 191
  ) {
    throw createError({
      statusCode: 400,
      message: "Les paramètres de recherche ou de tri sont invalides.",
    });
  }

  const term = search.trim();
  const orderBy: Prisma.FeatureOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };
  return prisma.feature.findMany({
    where: term
      ? { OR: [{ name: { contains: term } }, { key: { contains: term } }] }
      : undefined,
    orderBy: [orderBy, { id: "asc" }],
  });
});
