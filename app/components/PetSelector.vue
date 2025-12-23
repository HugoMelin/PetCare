<script setup>
import { ChevronDown, Plus } from 'lucide-vue-next';

const isOpen = ref(false);

const petStore = usePetStore();
const { pets, selectedPet } = storeToRefs(petStore);
const dropdownRef = ref(null);

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-w-[140px] sm:min-w-[180px] max-h-[60px]"
      @click="isOpen = !isOpen">
      <div class="flex-1 text-left overflow-hidden">
        <p v-if="selectedPet" class="text-sm sm:text-base text-gray-900 truncate">{{ selectedPet?.name }}</p>
        <div v-else class="h-5 bg-gray-200 rounded animate-pulse w-1/2 sm:mb-1" />
        <p v-if="selectedPet" class="text-xs text-gray-500 truncate hidden sm:block">{{ selectedPet?.breed }}</p>
        <div v-else class="hidden sm:block h-5 bg-gray-200 rounded animate-pulse w-3/4" />
      </div>
      <ChevronDown :class="`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`" />
    </button>

    <div v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
      <div class="max-h-64 overflow-y-auto">
        <button v-for="petItem in pets" :key="petItem.id"
          class="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center justify-between relative"
          :class="selectedPet.id === petItem.id ? 'bg-[#269394]/5' : ''" @click="
            selectedPet = petItem;
          isOpen = false;
          ">
          <div class="flex flex-col">
            <span class="font-medium text-gray-900">{{ petItem.name }}</span>
            <span class="text-xs text-gray-500">{{ petItem.breed }}</span>
          </div>
          <div v-if="selectedPet.id === petItem.id" class="w-3 h-3 rounded-full bg-primary" />
        </button>

        <div>
          <div class="border-t border-gray-200" />
          <NuxtLink to="/ajouter-animal"
            class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-primary">
            <div
              class="w-6 h-5 sm:w-8 sm:h-8 rounded-full border-2 border-dashed border-primary flex items-center justify-center">
              <Plus class="w-3 h-3 sm:w-4 sm:h-4" />
            </div>
            <span class="text-sm">Ajouter un animal</span>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>