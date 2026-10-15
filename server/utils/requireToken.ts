import { createHash, timingSafeEqual } from "node:crypto";

/** Vérifie le token Bearer partagé configuré dans TOKEN_SECRET. */
export function requireToken(event: Parameters<typeof getHeader>[0]): void {
  setResponseHeader(event, "Cache-Control", "no-store");

  const secret = process.env.TOKEN_SECRET;
  if (!secret?.trim()) {
    throw createError({
      statusCode: 500,
      message: "Le service est indisponible.",
    });
  }

  const authorization = getHeader(event, "authorization");
  const token = authorization?.match(/^Bearer ([^\s]+)$/i)?.[1];
  // Comparer des empreintes de taille fixe, même si les tokens diffèrent en longueur.
  const validToken =
    token &&
    timingSafeEqual(
      createHash("sha256").update(token).digest(),
      createHash("sha256").update(secret).digest(),
    );

  if (!validToken) {
    setResponseHeader(event, "WWW-Authenticate", "Bearer");
    throw createError({
      statusCode: 401,
      message: "Token absent ou invalide.",
    });
  }
}
