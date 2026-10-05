<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import { toast } from "vue-sonner";
import { Label, PasswordInput } from "~/components/ui/Form";
import { Spinner } from "~/components/ui/spinner";
import { updatePassword } from "~/lib/auth-client";
const profileForm = ref({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});
const passwordChangeError = ref<string | null>(null);
const loading = ref({ password: false });
const resetPasswordForm = () => {
  profileForm.value.oldPassword = "";
  profileForm.value.newPassword = "";
  profileForm.value.confirmNewPassword = "";
  passwordChangeError.value = null;
};
const handleChangePassword = async () => {
  if (
    !profileForm.value.oldPassword ||
    !profileForm.value.newPassword ||
    loading.value.password
  ) {
    return;
  }

  passwordChangeError.value = null;

  if (profileForm.value.newPassword !== profileForm.value.confirmNewPassword) {
    passwordChangeError.value =
      "Les nouveaux mots de passe ne correspondent pas.";
    return;
  }

  try {
    loading.value.password = true;
    const { error } = await updatePassword(
      profileForm.value.oldPassword,
      profileForm.value.newPassword,
    );
    if (error) {
      throw new Error(error.message);
    } else {
      toast.success("Mot de passe mis à jour avec succès !");
      resetPasswordForm();
    }
  } catch (error) {
    toast.error(
      `Erreur lors de la mise à jour du mot de passe: ${error instanceof Error ? error.message : String(error)}`,
    );
  } finally {
    loading.value.password = false;
  }
};
</script>

<template>
  <div class="p-4 border border-gray-200 rounded-lg mb-4">
    <form class="flex flex-col gap-2" @submit.prevent="handleChangePassword">
      <div>
        <Label for="oldPassword" class="text-gray-600 text-sm mb-1"
          >Ancien mot de passe</Label
        >
        <PasswordInput
          id="oldPassword"
          v-model="profileForm.oldPassword"
          autocomplete="current-password"
          :minlength="1"
        />
      </div>

      <div>
        <Label for="newPassword" class="text-gray-600 text-sm mb-1"
          >Nouveau mot de passe</Label
        >
        <PasswordInput
          id="newPassword"
          v-model="profileForm.newPassword"
          autocomplete="new-password"
          :minlength="8"
          :maxlength="128"
        />
      </div>

      <div v-if="profileForm.newPassword">
        <Label for="confirmNewPassword" class="text-gray-600 text-sm mb-1"
          >Confirmer le nouveau mot de passe</Label
        >
        <PasswordInput
          id="confirmNewPassword"
          v-model="profileForm.confirmNewPassword"
          autocomplete="new-password"
          :minlength="8"
          :maxlength="128"
        />
      </div>

      <p v-if="passwordChangeError" class="text-red-500 text-sm">
        {{ passwordChangeError }}
      </p>

      <Button
        type="submit"
        class="flex items-center justify-center gap-2 mt-2 w-full lg:w-fit"
        :disabled="loading.password"
      >
        <Spinner v-if="loading.password" class="w-4 h-4" />
        <span>Modifier le mot de passe</span>
      </Button>
    </form>
  </div>
</template>
