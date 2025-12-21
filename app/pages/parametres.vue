<script setup>
import Button from '~/components/ui/Button.vue';
import LogOutIcon from '~/components/icons/LogOutIcon.vue';
import Card from '~/components/ui/Card.vue';
import { signOut, authClient } from '~/lib/auth-client';
import DogCard from '~/components/DogCard.vue';

const session = authClient.useSession();
const dogStore = useDogStore();
const { dogs } = storeToRefs(dogStore);
const editingDogId = ref(null);

const user = computed(() => session.value?.data?.user);

const handleEditDog = (dog) => {
  if (!dog) {
    editingDogId.value = null;
    return;
  }
  editingDogId.value = dog.id;
  console.log("Editing dog:", editingDogId.value);
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Paramètres</h2>

    <Card class="mb-6">
      <template #title-section>
        <div class="flex items-center justify-between">
          <h3 class="font-bold">Mes chiens</h3>
          <Button>
            <NuxtLink to="/ajouter-chien" class="flex items-center gap-2">
              <span>Ajouter un chien</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </NuxtLink>
          </Button>
        </div>
      </template>
      <template #content>
        <div v-for="dog in dogs" :key="dog.id" class="mb-3">
          <DogCard 
            :dog="dog" 
            :is-editing="editingDogId === dog.id" 
            :is-creator="user && user.id == dog.createdByUserId"
            @edit-dog="handleEditDog"
          />
        </div>
        <div v-if="!dogs.length" class="h-24 w-full bg-gray-300 rounded-lg animate-pulse self-end" />
      </template>
    </Card>

    <Card>
      <template #title>
        Mon compte
      </template>
      <template #content>
        <div class="p-4 border border-gray-200 rounded-lg mb-4">
          <p class="text-gray-600 text-sm mb-1">Email</p>
          <p class="text-gray-900">{{ user?.email || 'N/C' }}</p>
        </div>

        <Button variant="destructive" size="lg" @click="signOut">
          <LogOutIcon class="w-5 h-5 mr-2" />
          Déconnexion
        </Button>
      </template>
    </Card>
  </div>
</template>