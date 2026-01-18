<script setup>
import { fetchUserSession } from "~/lib/auth-client";

const authChecked = ref(false);

onMounted(async () => {
  const session = await fetchUserSession();
  const ok = session && session.data;

  if (ok) {
    navigateTo("/");
  }

  authChecked.value = !ok;
});
</script>

<template>
  <div
    v-if="authChecked"
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8"
  >
    <main class="w-full max-w-md">
      <slot />
    </main>
  </div>
  <div v-else class="min-h-screen bg-gray-50" />
</template>
