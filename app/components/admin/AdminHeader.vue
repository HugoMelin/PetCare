<script setup lang="ts">
import { SidebarTrigger } from "~/components/ui/sidebar";
import SettingsIcon from "../icons/SettingsIcon.vue";
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
    >
      <div class="flex min-w-0 items-center gap-3">
        <SidebarTrigger aria-label="Afficher ou réduire la navigation admin" />
        <NuxtLink to="/" class="flex items-center">
          <NuxtImg
            src="/images/PetCare_logo.png"
            alt="Logo PetCare"
            width="40"
            height="40"
            class="inline-block mr-3"
          />
          <h1 class="text-xl lg:text-3xl text-primary">PetCare</h1>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-2 sm:gap-4 flex-nowrap">
        <NuxtLink to="/parametres" class="text-primary">
          <SettingsIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
