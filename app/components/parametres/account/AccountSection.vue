<script setup lang="ts">
import Button from "~/components/ui/button/Button.vue";
import { toast } from "vue-sonner";
import Card from "~/components/ui/card/Card.vue";
import { Banner } from "~/components/ui/banner";
import { Info } from "lucide-vue-next";
import { sendEmailVerification } from "~/lib/auth-client";
import EmailForm from "./EmailForm.vue";
import PasswordForm from "./PasswordForm.vue";
import ReminderSection from "./ReminderSection.vue";
import AccountActions from "./AccountActions.vue";
const props = withDefaults(
  defineProps<{ user?: { email: string; emailVerified: boolean } | null }>(),
  { user: null },
);
const editingProfile = ref(false);
const handleSendEmailVerification = async () => {
  if (!props.user?.email) return;

  try {
    const { error } = await sendEmailVerification(props.user.email);
    if (error) {
      throw new Error(error.message);
    } else {
      toast.success(
        "Un email de confirmation a été envoyé. Veuillez vérifier votre boîte de réception.",
      );
    }
  } catch (error) {
    toast.error(
      `Erreur lors de l'envoi de l'email de confirmation: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};
</script>

<template>
  <Card>
    <template #title>
      <div class="flex items-center justify-between">
        <span>Mon compte</span>
        <Button
          variant="link"
          size="sm"
          class="flex items-center gap-2"
          @click="editingProfile = !editingProfile"
        >
          <span v-if="!editingProfile">Modifier mon compte</span>
          <span v-else>Arrêter de modifier</span>
        </Button>
      </div>
    </template>
    <template #content>
      <Banner
        v-if="user && !user.emailVerified"
        class="mb-6"
        variant="warning"
        :icon="Info"
      >
        <p>Votre adresse mail n'est pas encore validée.</p>

        <template #action>
          <Button
            variant="link"
            size="sm"
            class="w-fit ml-auto"
            @click="handleSendEmailVerification()"
          >
            <span>Valider mon adresse mail</span>
          </Button>
        </template>
      </Banner>

      <div v-if="editingProfile" class="space-y-4 mb-4">
        <EmailForm :user="user" />
        <PasswordForm />
      </div>
      <div v-else class="p-4 border border-gray-200 rounded-lg mb-4">
        <p class="text-gray-600 text-sm mb-1">Email</p>
        <p class="text-gray-900">{{ user?.email || "N/C" }}</p>
      </div>

      <ReminderSection />

      <AccountActions />
    </template>
  </Card>
</template>
