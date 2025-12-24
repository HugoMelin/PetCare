<script setup>
import Card from '~/components/ui/Card.vue';
import Button from '~/components/ui/Button.vue';
import { Plus, X, Save, ChevronUp, Pencil, Trash2 } from 'lucide-vue-next';

import useMedications from '~/composables/useMedications';

const { updateMedication, isLate } = useMedications();
const { selectedPet } = storeToRefs(usePetStore());

const markAsDone = async (medication) => {
  console.log("Marqué comme fait aujourd'hui !");

  const payload = {
    petId: selectedPet.value.id,
    entryId: medication.id,
    medication: medication.medication,
    frequencyDays: medication.frequencyDays,
  };

  try {
    const res = await updateMedication(payload);

    const index = medications.value.findIndex(med => med.id === res.id);
    if (index !== -1) {
      medications.value[index] = res;
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du médicament :", error);
    throw error;
  }
};

// --------------------------------
const medicationStore = useMedicationStore();
const { medications } = storeToRefs(medicationStore);

const isAddingNew = ref(false);
const expandedMedication = ref(null);
const editingId = ref(null);

const toggleExpanded = (medicationId) => {
  if (expandedMedication.value === medicationId) {
    expandedMedication.value = null;
  } else {
    expandedMedication.value = medicationId;
  }
};

const newForm = ref({
  medication: '',
  lastDoseDate: new Date().toISOString().slice(0, 10),
  frequencyDays: 90,
});

const handleDelete = async (medicationId) => {
  if(confirm("Êtes-vous sûr de vouloir supprimer ce médicament ?")) {
    await medicationStore.deleteMedication(medicationId);
    if (expandedMedication.value === medicationId) {
      expandedMedication.value = null;
    }
  }
};

const handleUpdate = async (medication) => {
  try {
    await medicationStore.updateMedication({
      petId: selectedPet.value.id,
      entryId: medication.id,
      medication: medication.medication.trim(),
      lastDoseDate: medication.lastDoseDate,
      frequencyDays: medication.frequencyDays,
    });
    editingId.value = null;
    console.log("Médicament mis à jour avec succès : ", medication);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du médicament :", error);
  }
};

const handleNewMedication = async () => {
  try {
    const payload = {
      petId: selectedPet.value.id,
      medication: newForm.value.medication.trim(),
      lastDoseDate: newForm.value.lastDoseDate,
      frequencyDays: newForm.value.frequencyDays,
    };
    const res = await updateMedication(payload);
    console.log("Nouveau médicament ajouté avec succès : ", res);
    // Reset form
    newForm.value.medication = '';
    newForm.value.lastDoseDate = new Date().toISOString().slice(0, 10);
    newForm.value.frequencyDays = 90;
    isAddingNew.value = false;

    medications.value.push(res);
  } catch (error) {
    console.error("Erreur lors de l'ajout du médicament :", error);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-2xl font-bold ">Médicaments</h2>

      <Button size="lg" @click="isAddingNew = true">
        <Plus class="w-4 h-4" />
        <span class="hidden sm:inline ml-2">Ajouter un médicament</span>
      </Button>
    </div>

    <Card v-if="isAddingNew">
      <template #title>Nouveau médicament</template>
      <template #content>
        <form class="space-y-4" @submit.prevent="handleNewMedication">
          <div>
            <label class="block text-gray-700 mb-2 text-sm">
              Nom du médicament <span class="text-red-600">*</span>
            </label>
            <input v-model="newForm.medication" type="text"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow"
              placeholder="Nom du médicament" />
          </div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 mb-2 text-sm">
                Dernière prise <span class="text-red-600">*</span>
              </label>
              <input v-model="newForm.lastDoseDate" type="date"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow" />
            </div>
            <div>
              <label class="block text-gray-700 mb-2 text-sm">
                Fréquence <span class="text-red-600">*</span>
              </label>
              <select v-model="newForm.frequencyDays"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow">
                <option value=7>7 jours</option>
                <option value=14>14 jours</option>
                <option value=30>30 jours</option>
                <option value=60>60 jours</option>
                <option value=90>90 jours</option>
                <option value=180>180 jours</option>
                <option value=365>365 jours</option>
              </select>
            </div>
          </div>
          <div class="flex gap-2 pt-2">
            <Button type="submit" size="lg" class="flex items-center gap-2 w-2/4 lg:w-auto">
              <Save class="w-4 h-4" />
              Ajouter
            </Button>
            <Button variant="outline" size="lg" @click="isAddingNew = false"
              class="flex items-center gap-2 w-2/4 lg:w-auto">
              <X class="w-4 h-4" />
              Annuler
            </Button>
          </div>
        </form>
      </template>
    </Card>

    <div class="space-y-4">
      <Card v-for="medication in medications" :key="medication.id">
        <template #content>
          <button class="w-full flex items-center justify-between gap-4 text-left"
            @click="toggleExpanded(medication.id)">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="truncate">{{ medication.medication }}</h3>
                <span :class="[
                  'text-sm font-semibold p-1 px-3 rounded-xl',
                  isLate(medication?.nextDoseDate) ? 'text-red-600 bg-red-100' : 'text-green-600 bg-green-100'
                ]">
                  {{ isLate(medication?.nextDoseDate) ? "En retard" : "À jour" }}
                </span>
              </div>
              <p class="text-sm text-gray-600">
                Prochaine dose : {{ new Date(medication?.nextDoseDate).toLocaleDateString('fr-FR') }}
              </p>
            </div>
            <ChevronUp class="w-5 h-5 text-gray-500 transition-transform"
              :class="{ 'rotate-180': expandedMedication !== medication.id }" />
          </button>

          <div v-if="expandedMedication === medication.id" class="mt-6 pt-6 border-t border-gray-200">
            <form v-if="editingId === medication.id" class="space-y-4" @submit.prevent="handleUpdate(medication)">
              <div>
                <label class="block text-gray-700 mb-2 text-sm">
                  Nom du médicament <span class="text-red-600">*</span>
                </label>
                <input type="text" v-model="medication.medication"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow"
                  placeholder="Milbemax" />
              </div>

              <div class="grid sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-700 mb-2 text-sm">
                    Dernière prise <span class="text-red-600">*</span>
                  </label>
                  <input
                    :value="medication?.lastDoseDate ? new Date(medication.lastDoseDate).toISOString().slice(0, 10) : ''"
                    type="date"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow"
                    @input="medication.lastDoseDate = $event.target.value" />
                </div>
                <div>
                  <label class="block text-gray-700 mb-2 text-sm">
                    Fréquence <span class="text-red-600">*</span>
                  </label>
                  <select v-model="medication.frequencyDays"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA8E0] focus:border-transparent outline-none transition-shadow">
                    <option value=7>7 jours</option>
                    <option value=14>14 jours</option>
                    <option value=30>30 jours</option>
                    <option value=60>60 jours</option>
                    <option value=90>90 jours</option>
                    <option value=180>180 jours</option>
                    <option value=365>365 jours</option>
                  </select>
                </div>
              </div>

              <div class="flex gap-2 pt-2">
                <Button type="submit" size="lg" class="flex items-center gap-2 w-2/4 lg:w-auto">
                  <Save class="w-4 h-4" />
                  Enregistrer
                </Button>
                <Button type="button" variant="outline" size="lg" class="flex items-center gap-2 w-2/4 lg:w-auto"
                  @click="editingId = null">
                  <X class="w-4 h-4" />
                  Annuler
                </Button>
              </div>
            </form>

            <div v-else class="text-center">
              <div class="space-y-4">
                <div class="space-y-3 text-gray-700">
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Dernière prise :</span>
                    <span>{{new Date(medication.lastDoseDate).toLocaleDateString('fr-FR')}}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Prochaine dose :</span>
                    <span>{{new Date(medication.nextDoseDate).toLocaleDateString('fr-FR')}}</span>
                  </div>
                  <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <span class="text-gray-600">Fréquence :</span>
                    <span>{{medication.frequencyDays}} jours</span>
                  </div>
                </div>
              </div>

              <div class="flex gap-2 pt-2 justify-between sm:justify-start">
                <Button
                  @click="markAsDone(medication)"
                  class="flex items-center gap-2 w-full sm:w-auto"
                >
                  Fait aujourd'hui
                </Button>
                <Button
                  variant="outline"
                  @click="editingId = medication.id"
                  class="flex items-center gap-2 w-full sm:w-auto"
                >
                  <Pencil class="w-4 h-4" />
                  Modifier
                </Button>
                <Button
                  variant="destructive"
                  @click="handleDelete(medication.id)"
                  class="flex items-center gap-2 w-auto"
                >
                  <Trash2 class="w-4 h-4" />
                  <span class="hidden sm:inline">Supprimer</span>
                </Button>
              </div>
            </div>
          </div>
        </template>
      </Card>

      <Card v-if="medications.length === 0 && !isAddingNew">
        <template #content>
          <p class="text-gray-600">Aucun médicament enregistré pour le moment.</p>
          <Button size="lg" @click="isAddingNew = true" class="mt-4 flex items-center gap-2 w-full sm:w-auto">
            <Plus class="w-4 h-4" />
            <span>Ajouter un médicament</span>
          </Button>
        </template>
      </Card>
    </div>
  </div>
</template>
