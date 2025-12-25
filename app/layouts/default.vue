<script setup>
import { fetchUserSession } from '~/lib/auth-client';

const route = useRoute();
const { pets, petsLoaded } = storeToRefs(usePetStore());
const authChecked = ref(false);
const isAuthenticated = ref(false);

const redirectToAddPetIfNeeded = () => {
  if (route.path === '/parametres' || route.path === '/ajouter-animal') {
    return;
  }

  if (!authChecked.value || !isAuthenticated.value) {
    return;
  }

  if (!petsLoaded.value) {
    return;
  }

  if (pets.value.length === 0) {
    navigateTo('/ajouter-animal');
  }
};

watch(() => [route.fullPath, pets.value.length, petsLoaded.value], () => {
  redirectToAddPetIfNeeded();
});

onMounted(async () => {
  const session = await fetchUserSession();

  authChecked.value = true;
  isAuthenticated.value = Boolean(session.data);

  if (!isAuthenticated.value) {
    navigateTo('/connexion');
    return;
  }

  redirectToAddPetIfNeeded();
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader />
    <main class="max-w-6xl mx-auto px-4 sm:px-6 lg:ml-20 lg:px-8 py-6 pb-24 lg:pb-6 xl:mx-auto">
      <slot />
    </main>
    <AppNavigation />
  </div>
</template>
