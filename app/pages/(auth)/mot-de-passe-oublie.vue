<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
import { ref } from "vue";
import Button from "~/components/ui/button/Button.vue";
import Spinner from "~/components/ui/spinner/Spinner.vue";
import { toast } from "vue-sonner";

import { sendPasswordResetEmail, fetchUserSession } from "~/lib/auth-client";

definePageMeta({
  layout: "auth",
  allowAuthenticated: true,
});

const loading = ref(false);

const email = ref("");
const handleSubmit = async () => {
  if (loading.value) return;
  try {
    loading.value = true;
    const { error } = await sendPasswordResetEmail(email.value);
    if (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
    toast.success(
      "Si un compte existe pour cette adresse e-mail, un lien de réinitialisation y a été envoyé.",
    );
  } catch (error) {
    toast.error(
      "Une erreur est survenue lors de l'envoi de l'e-mail de réinitialisation du mot de passe.",
    );
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const isAuthenticated = ref(false);

onMounted(async () => {
  const session = await fetchUserSession();
  isAuthenticated.value = !!(session && session.data);
});
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-primary mb-2">PetCare</h1>
      <p class="text-gray-600">Réinitialisez votre mot de passe</p>
    </div>

    <Card>
      <template #title>
        <div class="flex items-center gap-2">
          <RouterLink :to="isAuthenticated ? '/' : '/connexion'">
            <ChevronLeft class="w-4 h-4" />
          </RouterLink>
          Mot de passe oublié
        </div>
      </template>
      <template #content>
        <p class="text-gray-600 mb-4">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
          de mot de passe.
        </p>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="email" class="block text-gray-700 mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              required
              class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            size="lg"
            class="w-full"
            :disabled="loading"
          >
            <template v-if="loading">
              <Spinner class="mr-2" />
              Envoi en cours...
            </template>
            <template v-else> Envoyer le lien de réinitialisation </template>
          </Button>
        </form>
      </template>
    </Card>
  </div>
</template>
