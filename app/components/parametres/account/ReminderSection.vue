<script setup lang="ts">
import { useSettingStore } from "~/stores/settingStore";
const settingStore = useSettingStore();
const { updateReminderStatus } = settingStore;
const { settings } = storeToRefs(settingStore);
</script>

<template>
  <div class="p-4 border border-gray-200 rounded-lg mb-4">
    <input
      id="reminders"
      v-model="settings.wantsRemindersMails"
      type="checkbox"
      class="mr-2"
      @change="updateReminderStatus(settings.wantsRemindersMails ?? false)"
    />
    <label for="reminders" class="text-gray-900"
      >Activer les rappels de médicaments par mails</label
    >
  </div>
</template>
