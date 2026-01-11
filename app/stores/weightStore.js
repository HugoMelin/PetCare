export const useWeightStore = defineStore("weightStore", () => {
  const petStore = usePetStore();
  const { selectedPet } = storeToRefs(petStore);

  const weights = ref([]);
  const selectedWeight = ref(null);
  const error = ref(null);

  const fetchWeights = async () => {
    if (!selectedPet.value) {
      console.log("No selected pet, clearing weights.");
      weights.value = [];
      return;
    }
    try {
      const res = await $fetch(`/api/pets/${selectedPet.value.id}/weights`, {
        cache: "no-store",
        headers: {
          "cache-control": "no-store",
        },
      });
      weights.value = res;
    } catch (error) {
      console.error("Error fetching weights:", error);
      throw error;
    }
  };

  const fetchWeightById = async (weightId) => {
    if (!selectedPet.value || !weightId) {
      console.log("No selected pet or weight ID provided.");
      selectedWeight.value = null;
      return;
    }
    try {
      const res = await $fetch(
        `/api/pets/${selectedPet.value.id}/weights/${weightId}`,
        {
          cache: "no-store",
          headers: {
            "cache-control": "no-store",
          },
        },
      );
      if (res.error) {
        throw new Error(res.error);
      }
      selectedWeight.value = res;
    } catch (err) {
      console.error(err);
      error.value = { message: err.message };
    }
  };

  const deleteWeightById = async (weightId) => {
    if (!selectedPet.value || !weightId) {
      console.log("No selected pet or weight ID provided for deletion.");
      return;
    }
    try {
      const res = await $fetch(`/api/weights/${weightId}`, {
        method: "DELETE",
      });
      await fetchWeights();
      return res;
    } catch (err) {
      console.error("Error deleting weight:", err);
      throw err;
    }
  };

  const updateWeight = async (weightId, payload) => {
    if (!weightId) {
      console.log("No selected pet or weight ID provided for update.");
      return;
    }

    /* if ( !payload.weight || !payload.date) {
      return { error : "Les champs 'Poids' et 'Date' doivent être fourni pour la mise à jour."};
    } */
    console.log("Updating weight with payload:", payload);

    try {
      const res = await $fetch(`/api/weights/${weightId}`, {
        method: "PATCH",
        contentType: "application/json",
        body: payload,
      });
      console.log("Weight updated:", res);
      await fetchWeights();
      return res;
    } catch (err) {
      console.error("Error updating weight:", err);
      throw err;
    }
  };

  watch(
    selectedPet,
    async (newPet) => {
      if (newPet) {
        await fetchWeights();
        return;
      }
    },
    { immediate: true },
  );

  return {
    weights,
    selectedWeight,
    error,
    fetchWeights,
    fetchWeightById,
    deleteWeightById,
    updateWeight,
  };
});
