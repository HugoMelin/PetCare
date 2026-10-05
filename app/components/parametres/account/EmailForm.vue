<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import { toast } from "vue-sonner";
import { Input, Label } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/spinner";
import { updateEmail } from "~/lib/auth-client";
const props = withDefaults(defineProps<{ user?: { email: string } | null }>(), {
  user: null,
});
const profileForm = ref({ email: props.user?.email || "", confirmEmail: "" });
const changeEmailError = ref<string | null>(null);
const loading = ref({ email: false });
const resetEmailForm = () => {
  profileForm.value.email = props.user?.email || "";
  profileForm.value.confirmEmail = "";
  changeEmailError.value = null;
};
const handleChangeMail = async () => {
  if (
    !profileForm.value.email ||
    !profileForm.value.confirmEmail ||
    loading.value.email
  ) {
    return;
  }

  changeEmailError.value = null;

  if (profileForm.value.email !== profileForm.value.confirmEmail) {
    changeEmailError.value = "Les emails ne correspondent pas.";
    return;
  }
  try {
    loading.value.email = true;
    const newEmail = profileForm.value.email;
    const { error } = await updateEmail(newEmail);
    if (error) {
      throw new Error(error.message);
    } else {
      toast.success(
        "Si cette adresse est disponible, un email de confirmation vous a été envoyé. Votre adresse actuelle reste inchangée jusqu’à la validation du lien.",
      );
      resetEmailForm();
    }
  } catch (error) {
    toast.error(
      `Erreur lors de la mise à jour de l'email: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    loading.value.email = false;
  }
};
</script>

<template>
  <div class="p-4 border border-gray-200 rounded-lg">
    <form class="flex flex-col gap-2" @submit.prevent="handleChangeMail">
      <div>
        <Label for="email" class="text-gray-600 text-sm mb-1">Email</Label>
        <Input
          id="email"
          v-model="profileForm.email"
          type="email"
          required
          autocomplete="email"
          class="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <Label for="confirmEmail" class="text-gray-600 text-sm mb-1"
          >Confirmer l'email</Label
        >
        <Input
          id="confirmEmail"
          v-model="profileForm.confirmEmail"
          type="email"
          required
          autocomplete="email"
          class="border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <p v-if="changeEmailError" class="text-red-500 text-sm">
        {{ changeEmailError }}
      </p>

      <Button
        type="submit"
        class="flex items-center justify-center gap-2 mt-2 w-full lg:w-fit"
        :disabled="loading.email"
      >
        <Spinner v-if="loading.email" class="w-4 h-4" />
        <span>Modifier l'email</span>
      </Button>
    </form>
  </div>
</template>
