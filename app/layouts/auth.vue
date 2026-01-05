<script setup>
import { fetchUserSession } from "~/lib/auth-client";

onMounted(async () => {
  const session = await fetchUserSession();
  if (session.data) {
    navigateTo("/");
  }
});
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8"
  >
    <main class="w-full max-w-md">
      <slot />
    </main>
  </div>
</template>
