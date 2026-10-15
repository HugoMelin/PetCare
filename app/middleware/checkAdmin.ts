import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async () => {
  const baseURL = new URL("/api/auth", useRequestURL().origin).href;
  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  const { data: session, error } = await authClient.getSession({
    fetchOptions: {
      baseURL,
      headers,
    },
  });

  if (error || !session?.user) {
    return navigateTo("/connexion");
  }

  const user = session.user;

  if (!user.role?.split(",").includes("admin")) {
    return navigateTo("/parametres");
  }
});
