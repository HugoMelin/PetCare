<script setup lang="ts">
import type { FeatureResponse } from "~~/shared/types/feature";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Search,
  Pencil,
  Plus,
  Trash2,
} from "@lucide/vue";
import { watchDebounced } from "@vueuse/core";
import { toast } from "vue-sonner";
import Button from "~/components/ui/button/Button.vue";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from "~/components/ui/table";
import FeatureForm from "~/components/admin/FeatureForm.vue";
definePageMeta({ middleware: ["check-admin"], layout: "admin" });
useHead({ title: "Fonctionnalités · PetCare" });
const route = useRoute();
const router = useRouter();
type SortField = "name" | "key" | "enabledAt" | "enabled";
const sortableFields: SortField[] = ["name", "key", "enabledAt", "enabled"];
const debouncedSearch = computed(() =>
  typeof route.query.search === "string"
    ? route.query.search.slice(0, 191).trim()
    : "",
);
const search = ref(debouncedSearch.value);
const sortBy = computed<SortField>(() =>
  sortableFields.includes(route.query.sortBy as SortField)
    ? (route.query.sortBy as SortField)
    : "name",
);
const sortOrder = computed(() =>
  route.query.sortOrder === "desc" ? "desc" : "asc",
);

watch(debouncedSearch, (value) => {
  search.value = value;
});
watchDebounced(
  search,
  (value) => {
    // Ignore a pending edit if browser navigation has since changed the input.
    if (value !== search.value || value.trim() === debouncedSearch.value)
      return;
    void router.replace({
      query: { ...route.query, search: value.trim() || undefined },
      hash: route.hash,
    });
  },
  { debounce: 300 },
);
const columns = [
  { key: "name", label: "Fonctionnalité" },
  { key: "key", label: "Clé" },
  { key: "enabled", label: "Statut" },
  { key: "enabledAt", label: "Date d’activation" },
] as const;
function sort(column: SortField) {
  void router.push({
    query: {
      ...route.query,
      search: search.value.trim() || undefined,
      sortBy: column,
      sortOrder:
        sortBy.value === column && sortOrder.value === "asc" ? "desc" : "asc",
    },
    hash: route.hash,
  });
}
const query = computed(() => ({
  search: debouncedSearch.value.trim(),
  sortBy: sortBy.value,
  sortOrder: sortOrder.value,
}));
const {
  data: features,
  status,
  error,
  refresh,
} = await useFetch<FeatureResponse[]>("/api/admin/features", { query });
const creating = ref(false);
const deleting = ref<{ id: number; name: string } | null>(null);
const busy = ref(false);
const deleteError = ref("");
const date = (value: string | null) =>
  value ? new Date(value).toLocaleString("fr-FR") : "—";
async function created() {
  creating.value = false;
  await refresh();
}
async function remove() {
  if (!deleting.value || busy.value) return;
  busy.value = true;
  deleteError.value = "";
  try {
    await $fetch(`/api/admin/features/${deleting.value.id}`, {
      method: "DELETE",
    });
    deleting.value = null;
    toast.success("Fonctionnalité supprimée.");
    await refresh();
  } catch {
    deleteError.value = "Impossible de supprimer la fonctionnalité. Réessayez.";
  } finally {
    busy.value = false;
  }
}
</script>
<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold">Fonctionnalités</h1>
        <p class="mt-2 text-sm text-gray-500">
          Gérez les fonctionnalités de l’application et leur activation.
        </p>
      </div>
      <Button class="gap-2" @click="creating = true"
        ><Plus class="size-4" /> Ajouter une fonctionnalité</Button
      >
    </div>
    <div class="max-w-md space-y-2">
      <label for="feature-search" class="block text-sm font-medium"
        >Rechercher une fonctionnalité</label
      >
      <div class="relative">
        <Search
          class="pointer-events-none absolute left-3 top-3 size-4 text-gray-400"
          aria-hidden="true"
        />
        <input
          id="feature-search"
          v-model="search"
          type="search"
          maxlength="191"
          placeholder="Rechercher par nom ou clé…"
          class="w-full rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </div>
    </div>
    <div
      v-if="error"
      role="alert"
      class="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
    >
      Impossible de charger les fonctionnalités.
      <button class="underline" @click="refresh()">Réessayer</button>
    </div>
    <p
      v-else-if="status === 'pending' && !features"
      role="status"
      class="py-12 text-center text-gray-500"
    >
      Chargement des fonctionnalités…
    </p>
    <div
      v-else
      class="overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <Table class="w-full text-left text-sm" :aria-busy="status === 'pending'">
        <TableCaption class="sr-only"> Liste des fonctionnalités </TableCaption>
        <TableHeader class="border-b bg-gray-50 text-gray-600">
          <TableRow>
            <TableHead
              v-for="column in columns"
              :key="column.key"
              :aria-sort="
                sortBy === column.key
                  ? sortOrder === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              "
            >
              <button
                type="button"
                class="inline-flex items-center gap-2 whitespace-nowrap rounded py-2 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                @click="sort(column.key)"
              >
                {{ column.label }}
                <component
                  :is="
                    sortBy === column.key
                      ? sortOrder === 'asc'
                        ? ArrowUp
                        : ArrowDown
                      : ArrowUpDown
                  "
                  class="size-4"
                  aria-hidden="true"
                />
              </button>
            </TableHead>
            <TableHead class="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody class="divide-y divide-gray-100">
          <TableRow v-for="feature in features" :key="feature.id">
            <TableCell class="max-w-sm">
              <p class="break-words font-medium">{{ feature.name }}</p>
              <p
                v-if="feature.description"
                class="mt-1 break-words text-gray-500"
              >
                {{ feature.description }}
              </p>
            </TableCell>
            <TableCell class="max-w-xs break-words font-mono text-xs">
              {{ feature.key }}
            </TableCell>
            <TableCell>
              <span
                class="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
                :class="
                  feature.enabled
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                "
                >{{ feature.enabled ? "Activée" : "Désactivée" }}</span
              >
            </TableCell>
            <TableCell class="whitespace-nowrap text-gray-500">
              {{ date(feature.enabledAt) }}
            </TableCell>
            <TableCell>
              <div class="flex justify-end gap-2">
                <NuxtLink
                  :to="{
                    path: `/pet-adm/features/${feature.id}`,
                    query: route.query,
                  }"
                  class="rounded-md p-2 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-primary"
                  :aria-label="`Modifier ${feature.name}`"
                  :title="`Modifier ${feature.name}`"
                  ><Pencil class="size-4"
                /></NuxtLink>
                <Button
                  variant="ghost"
                  size="icon"
                  class="text-red-600"
                  :aria-label="`Supprimer ${feature.name}`"
                  :title="`Supprimer ${feature.name}`"
                  @click="
                    deleting = feature;
                    deleteError = '';
                  "
                  ><Trash2 class="size-4"
                /></Button>
              </div>
            </TableCell>
          </TableRow>
          <TableRow v-if="!features?.length">
            <TableCell colspan="5" class="p-12 text-center text-gray-500">
              {{
                debouncedSearch.trim()
                  ? "Aucune fonctionnalité ne correspond à votre recherche."
                  : "Aucune fonctionnalité. Ajoutez votre première fonctionnalité."
              }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <Dialog v-model:open="creating">
      <DialogContent class="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader
          ><DialogTitle>Ajouter une fonctionnalité</DialogTitle
          ><DialogDescription
            >Renseignez les informations de la nouvelle
            fonctionnalité.</DialogDescription
          ></DialogHeader
        >
        <FeatureForm @saved="created" @cancel="creating = false" />
      </DialogContent>
    </Dialog>
    <Dialog
      :open="!!deleting"
      @update:open="
        (value) => {
          if (!value && !busy) deleting = null;
        }
      "
    >
      <DialogContent
        @escape-key-down="busy && $event.preventDefault()"
        @interact-outside="busy && $event.preventDefault()"
      >
        <DialogHeader
          ><DialogTitle>Supprimer la fonctionnalité ?</DialogTitle
          ><DialogDescription
            >La fonctionnalité « {{ deleting?.name }} » sera définitivement
            supprimée.</DialogDescription
          ></DialogHeader
        >
        <p v-if="deleteError" role="alert" class="text-sm text-red-700">
          {{ deleteError }}
        </p>
        <div class="flex justify-end gap-3">
          <Button variant="outline" :disabled="busy" @click="deleting = null"
            >Annuler</Button
          ><Button variant="destructive" :disabled="busy" @click="remove">{{
            busy ? "Suppression…" : "Supprimer"
          }}</Button>
        </div>
      </DialogContent>
    </Dialog>
  </section>
</template>
