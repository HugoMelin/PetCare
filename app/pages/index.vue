<script setup>
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';

import useWeights from '~/composables/useWeights';
import useFormatDate from '~/composables/useFormatDate';

const { fetchWeights, addWeight } = useWeights();
const { formatDate } = useFormatDate();

const lastWeight = ref(null);

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
    lastWeight.value = res[0];
  }
};

onMounted(async () => {
  const res = await fetchWeights(1);
  if (res && res.length > 0) {
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
        Évolution du poids
      </template>
      <template #content>
        <p v-if="lastWeight">Dernier poids : {{ lastWeight.weight + ' kg' }} - {{ formatDate(lastWeight.date) }}</p>
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