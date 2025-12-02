<script setup>
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';

import useWeights from '~/composables/useWeights';
import useFormatDate from '~/composables/useFormatDate';

const { fetchWeights, addWeight } = useWeights();
const { dayNumberMonth } = useFormatDate();

const lastWeight = ref(null);
const weights = ref([]);

const form = reactive({
  weight: '',
});

const handleSubmit = async () => {
  // Here you would normally call an API to add the weight
  console.log('Adding weight:', form.weight);
  await addWeight({ weight: form.weight });
  form.weight = '';
  // Refresh last weight
  const res = await fetchWeights(1);
  if (res && res.length > 0) {
    weights.value = res;
    lastWeight.value = res[0];
  }
};

onMounted(async () => {
  const res = await fetchWeights(1);
  if (res && res.length > 0) {
    weights.value = res;
    lastWeight.value = res[0];
  }
  console.log('Last weight:', lastWeight.value);
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Bienvenue sur PetCare</h2>
  
    <Card>
      <template #title>
        Poids
      </template>
      <template #content>
        <div class="grid grid-cols-4">
          <div class="col-span-1 text-left flex flex-col justify-end">
            <p v-if="lastWeight" class="text-sm"><span class="font-bold text-3xl sm:text-6xl">{{ lastWeight.weight }}</span> kg</p>
            <div v-else class="h-10 sm:h-16 w-16 bg-gray-300 rounded animate-pulse" />
          </div>
          <div class="col-span-3 text-right flex flex-col justify-start">
            <p v-if="lastWeight" class="capitalize">{{ dayNumberMonth(lastWeight.date) }}</p>
            <div v-else class="h-6 w-24 bg-gray-300 rounded animate-pulse self-end" />

            <WeightsLineChart v-if="weights.length" :weights="weights" class="h-[100px] sm:h-[256px]" />
            <div v-else class="h-[100px] sm:h-[256px] bg-gray-200 rounded animate-pulse mt-2" />
          </div>
        </div>
      </template>
    </Card>

    <Card>
      <template #title>
        Ajout rapide de poids
      </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="weight" class="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
            <input
              id="weight"
              v-model.number="form.weight"
              type="number"
              step="0.01"
              min="0"
              inputmode="decimal"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Entrez le poids"
            />
          </div>
          <Button type="submit" variant="default">Ajouter</Button>
        </form>
      </template>
    </Card>
  </div>
</template>