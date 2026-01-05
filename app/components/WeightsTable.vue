<script setup>
import { ChevronLeft, ChevronRight } from "lucide-vue-next";
import Card from "~/components/ui/Card.vue";

import useFormatDate from "~/composables/useFormatDate";

const { formatDate } = useFormatDate();

const { weights } = defineProps({
  weights: {
    type: Array,
    required: true,
  },
});

const pageSizeOptions = [5, 10, 15, 20];
const pageSize = ref(5);
const currentPage = ref(1);

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(weights.length / pageSize.value));
});

const paginatedWeights = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return weights.slice(startIndex, startIndex + pageSize.value);
});

watch(pageSize, () => {
  currentPage.value = 1;
});

watch(
  () => weights.length,
  () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  },
);

const formatWeightDate = (date) => {
  return formatDate(date);
};
</script>

<template>
  <Card>
    <template #title> Historique des pesées </template>
    <template #content>
      <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-2 text-sm text-gray-600">
          <span class="text-gray-600 text-sm">Afficher</span>
          <select
            v-model.number="pageSize"
            class="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-sm"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          <span class="text-gray-600 text-sm">lignes</span>
        </div>
      </div>

      <!-- Mobile Table -->
      <div class="sm:hidden space-y-3">
        <div
          v-for="row in paginatedWeights"
          :key="row.id"
          class="border border-gray-200 rounded-lg p-4 space-y-2"
        >
          <div class="flex justify-between items-start">
            <span class="text-gray-600">Date</span>
            <span class="text-gray-900">{{ formatWeightDate(row.date) }}</span>
          </div>
          <div class="flex justify-between items-start">
            <span class="text-gray-600">Poids</span>
            <span class="text-gray-900">{{ row.weight }} kg</span>
          </div>
          <div v-if="row.comment" class="pt-2 border-t border-gray-100">
            <p class="text-gray-600 text-sm">{{ row.comment }}</p>
          </div>
        </div>
      </div>

      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr>
              <th class="text-left p-2 border-b">Date</th>
              <th class="text-left p-2 border-b">Poids</th>
              <th class="text-left p-2 border-b">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in paginatedWeights" :key="row.id">
              <td class="p-2 py-3 border-b col-4">
                {{ formatWeightDate(row.date) }}
              </td>
              <td class="p-2 py-3 border-b col-4">{{ row.weight }} kg</td>
              <td class="p-2 py-3 border-b col-4">
                {{ row.comment ? row.comment : "-" }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex items-center justify-between mt-6 pt-4">
        <p class="text-sm text-gray-600">
          Page {{ currentPage }} sur {{ totalPages }}
        </p>

        <div class="flex gap-2">
          <button
            type="button"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="currentPage === 1"
            @click="currentPage -= 1"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>
          <button
            type="button"
            class="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            :disabled="currentPage === totalPages"
            @click="currentPage += 1"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>
      </div>
    </template>
  </Card>
</template>
