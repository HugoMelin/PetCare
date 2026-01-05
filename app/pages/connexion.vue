<script setup>
import Card from "~/components/ui/Card.vue";
import GoogleIcon from "~/components/icons/GoogleIcon.vue";
import FacebookIcon from "~/components/icons/FacebookIcon.vue";
import AppleIcon from "~/components/icons/AppleIcon.vue";
import MailIcon from "~/components/icons/MailIcon.vue";
import LockIcon from "~/components/icons/LockIcon.vue";
import EyeIcon from "~/components/icons/EyeIcon.vue";
import EyeOffIcon from "~/components/icons/EyeOffIcon.vue";
import Button from "~/components/ui/Button.vue";

import { signIn } from "~/lib/auth-client";

definePageMeta({
  layout: "auth",
});

const showPassword = ref(false);
const error = ref(null);

const formSignIn = reactive({
  email: "",
  password: "",
  rememberMe: false,
});

const handleSignIn = async () => {
  const { error: signInError } = await signIn(
    formSignIn.email,
    formSignIn.password,
    formSignIn.rememberMe,
  );
  if (signInError) {
    error.value =
      signInError.message || "Une erreur est survenue lors de la connexion.";
  } else {
    error.value = null;
  }
};
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-primary mb-2">PetCare</h1>
      <p class="text-gray-600">Connectez-vous à votre compte</p>
    </div>

    <Card>
      <template #title> Se connecter </template>
      <template #content>
        <!-- Social Buttons -->
        <div class="space-y-3 mb-6">
          <Button
            variant="socialAuth"
            size="lg"
            class="w-full"
            disabled
            @click="signIn('google')"
          >
            <GoogleIcon class="w-5 h-5 mr-2" />
            <span>Continuer avec Google</span>
          </Button>

          <Button
            variant="socialAuth"
            size="lg"
            class="w-full"
            disabled
            @click="signIn('facebook')"
          >
            <FacebookIcon class="w-5 h-5 mr-2 rounded-full" />
            <span>Continuer avec Facebook</span>
          </Button>

          <Button
            variant="socialAuth"
            size="lg"
            class="w-full"
            disabled
            @click="signIn('apple')"
          >
            <AppleIcon class="w-5 h-5 mr-2" />
            <span>Continuer avec Apple</span>
          </Button>
        </div>

        <!-- Divider -->
        <div class="relative mb-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <!-- Sign In Form -->
        <form class="space-y-4" @submit.prevent="handleSignIn">
          <div>
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <div class="relative">
              <MailIcon
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                id="email"
                v-model="formSignIn.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="votre@email.com"
              />
            </div>
            <p
              v-if="error && error === 'Invalid email'"
              class="mt-1 text-red-600 text-sm"
            >
              Adresse email invalide.
            </p>
          </div>

          <div>
            <label for="password" class="block text-gray-700 mb-2"
              >Mot de passe</label
            >
            <div class="relative">
              <LockIcon
                class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              />
              <input
                id="password"
                v-model="formSignIn.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow"
                placeholder="••••••••"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                @click="showPassword = !showPassword"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2">
              <input
                v-model="formSignIn.rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
              />
              <span class="text-sm text-gray-600">Se souvenir de moi</span>
            </label>
            <button
              type="button"
              class="text-sm text-primary hover:text-primary-dark"
            >
              Mot de passe oublié ?
            </button>
          </div>

          <Button type="submit" variant="default" size="lg" class="w-full">
            Se connecter
          </Button>
          <p
            v-if="error && error === 'Invalid email or password'"
            class="mt-4 text-red-600 text-sm"
          >
            Email ou mot de passe incorrect.
          </p>
          <p
            v-else-if="error && error !== 'Invalid email'"
            class="mt-4 text-red-600 text-sm"
          >
            {{ error }}
          </p>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600">
            Pas encore de compte ?
            <RouterLink to="/inscription">
              <span class="text-primary hover:text-primary/90"
                >Créer un compte</span
              >
            </RouterLink>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>
