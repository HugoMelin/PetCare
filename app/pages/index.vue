<script setup>
import Card from "~/components/ui/Card.vue";
import Button from "~/components/ui/Button.vue";

import useWeights from "~/composables/useWeights";
import useFormatDate from "~/composables/useFormatDate";
import useMedications from "~/composables/useMedications";
const store = usePetStore();

const { fetchWeights, addWeight } = useWeights();
const { dayNumberMonth } = useFormatDate();
const { isLate } = useMedications();

const { selectedPet } = storeToRefs(store);
const { medications } = storeToRefs(useMedicationStore());
const weightStore = useWeightStore();
const { weights } = storeToRefs(weightStore);

const lastWeight = ref(null);

const nextMedication = computed(() => {
  if (!medications.value || medications.value.length === 0) return null;

  return medications.value.reduce((closest, medication) => {
    if (!closest) return medication;
    if (!medication?.nextDoseDate) return closest;
    if (!closest?.nextDoseDate) return medication;

    return new Date(medication.nextDoseDate) < new Date(closest.nextDoseDate)
      ? medication
      : closest;
  }, null);
});

const filteredWeights = computed(() => {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const limit = threeMonthsAgo.getTime();

  return weights.value.filter((w) => new Date(w.date).getTime() >= limit);
});

const form = reactive({
  weight: "",
});

const handleSubmit = async () => {
  console.log("Adding weight:", form.weight);
  await addWeight(selectedPet.value.id, {
    weight: form.weight,
    date: new Date().toISOString(),
  });
  form.weight = "";
  // Refresh last weight
  const res = await fetchWeights(selectedPet.value.id);
  if (res && res.length > 0) {
    weights.value = res;
    lastWeight.value = res[0];
  }
};

watch(selectedPet, async (newPet) => {
  if (newPet) {
    const res = await fetchWeights(newPet.id);
    if (res) {
      weights.value = res;
      lastWeight.value = res[0];
    }
    console.log("Last weight:", lastWeight.value);
  }
});

onMounted(async () => {
  if (!selectedPet.value) return;
  const res = await fetchWeights(selectedPet.value.id);
  if (res && res.length > 0) {
    weights.value = res;
    lastWeight.value = res[0];
  }
  console.log("Last weight:", lastWeight.value);
});
</script>

<template>
  <div class="grid grid-cols-12 gap-4">
    <h2 class="text-2xl font-bold mb-4 col-span-12">Bienvenue sur PetCare</h2>

    <Card class="col-span-12 sm:col-span-8">
      <template #title> Poids (3 derniers mois) </template>
      <template #content>
        <div class="grid grid-cols-4">
          <div class="col-span-1 text-left flex flex-col justify-end">
            <p v-if="lastWeight" class="text-sm">
              <span class="font-bold text-3xl sm:text-6xl">{{
                lastWeight.weight
              }}</span>
              kg
            </p>
            <div
              v-else
              class="h-10 sm:h-16 w-16 bg-gray-300 rounded animate-pulse"
            />
          </div>
          <div class="col-span-3 text-right flex flex-col justify-start">
            <p v-if="lastWeight" class="capitalize">
              {{ dayNumberMonth(lastWeight.date) }}
            </p>
            <div
              v-else
              class="h-6 w-24 bg-gray-300 rounded animate-pulse self-end"
            />

            <WeightsLineChart
              v-if="filteredWeights.length"
              :weights="filteredWeights"
              class="h-[100px] sm:h-[256px]"
            />
            <div
              v-else
              class="h-[100px] sm:h-[256px] bg-gray-200 rounded animate-pulse mt-2"
            />
          </div>
        </div>
      </template>
    </Card>

    <Card
      class="col-span-12 sm:col-span-4 flex-col justify-center flex row-start-4 sm:row-start-2 sm:col-start-9"
    >
      <template #title> Ajout rapide de poids </template>
      <template #content>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
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
          <Button type="submit" variant="default">Ajouter</Button>
        </form>
      </template>
    </Card>

    <Card class="col-span-12">
      <template #title>
        <div class="flex justify-between items-center w-full">
          <span>Médicament</span>
          <span
            :class="[
              'text-sm font-semibold p-1 px-3 rounded-xl',
              isLate(nextMedication?.nextDoseDate)
                ? 'text-red-600 bg-red-100'
                : 'text-green-600 bg-green-100',
            ]"
          >
            {{ isLate(nextMedication?.nextDoseDate) ? "En retard" : "À jour" }}
          </span>
        </div>
      </template>
      <template #content>
        <p class="text-gray-500">
          Dernier médicament :
          {{
            nextMedication?.lastDoseDate
              ? dayNumberMonth(nextMedication.lastDoseDate)
              : "N/C"
          }}
          ({{ nextMedication?.medication ?? "N/C" }})
        </p>
        <p class="text-gray-500">
          Prochain médicament :
          {{
            nextMedication?.nextDoseDate
              ? dayNumberMonth(nextMedication.nextDoseDate)
              : "N/C"
          }}
        </p>
        <Button variant="link">
          <NuxtLink to="/medicaments"> Gérer les médicaments > </NuxtLink>
        </Button>
      </template>
    </Card>
  </div>
</template>
