<script setup>
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';

import useMedications from '~/composables/useMedications';

const { fetchActualMedication, updateMedication, isLate } = useMedications();
const { selectedPet } = storeToRefs(usePetStore());

const actualMedication = ref(null);

const form = ref({
  medication: '',
  lastDoseDate: new Date().toISOString().slice(0, 10),
  frequencyDays: 90,
});

const updateForm = () => {
  form.value.medication = actualMedication.value?.medication || '';
  form.value.lastDoseDate = actualMedication.value?.lastDoseDate
    ? new Date(actualMedication.value.lastDoseDate).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  form.value.frequencyDays = actualMedication.value?.frequencyDays || 90;
};

/* const isLate = computed(() => {
  const nextDoseDate = actualMedication.value?.nextDoseDate;
  if (!nextDoseDate) return false;

  const nextMedicationDate = new Date(nextDoseDate);
  const today = new Date();

  nextMedicationDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return nextMedicationDate < today;
}); */

const markAsDone = async () => {
  console.log("Marqué comme fait aujourd'hui !");

  const payload = {
    petId: selectedPet.value.id,
    entryId: actualMedication.value.id,
    medication: actualMedication.value.medication,
    frequencyDays: actualMedication.value.frequencyDays,
  };

  try {
    const res = await updateMedication(payload);
    actualMedication.value = res;
    updateForm();
  } catch (error) {
    console.error("Erreur lors de la mise à jour du médicament :", error);
    throw error;
  }
};

const updateSettings = async () => {
  const payload = {
    petId: selectedPet.value.id,
    entryId: actualMedication?.value?.id ?? null,
    medication: form.value.medication,
    lastDoseDate: form.value.lastDoseDate,
    frequencyDays: form.value.frequencyDays,
  };

  try {
    const res = await updateMedication(payload);
    actualMedication.value = res;
    updateForm();
  } catch (error) {
    console.error("Erreur lors de la mise à jour des paramètres du médicament :", error);
    throw error;
  }
};

watch(selectedPet, async (newPet) => {
  if (newPet) {
    actualMedication.value = await fetchActualMedication(newPet.id);
    updateForm();
  }
});

onMounted(async () => {
  if (!selectedPet.value) return;
  actualMedication.value = await fetchActualMedication(selectedPet.value.id);
  updateForm();
});
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-4">Médicaments</h2>

    <Card>
      <template v-if="actualMedication" #content>
        <div class="flex justify-between items-center border-b pb-2 mb-4 border-gray-100">
          <p class="text-lg font-medium">État actuel</p>
          <p class="text-sm font-semibold p-1 px-3 rounded-xl"
            :class="isLate(actualMedication?.nextDoseDate) ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'">
            {{ isLate(actualMedication?.nextDoseDate) ? "En retard" : "À jour" }}</p>
        </div>

        <div class="flex justify-between items-center border-b pb-2 mb-4 border-gray-100">
          <p class="text-gray-500">Nom</p>
          <p>{{ actualMedication?.medication || '—' }}</p>
        </div>

        <div class="flex justify-between items-center border-b pb-2 mb-4 border-gray-100">
          <p class="text-gray-500">Date de la dernière dose</p>
          <p>{{ actualMedication?.lastDoseDate ? new Date(actualMedication.lastDoseDate).toLocaleDateString() : '—' }}
          </p>
        </div>

        <div class="flex justify-between items-center border-b pb-2 mb-4 border-gray-100">
          <p class="text-gray-500">Date de la prochaine dose</p>
          <p>{{ actualMedication?.nextDoseDate ? new Date(actualMedication.nextDoseDate).toLocaleDateString() : '—' }}
          </p>
        </div>

        <Button variant="default" class="w-full" size="lg" @click="markAsDone">Marquer comme fait aujourd'hui</Button>

      </template>
      <template v-else #content>
        <div class="h-7 bg-gray-200 rounded animate-pulse w-full mb-5" />
        <div class="h-7 bg-gray-200 rounded animate-pulse w-full mb-5" />
        <div class="h-7 bg-gray-200 rounded animate-pulse w-full mb-5" />
        <div class="h-7 bg-gray-200 rounded animate-pulse w-full mb-5" />
        <div class="h-8 bg-gray-200 rounded animate-pulse w-full" />
      </template>
    </Card>

    <Card>
      <template #title>
        Configuration
      </template>

      <template #content>
        <form v-if="form" @submit.prevent="updateSettings">
          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="medication">Médicament</label>
            <input v-model="form.medication" id="medication" type="text" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="lastDoseDate">Date de la dernière dose</label>
            <input v-model="form.lastDoseDate" id="lastDoseDate" type="date" class="w-full px-3 py-2 border rounded" />
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 mb-2" for="frequencyDays">Fréquence (jours)</label>
            <input v-model.number="form.frequencyDays" id="frequencyDays" type="number"
              class="w-full px-3 py-2 border rounded" />
          </div>

          <Button variant="default" class="w-full" size="lg" type="submit">Enregistrer les modifications</Button>
        </form>

        <div v-else>
          <div class="h-9 bg-gray-200 rounded animate-pulse w-full mb-5" />
          <div class="h-9 bg-gray-200 rounded animate-pulse w-full mb-5" />
          <div class="h-9 bg-gray-200 rounded animate-pulse w-full mb-5" />
          <div class="h-8 bg-gray-200 rounded animate-pulse w-full" />
        </div>
      </template>

    </Card>
  </div>
</template>
