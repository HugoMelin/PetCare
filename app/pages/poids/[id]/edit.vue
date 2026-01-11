<script setup>
import Button from "~/components/ui/Button.vue";
import { ArrowLeft, Trash2 } from "lucide-vue-next";
import Card from "~/components/ui/Card.vue";
import Input from "~/components/ui/Form/Input.vue";
import Label from "~/components/ui/Form/Label.vue";
import useFormatDate from "~/composables/useFormatDate";
import Textarea from "~/components/ui/Form/Textarea.vue";

const { formatForDatetimeLocal } = useFormatDate();

const weightStore = useWeightStore();
const { selectedWeight, error } = storeToRefs(weightStore);
const { fetchWeightById, deleteWeightById, updateWeight } = weightStore;

const { selectedPet } = storeToRefs(usePetStore());
const route = useRoute();
const weightId = computed(() => Number(route.params.id));

const form = ref({});

const submitError = ref(null);

const handleDelete = async () => {
  if (confirm("Êtes-vous sûr de vouloir supprimer cette pesée ?")) {
    await deleteWeightById(selectedWeight.value.id);
    await navigateTo("/poids");
  }
};

const handleSubmit = async () => {
  const res = await updateWeight(selectedWeight.value.id, {
    weight: parseFloat(form.value.weight),
    date: new Date(form.value.date).toISOString(),
    comment: form.value.comment.trim(),
  });
  if (res.error) {
    submitError.value = res.error;
  } else {
    await fetchWeightById(selectedWeight.value.id);
  }
};

watch(
  [selectedPet, weightId],
  async ([pet, id]) => {
    if (!pet || !id) return;
    if (!selectedWeight.value || selectedWeight.value.id !== id) {
      await fetchWeightById(id);
    }
  },
  { immediate: true },
);

watch(
  selectedWeight,
  (weight) => {
    if (weight) {
      form.value.weight = weight.weight;
      form.value.date = formatForDatetimeLocal(weight.date);
      form.value.comment = weight.comment;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="link" size="lg">
        <NuxtLink
          to="/poids"
          class="flex items-center justify-center gap-2 p-2"
        >
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </NuxtLink>
      </Button>
      <h2 class="text-2xl font-bold">Modifier le poids</h2>
    </div>

    <div v-if="selectedWeight" class="space-y-6">
      <Card>
        <template #title> Informations de pesée </template>
        <template #content>
          <form
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
            @submit.prevent="handleSubmit"
          >
            <div>
              <Label html-for="weight"
                >Poids (kg)<span class="text-red-500">*</span></Label
              >
              <Input
                id="weight"
                v-model="form.weight"
                type="number"
                step="0.01"
                min="0"
                inputmode="decimal"
                required
                placeholder="Poids (kg)"
              />
            </div>
            <div>
              <Label html-for="date"
                >Date<span class="text-red-500">*</span></Label
              >
              <Input
                id="date"
                v-model="form.date"
                type="datetime-local"
                required
              />
            </div>
            <div class="col-span-1 sm:col-span-2">
              <Label html-for="comment">Commentaire</Label>
              <Textarea
                id="comment"
                v-model="form.comment"
                type="text"
                placeholder="Ajoutez des notes sur cette pesée (contexte, observations, etc.)"
              >
                {{ form.comment }}
              </Textarea>
            </div>
            <div class="flex gap-2 sm:gap-4 w-full col-span-1 sm:col-span-2">
              <Button
                variant="default"
                size="lg"
                type="submit"
                class="flex-1 sm:flex-initial"
              >
                Enregistrer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                class="flex-1 sm:flex-initial"
                @click="navigateTo('/poids')"
                >Annuler</Button
              >
            </div>
            <p v-if="submitError" class="text-red-500 mt-2">
              {{ submitError }}
            </p>
          </form>
        </template>
      </Card>

      <Card>
        <template #title> Supprimer cette pesée </template>
        <template #content>
          <p class="text-gray-600 text-sm mb-4">
            Supprimer cette entrée de pesée. Cette action est irréversible.
          </p>
          <Button
            variant="destructive"
            class="flex gap-2 w-full sm:w-auto"
            @click="handleDelete"
          >
            <Trash2 class="w-5 h-5" />
            Supprimer
          </Button>
        </template>
      </Card>

      <Card>
        <template #title> 💡 Conseils </template>

        <template #content>
          <div class="space-y-2 text-sm text-gray-600">
            <p>• Pesez votre animal à la même heure pour plus de précision</p>
            <p>
              • Notez le contexte dans les commentaires (avant/après repas,
              maladie, etc.)
            </p>
            <p>• Des variations de ±0.2 kg sont normales</p>
            <p>• Consultez un vétérinaire en cas de changement brusque</p>
          </div>
        </template>
      </Card>
    </div>

    <div v-else-if="error">
      <Card>
        <template #title>Une erreur est survenue</template>
        <template #content>
          <p class="mb-4">Il n'y a pas de données disponibles pour ce poids.</p>
          <NuxtLink to="/poids">
            <Button size="lg"> Retourner à la liste des poids </Button>
          </NuxtLink>
        </template>
      </Card>
    </div>
  </div>
</template>
