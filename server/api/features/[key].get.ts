import { requireToken } from "~~/server/utils/requireToken";
import { isFeatureEnabled } from "~~/server/utils/featureEnabled";

export default defineEventHandler(async (event) => {
  requireToken(event);

  const key = getRouterParam(event, "key");
  if (!key || typeof key !== "string" || key.length > 191) {
    throw createError({
      statusCode: 400,
      message: "Clé de fonctionnalité invalide.",
    });
  }

  const enabled = await isFeatureEnabled(key);
  return { feature: enabled };
});
