<script setup>
import Button from "~/components/ui/button/Button.vue";
import Card from "~/components/ui/card/Card.vue";
import { authClient } from "~/lib/auth-client";
import PetCard from "~/components/parametres/PetCard.vue";
import AboutSection from "~/components/parametres/AboutSection.vue";
import AccountSection from "~/components/parametres/account/AccountSection.vue";
import { toast } from "vue-sonner";

const session = authClient.useSession();
const route = useRoute();

onMounted(() => {
  if (route.query.error) {
    toast.error(
      "La confirmation de l’adresse email a échoué. Le lien peut être expiré ou invalide. Veuillez refaire une demande.",
    );
  }
});
const petStore = usePetStore();
const { pets } = storeToRefs(petStore);
const editingPetId = ref(null);

const {
  public: { appVersion: version },
} = useRuntimeConfig();

const user = computed(() => session.value?.data?.user);

const handleEditPet = (pet) => {
  if (!pet) {
    editingPetId.value = null;
    return;
  }
  editingPetId.value = pet.id;
  console.log("Editing pet:", editingPetId.value);
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

    <AccountSection :user="user" />

    <AboutSection :version="version" />
  </div>
</template>
