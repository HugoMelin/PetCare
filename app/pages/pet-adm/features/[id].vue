<script setup lang="ts">
import type { FeatureResponse } from "~~/shared/types/feature";
import { ArrowLeft } from "@lucide/vue";
import FeatureForm from "~/components/admin/FeatureForm.vue";
definePageMeta({ middleware: ["check-admin"], layout: "admin" });
useHead({ title: "Modifier une fonctionnalité · PetCare" });
const route = useRoute();
const {
  data: feature,
  error,
  status,
  refresh,
} = await useFetch<FeatureResponse>(
  () => `/api/admin/features/${encodeURIComponent(String(route.params.id))}`,
);
const backLocation = computed(() => ({
  path: "/pet-adm/features",
  query: route.query,
}));
const back = () => navigateTo(backLocation.value);
const date = (value: string) => new Date(value).toLocaleString("fr-FR");
</script>
<template>
  <section class="mx-auto max-w-2xl space-y-6">
    <NuxtLink
      :to="backLocation"
      class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary"
      ><ArrowLeft class="size-4" /> Retour aux fonctionnalités</NuxtLink
    >
    <div>
      <h1 class="text-2xl font-semibold">Modifier la fonctionnalité</h1>
      <p class="mt-2 text-sm text-gray-500">
        Modifiez le nom, la clé, la description, le statut et la date
        d’activation.
      </p>
    </div>
    <div
      v-if="error"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      {{
        error.statusCode === 404
          ? "Fonctionnalité introuvable."
          : "Impossible de charger cette fonctionnalité."
      }}
      <button class="underline" @click="refresh()">Réessayer</button>
    </div>
    <p v-else-if="status === 'pending'" role="status">Chargement…</p>
    <div
      v-else-if="feature"
      class="space-y-6 rounded-xl border border-gray-200 bg-white p-6"
    >
      <dl
        class="flex flex-wrap gap-x-6 gap-y-2 border-b pb-4 text-xs text-gray-500"
      >
        <div>
          <dt>Identifiant</dt>
          <dd>{{ feature.id }}</dd>
        </div>
        <div>
          <dt>Création</dt>
          <dd>{{ date(feature.createdAt) }}</dd>
        </div>
        <div>
          <dt>Dernière modification</dt>
          <dd>{{ date(feature.updatedAt) }}</dd>
        </div>
      </dl>
      <FeatureForm
        :key="feature.id"
        :feature="feature"
        @saved="back"
        @cancel="back"
      />
    </div>
  </section>
</template>
