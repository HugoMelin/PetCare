import { createAuthClient } from "better-auth/vue";
import { usePetStore } from "~/stores/petStore";

export const authClient = createAuthClient({});

export async function signUp(email, password, name) {
  const petStore = usePetStore();
  petStore.clearPetCache();

  const { data, error } = await authClient.signUp.email(
    {
      email,
      password,
      name,
      callbackURL: "/",
    },
    {
      onSuccess: (ctx) => {
        console.log("Sign-up successful:", ctx);
        return navigateTo("/");
      },
      onError: (ctx) => {
        console.error("Sign-up error:", ctx.error);
      },
    }
  );

  return { data, error };
}

export async function signIn(email, password, rememberMe = false) {
  const petStore = usePetStore();
  petStore.clearPetCache();

  const { data, error } = await authClient.signIn.email(
    {
      email,
      password,
      rememberMe,
      callbackURL: "/",
    },
    {
      onSuccess: (ctx) => {
        console.log("Sign-in successful:", ctx);
        return navigateTo("/");
      },
      onError: (ctx) => {
        console.error("Sign-in error:", ctx.error);
      },
    }
  );

  return { data, error };
}

export async function signOut() {
  const petStore = usePetStore();
  petStore.clearPetCache();

  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        console.log("Sign-out successful");
        return navigateTo("/connexion");
      },
      onError: (ctx) => {
        console.error("Sign-out error:", ctx.error);
      },
    },
  });
}

export async function fetchUserSession() {
  return await authClient.getSession();
}
