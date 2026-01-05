export const useMedicationStore = defineStore("medicationStore", () => {
  const medications = ref([]);

  const petStore = usePetStore();
  const { selectedPet } = storeToRefs(petStore);

  const fetchMedications = async (petId) => {
    if (!petId) {
      medications.value = [];
      return;
    }
    try {
      const response = await fetch(`/api/pets/${petId}/medications`);
      if (!response.ok) {
        throw new Error("Failed to fetch medications");
      }
      medications.value = await response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMedication = async (medicationId) => {
    if (!medicationId) {
      return;
    }
    try {
      const response = await fetch(`/api/medications/${medicationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete medication");
      }
      // Remove the deleted medication from the local state
      medications.value = medications.value.filter(
        (med) => med.id !== medicationId,
      );
    } catch (error) {
      console.error(error);
    }
  };

  const updateMedication = async (payload) => {
    if (!payload?.petId || !payload?.entryId) {
      return;
    }
    try {
      const response = await fetch(`/api/pets/${payload.petId}/medications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entryId: payload.entryId,
          medication: payload.medication,
          frequencyDays: payload.frequencyDays,
          lastDoseDate: payload.lastDoseDate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update medication");
      }
      const updatedMedication = await response.json();
      const index = medications.value.findIndex(
        (med) => med.id === updatedMedication.id,
      );
      if (index !== -1) {
        medications.value[index] = updatedMedication;
      }
      console.log("Medication updated:", updatedMedication);
    } catch (error) {
      console.error(error);
    }
  };

  watch(
    selectedPet,
    async (newPet) => {
      if (newPet?.id) {
        await fetchMedications(newPet.id);
      } else {
        medications.value = [];
      }
    },
    { immediate: true },
  );

  return {
    medications,
    fetchMedications,
    deleteMedication,
    updateMedication,
  };
});
