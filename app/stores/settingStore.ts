import { defineStore } from "pinia";
import { authClient } from "~/lib/auth-client";
import { toast } from "vue-sonner";

type Settings = Ref<{
  wantsRemindersMails?: boolean;
}>;

export const useSettingStore = defineStore("setting", () => {
  const session = authClient.useSession();
  const user = computed(() => session.value?.data?.user);

  const settings: Settings = ref({});

  const fetchSettings = async () => {
    if (!user.value?.id) {
      return;
    }

    try {
      const data = await $fetch(`/api/users/${user.value?.id}/settings`, {
        method: "GET",
      });
      settings.value = { ...settings.value, ...data };
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const updateReminderStatus = async (status: boolean) => {
    if (!user.value?.id) {
      return;
    }

    try {
      await $fetch(`/api/users/${user.value?.id}/settings/reminder-status`, {
        method: "PUT",
        body: { status },
      });
      settings.value.wantsRemindersMails = status;
      toast.success("Statut des rappels mis à jour avec succès.");
    } catch (error) {
      console.error("Error updating reminder status:", error);
      toast.error("Erreur lors de la mise à jour du statut des rappels");
    }
  };

  watch(
    () => user.value?.id,
    async (userId) => {
      if (userId) {
        await fetchSettings();
      }
    },
    { immediate: true },
  );

  return {
    settings,
    fetchSettings,
    updateReminderStatus,
  };
});
