import { defineStore } from "pinia";

const SELECTED_PET_KEY = "petcare_selected_pet_id";

export const usePetStore = defineStore("petStore", () => {
  const pets = ref([]);
  const selectedPet = ref(null);

  const saveSelectedPetToStorage = (pet) => {
    if (import.meta.client && pet?.id) {
      localStorage.setItem(SELECTED_PET_KEY, pet.id);
    }
  };

  const getSelectedPetIdFromStorage = () => {
    if (import.meta.client) {
      return localStorage.getItem(SELECTED_PET_KEY);
    }
    return null;
  };

  watch(selectedPet, (newPet) => {
    saveSelectedPetToStorage(newPet);
  });

  const fetchMyPets = async () => {
    try {
      const response = await fetch("/api/pets");
      if (!response.ok) {
        throw new Error("Failed to fetch pets");
      }
      pets.value = await response.json();
      console.log("Fetched pets:", pets.value);

      const savedPetId = getSelectedPetIdFromStorage();
      if (savedPetId && pets.value.length > 0) {
        const savedPet = pets.value.find(
          (pet) => String(pet.id) === savedPetId
        );
        if (savedPet) {
          selectedPet.value = savedPet;
          return;
        }
      }

      if (!selectedPet.value && pets.value.length > 0) {
        selectedPet.value = pets.value[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(async () => {
    await fetchMyPets();
  });

  const clearPetCache = () => {
    if (import.meta.client) {
      localStorage.removeItem(SELECTED_PET_KEY);
    }
    pets.value = [];
    selectedPet.value = null;
  };

  const removePetById = (petId) => {
    pets.value = pets.value.filter((pet) => pet.id !== petId);
    if (selectedPet.value?.id === petId) {
      selectedPet.value = pets.value.length > 0 ? pets.value[0] : null;
    }
  };

  const updatePetInStore = (updatedPet) => {
    const index = pets.value.findIndex((pet) => pet.id === updatedPet.id);
    if (index !== -1) {
      pets.value.splice(index, 1, updatedPet);
      if (selectedPet.value?.id === updatedPet.id) {
        selectedPet.value = updatedPet;
      }
    }
  };

  const fetchOwners = async (petId) => {
    const response = await fetch(`/api/pets/${petId}/owners`);
    if (!response.ok) {
      throw new Error("Failed to fetch owners");
    }

    const data = await response.json();
    return data;
  };

  return {
    pets,
    selectedPet,
    fetchMyPets,
    fetchOwners,
    clearPetCache,
    removePetById,
    updatePetInStore,
  };
});
