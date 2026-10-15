<script setup lang="ts">
import { Users, PawPrint, Pill, Scale, RefreshCw } from "@lucide/vue";
import Card from "~/components/ui/card/Card.vue";
import AdminDistributionChart from "~/components/admin/AdminDistributionChart.vue";

definePageMeta({ middleware: ["check-admin"], layout: "admin" });
useHead({ title: "Tableau de bord admin · PetCare" });
const { data, status, error, refresh } = await useFetch("/api/admin/dashboard");
const number = (value: number) => value.toLocaleString("fr-FR");
const cards = computed(() =>
  data.value
    ? [
        {
          label: "Personnes inscrites",
          value: data.value.totals.users,
          icon: Users,
          detail: "Tous les comptes créés",
        },
        {
          label: "Animaux",
          value: data.value.totals.pets,
          icon: PawPrint,
          detail: "Chaque animal compté une seule fois",
        },
        {
          label: "Traitements",
          value: data.value.totals.medications,
          icon: Pill,
          detail: "Traitements enregistrés, tous animaux confondus",
        },
        {
          label: "Pesées",
          value: data.value.totals.weights,
          icon: Scale,
          detail: "Mesures de poids enregistrées",
        },
      ]
    : [],
);
const medicationPercent = (value: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(
    data.value?.totals.medications
      ? (value / data.value.totals.medications) * 100
      : 0,
  );
</script>

<template>
  <div class="space-y-6" :aria-busy="status === 'pending'">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div>
        <p class="mb-1 text-sm font-medium text-primary">Administration</p>
        <h1 class="text-2xl font-semibold text-gray-900 lg:text-3xl">
          Tableau de bord
        </h1>
        <p class="mt-2 text-sm text-gray-500">
          Une vue d’ensemble de la communauté et du suivi des animaux.
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
        :disabled="status === 'pending'"
        @click="refresh()"
      >
        <RefreshCw
          class="size-4"
          :class="{ 'animate-spin': status === 'pending' }"
        />
        Actualiser
      </button>
    </div>
    <div
      v-if="error"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      Impossible de charger les statistiques. Réessayez avec le bouton
      Actualiser.
    </div>
    <p v-else-if="!data" role="status" class="py-16 text-center text-gray-500">
      Chargement des statistiques…
    </p>
    <template v-else>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card
          v-for="card in cards"
          :key="card.label"
          class="!mb-0 !rounded-xl !border !border-gray-200 !p-5 !shadow-sm"
        >
          <template #content>
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm text-gray-500">{{ card.label }}</span>
              <component :is="card.icon" class="size-5 shrink-0 text-primary" />
            </div>
            <p class="mt-3 text-3xl font-semibold tabular-nums text-gray-900">
              {{ number(card.value) }}
            </p>
            <p class="mt-2 text-xs text-gray-500">{{ card.detail }}</p>
          </template>
        </Card>
      </div>
      <div class="grid items-start gap-4 md:grid-cols-2 xl:grid-cols-3">
        <AdminDistributionChart
          title="Animaux par utilisateur"
          description="Part des inscrits selon le nombre d’animaux dont ils sont propriétaires."
          :items="data.ownership"
        />
        <AdminDistributionChart
          title="Répartition des espèces"
          description="Part de chaque espèce dans l’ensemble des animaux enregistrés."
          :items="data.species"
        />
        <AdminDistributionChart
          title="Suivi médicamenteux"
          description="Part des animaux avec au moins un traitement enregistré, quelle que soit sa date."
          :items="data.medicationCoverage"
        />
      </div>
      <Card class="!mb-0 !rounded-xl !border !border-gray-200 !p-5 !shadow-sm">
        <template #title-section>
          <h2 class="text-base font-semibold">
            Médicaments les plus enregistrés
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Les cinq premiers libellés, en pourcentage de tous les traitements
            enregistrés.
          </p>
        </template>
        <template #content>
          <ul
            v-if="data.topMedications.length"
            class="grid gap-x-10 gap-y-5 lg:grid-cols-2"
          >
            <li
              v-for="item in data.topMedications"
              :key="item.label"
              class="min-w-0"
            >
              <div
                class="mb-2 flex items-baseline justify-between gap-3 text-sm"
              >
                <span class="min-w-0 break-words font-medium">{{
                  item.label
                }}</span>
                <span class="shrink-0 tabular-nums text-gray-500"
                  >{{ number(item.value) }} ·
                  {{ medicationPercent(item.value) }} %</span
                >
              </div>
              <div
                class="h-2 overflow-hidden rounded-full bg-gray-100"
                aria-hidden="true"
              >
                <div
                  class="h-full rounded-full bg-primary"
                  :style="{
                    width: `${(item.value / data.totals.medications) * 100}%`,
                  }"
                />
              </div>
            </li>
          </ul>
          <p v-else class="py-6 text-sm text-gray-500">
            Aucun traitement enregistré pour le moment.
          </p>
        </template>
      </Card>
      <p class="text-xs leading-relaxed text-gray-500">
        Un animal partagé compte pour chacun de ses propriétaires dans la
        répartition par utilisateur. Les totaux d’animaux restent uniques. Les
        médicaments sont regroupés par libellé enregistré.
      </p>
    </template>
  </div>
</template>
