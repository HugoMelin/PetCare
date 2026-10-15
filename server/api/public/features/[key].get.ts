import { isFeatureEnabled } from "~~/server/utils/featureEnabled";

/** État public uniquement : aucun token ni métadonnée d’administration. */
export default defineEventHandler(async (event) => {
  setResponseHeader(event, "Cache-Control", "no-store");

  const key = getRouterParam(event, "key");
  if (!key || key.length > 191) {
    throw createError({
      statusCode: 400,
      message: "Clé de fonctionnalité invalide.",
    });
  }

  const feature = await isFeatureEnabled(key);
  return { enabled: feature.enabled };
});
