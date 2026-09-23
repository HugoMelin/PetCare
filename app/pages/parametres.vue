<script setup>
import Button from "~/components/ui/button/Button.vue";
import LogOutIcon from "~/components/icons/LogOutIcon.vue";
import Card from "~/components/ui/card/Card.vue";
import {
  signOut,
  authClient,
  updateEmail,
  updatePassword,
} from "~/lib/auth-client";
import PetCard from "~/components/parametres/PetCard.vue";
import AboutSection from "~/components/parametres/AboutSection.vue";
import { useSettingStore } from "~/stores/settingStore";
import { Input, Label, PasswordInput } from "~/components/ui/Form";
import { toast } from "vue-sonner";
import { Spinner } from "~/components/ui/spinner";

const session = authClient.useSession();
const route = useRoute();

onMounted(() => {
  if (route.query.error) {
    toast.error(
      "La confirmation de l’adresse email a échoué. Le lien peut être expiré ou invalide. Veuillez refaire une demande.",
    );
  }
});
const settingStore = useSettingStore();
const { updateReminderStatus } = settingStore;
const { settings } = storeToRefs(settingStore);
const petStore = usePetStore();
const { pets } = storeToRefs(petStore);
const editingPetId = ref(null);
const editingProfile = ref(false);
const changeEmailError = ref(null);
const passwordChangeError = ref(null);
const loading = ref({});

const {
  public: { appVersion: version },
} = useRuntimeConfig();

const user = computed(() => session.value?.data?.user);

const profileForm = ref({
  email: user.value?.email || "",
  confirmEmail: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const resetEmailForm = () => {
  profileForm.value.email = user.value?.email || "";
  profileForm.value.confirmEmail = "";
  changeEmailError.value = null;
};

const resetPasswordForm = () => {
  profileForm.value.oldPassword = "";
  profileForm.value.newPassword = "";
  profileForm.value.confirmNewPassword = "";
  passwordChangeError.value = null;
};

const resetProfileForm = () => {
  resetEmailForm();
  resetPasswordForm();
};

const handleEditPet = (pet) => {
  if (!pet) {
    editingPetId.value = null;
    return;
  }
  editingPetId.value = pet.id;
  console.log("Editing pet:", editingPetId.value);
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
    toast.error(`Erreur lors de la mise à jour de l'email: ${error.message}`);
  } finally {
    loading.value.email = false;
  }
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
      `Erreur lors de la mise à jour du mot de passe: ${error.message}`,
    );
  } finally {
    loading.value.password = false;
  }
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Paramètres</h2>

    <Card class="mb-6">
      <template #title-section>
        <div class="flex items-center justify-between">
          <h3 class="font-bold">Mes animaux</h3>
          <Button
            class="flex items-center gap-2"
            @click="navigateTo('/ajouter-animal')"
          >
            <span>Ajouter un animal</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clip-rule="evenodd"
              />
            </svg>
          </Button>
        </div>
      </template>
      <template #content>
        <div v-for="pet in pets" :key="pet.id" class="mb-3">
          <PetCard
            :pet="pet"
            :is-editing="editingPetId === pet.id"
            :is-creator="user && user.id == pet.createdByUserId"
            @edit-pet="handleEditPet"
          />
        </div>
        <div
          v-if="!pets.length"
          class="h-24 w-full bg-gray-300 rounded-lg animate-pulse self-end"
        />
      </template>
    </Card>

    <Card>
      <template #title>
        <dev class="flex items-center justify-between">
          <span>Mon compte</span>
          <Button
            variant="link"
            size="sm"
            class="flex items-center gap-2"
            @click="
              editingProfile = !editingProfile;
              resetProfileForm();
            "
          >
            <span v-if="!editingProfile">Modifier mon compte</span>
            <span v-else>Arrêter de modifier</span>
          </Button>
        </dev>
      </template>
      <template #content>
        <div v-if="editingProfile" class="space-y-4 mb-4">
          <div class="p-4 border border-gray-200 rounded-lg">
            <form
              class="flex flex-col gap-2"
              @submit.prevent="handleChangeMail"
            >
              <div>
                <Label for="email" class="text-gray-600 text-sm mb-1"
                  >Email</Label
                >
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
                class="flex items-center justify-center gap-2 mt-2"
                :disabled="loading.email"
              >
                <Spinner v-if="loading.email" class="w-4 h-4" />
                <span>Modifier l'email</span>
              </Button>
            </form>
          </div>
          <div class="p-4 border border-gray-200 rounded-lg mb-4">
            <form
              class="flex flex-col gap-2"
              @submit.prevent="handleChangePassword"
            >
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
                <Label
                  for="confirmNewPassword"
                  class="text-gray-600 text-sm mb-1"
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
                class="flex items-center justify-center gap-2 mt-2"
                :disabled="loading.password"
              >
                <Spinner v-if="loading.password" class="w-4 h-4" />
                <span>Modifier le mot de passe</span>
              </Button>
            </form>
          </div>
        </div>
        <div v-else class="p-4 border border-gray-200 rounded-lg mb-4">
          <p class="text-gray-600 text-sm mb-1">Email</p>
          <p class="text-gray-900">{{ user?.email || "N/C" }}</p>
        </div>

        <div class="p-4 border border-gray-200 rounded-lg mb-4">
          <input
            id="reminders"
            v-model="settings.wantsRemindersMails"
            type="checkbox"
            class="mr-2"
            @change="updateReminderStatus(settings.wantsRemindersMails)"
          />
          <label for="reminders" class="text-gray-900"
            >Activer les rappels de médicaments par mails</label
          >
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            size="lg"
            class="flex items-center justify-center gap-2"
            @click="navigateTo('/feedback')"
          >
            <IconMessageSquare class="w-5 h-5" />
            Feedback
          </Button>

          <Button variant="destructive" size="lg" @click="signOut">
            <LogOutIcon class="w-5 h-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </template>
    </Card>

    <AboutSection :version="version" />
  </div>
</template>
