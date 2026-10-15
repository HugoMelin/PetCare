<script setup lang="ts">
import AdminHeader from "~/components/admin/AdminHeader.vue";
import AdminNavigation from "~/components/admin/AdminNavigation.vue";
import { SidebarProvider } from "~/components/ui/sidebar";

const sidebarOpen = useCookie<boolean>("sidebar_state", {
  default: () => true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
});
</script>

<template>
  <SidebarProvider v-model:open="sidebarOpen" class="bg-gray-50">
    <AdminNavigation />
    <div class="flex min-w-0 flex-1 flex-col">
      <AdminHeader />
      <main class="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <slot />
      </main>
    </div>
  </SidebarProvider>
</template>
