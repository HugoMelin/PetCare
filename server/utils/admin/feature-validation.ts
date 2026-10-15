import { createError } from "h3";
import type { Feature } from "~~/shared/types/feature";
import type { FeatureUpdate } from "./feature";

export function validateFeatureInput(body: unknown, mode: "create"): Feature;
export function validateFeatureInput(
  body: unknown,
  mode: "update",
): FeatureUpdate;
export function validateFeatureInput(
  body: unknown,
  mode: "create" | "update",
): Feature | FeatureUpdate {
  const partial = mode === "update";
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createError({
      statusCode: 400,
      message: "Le corps de la requête doit être un objet JSON.",
      data: { code: "VALIDATION_ERROR" },
    });
  }

  const input = body as Record<string, unknown>;
  const fields: Record<string, string> = {};
  const update: FeatureUpdate = {};

  for (const field of ["key", "name"] as const) {
    const value = input[field];
    if (value === undefined && partial) continue;
    if (typeof value !== "string" || !value.trim()) {
      fields[field] = "Ce champ doit être une chaîne non vide.";
    } else if (value.trim().length > 191) {
      fields[field] = "Ce champ ne doit pas dépasser 191 caractères.";
    } else {
      update[field] = value.trim();
    }
  }

  if (input.description !== undefined) {
    if (
      (input.description !== null || !partial) &&
      (typeof input.description !== "string" || input.description.length > 191)
    ) {
      fields.description =
        "La description doit être une chaîne de 191 caractères maximum" +
        (partial ? " ou null." : ".");
    } else {
      update.description = input.description as string | null;
    }
  }

  if (input.enabled !== undefined) {
    if (typeof input.enabled !== "boolean") {
      fields.enabled = "Le statut doit être un booléen.";
    } else {
      update.enabled = input.enabled;
    }
  }

  if (input.enabledAt !== undefined) {
    if (input.enabledAt === null && partial) {
      update.enabledAt = null;
    } else if (
      typeof input.enabledAt !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(
        input.enabledAt,
      ) ||
      Number.isNaN(Date.parse(input.enabledAt))
    ) {
      fields.enabledAt =
        "La date doit être une date ISO valide avec un fuseau horaire" +
        (partial ? " ou null." : ".");
    } else {
      update.enabledAt = new Date(input.enabledAt);
    }
  }

  if (Object.keys(fields).length || (partial && !Object.keys(update).length)) {
    throw createError({
      statusCode: 400,
      message: Object.keys(fields).length
        ? "Les données sont invalides."
        : "Au moins un champ à modifier est requis.",
      data: { code: "VALIDATION_ERROR", fields },
    });
  }

  if (partial) return update;

  return {
    key: update.key!,
    name: update.name!,
    description: update.description ?? undefined,
    enabledAt: update.enabledAt ?? undefined,
    enabled: update.enabled ?? false,
  };
}
