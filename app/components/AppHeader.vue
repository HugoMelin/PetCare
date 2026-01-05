<script setup>
import SettingsIcon from "./icons/SettingsIcon.vue";
const route = useRoute();

const dontShowPetSelectorOn = ["/ajouter-animal", "/parametres", "/feedback"];

const isHighlightedRoute = (path) =>
  ["/ajouter-animal", "/parametres", "/feedback"].includes(path);

const showPetSelector = computed(
  () => !dontShowPetSelectorOn.includes(route.path),
);
</script>

<template>
  <header class="bg-white border-b border-gray-200 sticky top-0 z-10">
    <div
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center"
    >
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

      <div class="flex items-center gap-2 sm:gap-4 flex-nowrap">
        <PetSelector v-if="showPetSelector" />
        <NuxtLink
          to="/parametres"
          :class="`text-gray-600 hover:text-primary ${isHighlightedRoute(route.path) ? 'text-primary' : ''}`"
        >
          <SettingsIcon class="w-6 h-6" />
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
