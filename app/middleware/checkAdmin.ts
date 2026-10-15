import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async () => {
  // En SSR, appeler Nitro directement et transmettre les cookies de la requête.
  // L'URL publique peut être inaccessible depuis le conteneur (DNS/TLS local).
  const { data: session, error } = import.meta.server
    ? {
        data: await useRequestFetch()<
          Awaited<ReturnType<typeof authClient.getSession>>["data"]
        >("/api/auth/get-session"),
        error: null,
      }
    : await authClient.getSession();

  if (error || !session?.user) {
    return navigateTo("/connexion");
  }

  const user = session.user;

  if (!user.role?.split(",").includes("admin")) {
    return navigateTo("/parametres");
  }
});
