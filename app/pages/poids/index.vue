<script setup>
import Button from "~/components/ui/Button.vue";
import Card from "~/components/ui/Card.vue";
import WeightsTable from "~/components/poids/WeightsTable.vue";
import useWeights from "~/composables/useWeights";
import useFormatDate from "~/composables/useFormatDate";

const { formatForDatetimeLocal } = useFormatDate();

const { addWeight, fetchWeights } = useWeights();
const { selectedPet } = storeToRefs(usePetStore());

const weightStore = useWeightStore();
const { weights } = storeToRefs(weightStore);

const period = ref("all");
const selectedWeight = ref(null);
const isEditingWeight = ref(null);

const filtres = [
  { label: "3M", value: "3m" },
  { label: "6M", value: "6m" },
  { label: "1A", value: "1y" },
  { label: "Tout", value: "all" },
];

const filteredWeights = computed(() => {
  const now = new Date();
  let limitDate;

  switch (period.value) {
    case "3m":
      limitDate = new Date();
      limitDate.setMonth(now.getMonth() - 3);
      break;
    case "6m":
      limitDate = new Date();
      limitDate.setMonth(now.getMonth() - 6);
      break;
    case "1y":
      limitDate = new Date();
      limitDate.setFullYear(now.getFullYear() - 1);
      break;
    case "all":
    default:
      return weights.value;
  }

  return weights.value.filter((w) => new Date(w.date) >= limitDate);
});

const form = ref({
  weight: "",
  date: formatForDatetimeLocal(new Date()),
  comment: "",
});

const submitForm = async () => {
  await addWeight(selectedPet.value.id, {
    weight: form.value.weight,
    date: new Date(form.value.date).toISOString(),
    comment: form.value.comment,
  });
  form.value = {
    weight: "",
    date: formatForDatetimeLocal(new Date()),
    comment: "",
  };

  weights.value = await fetchWeights(selectedPet.value.id);
};
</script>

<template>
  <div v-if="!isEditingWeight && !selectedWeight">
    <h2 class="text-2xl font-bold mb-4">Suivis du poids</h2>

    <Card>
      <template #title-section>
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4"
        >
          <h3 class="font-bold">Évolution du poids</h3>
          <div class="flex items-center gap-2">
            <button
              v-for="(item, idx) in filtres"
              :key="idx"
              :class="[
                'px-3 py-1.5 rounded-lg transition-colors text-sm',
                period === item.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700',
              ]"
              @click="period = item.value"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </template>
      <template #content>
        <WeightsLineChart
          v-if="filteredWeights.length"
          :weights="filteredWeights"
          class="h-[150px] sm:h-[304px]"
        />
        <div
          v-else
          class="h-[150px] sm:h-[304px] bg-gray-200 rounded animate-pulse mt-2"
        />
      </template>
    </Card>

    <Card>
      <template #title> Ajouter un poids </template>
      <template #content>
        <form
          action=""
          class="grid grid-cols-2 gap-4"
          @submit.prevent="submitForm"
        >
          <div class="mb-4 col-span-2 sm:col-span-1">
            <label
              for="weight"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Poids (kg)</label
            >
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
            <label
              for="date"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Date</label
            >
            <input
              v-model="form.date"
              type="datetime-local"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            />
          </div>

          <div class="mb-4 col-span-2">
            <label
              for="comment"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Commentaire</label
            >
            <textarea
              id="comment"
              v-model="form.comment"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows="3"
              placeholder="Ajouter un commentaire (optionnel)"
            />
          </div>

          <div>
            <Button variant="default" size="lg" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </template>
    </Card>

    <WeightsTable v-if="weights?.length" :weights="weights" />
    <Card v-else class="space-y-3">
      <template #title>
        <div class="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      </template>
      <template #content>
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
        <div class="h-6 bg-gray-200 rounded animate-pulse" />
      </template>
    </Card>
  </div>
</template>
