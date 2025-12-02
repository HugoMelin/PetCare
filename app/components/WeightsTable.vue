<script setup>
import Card from '~/components/ui/Card.vue';

import useFormatDate from '~/composables/useFormatDate';

const { formatDate } = useFormatDate();

const { weights } = defineProps({
  weights: {
    type: Array,
    required: true,
  },
});

const formatWeightDate = (date) => {
  return formatDate(date);
};
</script>

<template>
  <Card>
    <template #title>
      Historique des poids
    </template>
    <template #content>
      <!-- Mobile Table -->
      <div class="sm:hidden space-y-3">
        <div
          v-for="row in weights"
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
          <div 
            v-if="row.comment"  
            class="pt-2 border-t border-gray-100"
          >
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
            <tr v-for="row in weights" :key="row.id">
              <td class="p-2 py-3 border-b col-4">{{ formatWeightDate(row.date) }}</td>
              <td class="p-2 py-3 border-b col-4">{{ row.weight }} kg</td>
              <td class="p-2 py-3 border-b col-4">{{ row.comment ? row.comment : '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </Card>
</template>