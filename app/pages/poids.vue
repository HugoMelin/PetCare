<script setup>
import Button from '~/components/ui/Button.vue';
import Card from '~/components/ui/Card.vue';

import useWeights from '~/composables/useWeights';

const { addWeight, fetchWeights } = useWeights();

const weights = ref([]);

onMounted(async () => {
  weights.value = await fetchWeights();
});

const form = ref({
  weight: '',
  date: new Date().toISOString().substr(0, 16),
  comment : '',
});

const submitForm = async () => {
  await addWeight({
    weight: form.value.weight,
    date: form.value.date,
    comment: form.value.comment,
  });
  form.value = {
    weight: '',
    date: new Date().toISOString().substr(0, 16),
    comment : '',
  };

  weights.value = await fetchWeights();
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Suivis du poids</h2>

    <Card>
      <template #title>
        Ajouter un poids
      </template>
      <template #content>
        <form action="" class="grid grid-cols-2 gap-4" @submit.prevent="submitForm">
        <div class="mb-4 col-span-2 sm:col-span-1">
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

        <div class="mb-4 col-span-2 sm:col-span-1">
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            v-model="form.date"
            type="datetime-local"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div class="mb-4 col-span-2">
          <label for="comment" class="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
          <textarea
            id="comment"
            v-model="form.comment"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows="3"
            placeholder="Ajouter un commentaire (optionnel)"
          ></textarea>
        </div>

        <div>
          <Button
            variant="default"
            size="lg"
            type="submit"
          >
            Enregistrer
          </Button>
        </div>
      </form>
      </template>
    </Card>

    <WeightsTable :weights="weights" />
  </div>
</template>