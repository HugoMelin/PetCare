<script setup lang="ts">
import { useRoute } from "vue-router";
import { Card } from "~/components/ui/card";
import { resetPassword } from "~/lib/auth-client";
import { Spinner } from "~/components/ui/spinner";
import { toast } from "vue-sonner";
import { PasswordInput } from "~/components/ui/Form";

const route = useRoute();

definePageMeta({
  layout: "auth",
  allowAuthenticated: true,
});

const token = computed(() =>
  typeof route.query.token === "string" ? route.query.token : "",
);
const tokenRejected = ref(false);

const invalidLink = computed(
  () =>
    !token.value ||
    route.query.error === "INVALID_TOKEN" ||
    tokenRejected.value,
);

const loading = ref(false);

const form = reactive({
  password: "",
  confirmPassword: "",
});
const error = ref<string | null>(null);

const handleResetPassword = async () => {
  if (loading.value || invalidLink.value) return;

  error.value = null;

  if (form.password !== form.confirmPassword) {
    error.value = "Les mots de passe ne correspondent pas.";
    return;
  }

  loading.value = true;

  try {
    const { error: resetError } = await resetPassword(
      token.value,
      form.password,
    );

    if (resetError) {
      if (resetError.code === "INVALID_TOKEN") {
        tokenRejected.value = true;
        form.password = "";
        form.confirmPassword = "";
        return;
      }

      if (resetError.code === "PASSWORD_TOO_SHORT") {
        error.value = "Le mot de passe est trop court.";
      } else if (resetError.code === "PASSWORD_TOO_LONG") {
        error.value = "Le mot de passe est trop long.";
      } else {
        error.value = "La réinitialisation a échoué. Veuillez réessayer.";
      }

      return;
    }

    toast.success("Votre mot de passe a été réinitialisé avec succès.");

    await navigateTo("/connexion", { replace: true });
  } catch (err) {
    toast.error(
      "Une erreur est survenue lors de la réinitialisation du mot de passe.",
    );
    console.error("Error resetting password:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div>
    <div class="text-center mb-8">
      <h1 class="text-primary mb-2">PetCare</h1>
      <p class="text-gray-600">Choisissez un nouveau mot de passe</p>
    </div>

    <Card v-if="invalidLink">
      <template #title> Lien invalide </template>
      <template #content>
        <p class="text-gray-600">
          Ce lien a expiré ou a déjà été utilisé. Demandez un nouveau lien pour
          réinitialiser votre mot de passe.
        </p>
        <NuxtLink
          to="/mot-de-passe-oublie"
          class="inline-block text-primary underline mt-2"
        >
          Demander un nouveau lien
        </NuxtLink>
      </template>
    </Card>
    <Card v-else>
      <template #title> Réinitialiser le mot de passe </template>
      <template #content>
        <form class="space-y-4" @submit.prevent="handleResetPassword">
          <div>
            <label for="password" class="block text-gray-700 mb-2"
              >Mot de passe</label
            >
            <PasswordInput id="password" v-model="form.password" />
          </div>

          <div>
            <label for="confirmPassword" class="block text-gray-700 mb-2"
              >Confirmer le mot de passe</label
            >
            <PasswordInput
              id="confirmPassword"
              v-model="form.confirmPassword"
            />
          </div>
          <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>

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
            <template v-else> Réinitialiser le mot de passe </template>
          </Button>
        </form>
      </template>
    </Card>
  </div>
</template>
