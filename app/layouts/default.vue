<script setup>
import { fetchUserSession } from '~/lib/auth-client';

onMounted(async () => {
  const session = await fetchUserSession();
  if (!session.data) {
    navigateTo('/connexion');
  }
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