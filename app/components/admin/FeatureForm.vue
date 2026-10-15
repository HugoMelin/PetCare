<script setup lang="ts">
import type { FeatureResponse } from "~~/shared/types/feature";
import Button from "~/components/ui/button/Button.vue";
import { toast } from "vue-sonner";
const props = defineProps<{
  feature?: FeatureResponse;
}>();
const emit = defineEmits<{ saved: []; cancel: [] }>();
function localDate(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 19);
}
const form = reactive({
  key: props.feature?.key ?? "",
  name: props.feature?.name ?? "",
  description: props.feature?.description ?? "",
  enabled: props.feature?.enabled ?? false,
  enabledAt: localDate(props.feature?.enabledAt),
});
const saving = ref(false);
const error = ref("");
const fields = ref<Record<string, string>>({});
async function save() {
  if (saving.value) return;
  saving.value = true;
  error.value = "";
  fields.value = {};
  try {
    await $fetch(
      props.feature
        ? `/api/admin/features/${props.feature.id}`
        : "/api/admin/features",
      {
        method: props.feature ? "PATCH" : "POST",
        body: {
          ...form,
          key: form.key.trim(),
          name: form.name.trim(),
          enabledAt: form.enabledAt
            ? new Date(form.enabledAt).toISOString()
            : props.feature
              ? null
              : undefined,
        },
      },
    );
    toast.success(
      props.feature ? "Fonctionnalité modifiée." : "Fonctionnalité créée.",
    );
    emit("saved");
  } catch (cause: unknown) {
    const response = cause as {
      data?: { message?: string; data?: { fields?: Record<string, string> } };
    };
    error.value =
      response.data?.message ??
      "Impossible d’enregistrer la fonctionnalité. Réessayez.";
    fields.value = response.data?.data?.fields ?? {};
  } finally {
    saving.value = false;
  }
}
</script>
<template>
  <form class="space-y-5" @submit.prevent="save">
    <fieldset :disabled="saving" class="space-y-4">
      <div
        v-for="field in ['name', 'key'] as const"
        :key="field"
        class="space-y-1.5"
      >
        <label :for="`feature-${field}`" class="block text-sm font-medium"
          >{{ field === "name" ? "Nom" : "Clé" }} *</label
        >
        <input
          :id="`feature-${field}`"
          v-model="form[field]"
          required
          pattern=".*\S.*"
          maxlength="191"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
          :aria-invalid="!!fields[field]"
        />
        <p v-if="fields[field]" class="text-sm text-red-700">
          {{ fields[field] }}
        </p>
      </div>
      <div class="space-y-1.5">
        <label for="feature-description" class="block text-sm font-medium"
          >Description</label
        >
        <textarea
          id="feature-description"
          v-model="form.description"
          maxlength="191"
          rows="3"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <p v-if="fields.description" class="text-sm text-red-700">
          {{ fields.description }}
        </p>
      </div>
      <div class="space-y-1.5">
        <label for="feature-date" class="block text-sm font-medium"
          >Date d’activation</label
        >
        <input
          id="feature-date"
          v-model="form.enabledAt"
          type="datetime-local"
          step="1"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
        />
        <p class="text-xs text-gray-500">
          Si la fonctionnalité est activée, elle ne sera effective qu’une fois
          cette date passée.
        </p>
        <p v-if="fields.enabledAt" class="text-sm text-red-700">
          {{ fields.enabledAt }}
        </p>
      </div>
      <label class="flex items-center gap-2 text-sm font-medium"
        ><input
          v-model="form.enabled"
          type="checkbox"
          class="size-4 accent-primary"
        />
        Fonctionnalité activée</label
      >
    </fieldset>
    <p v-if="error" role="alert" class="text-sm text-red-700">{{ error }}</p>
    <div class="flex justify-end gap-3">
      <Button
        type="button"
        variant="outline"
        :disabled="saving"
        @click="emit('cancel')"
        >Annuler</Button
      >
      <Button type="submit" :disabled="saving">{{
        saving
          ? "Enregistrement…"
          : feature
            ? "Enregistrer les modifications"
            : "Créer la fonctionnalité"
      }}</Button>
    </div>
  </form>
</template>
