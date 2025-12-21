import { defineStore } from "pinia";

const SELECTED_DOG_KEY = "petcare_selected_dog_id";

export const useDogStore = defineStore("dogStore", () => {
  const dogs = ref([]);
  const selectedDog = ref(null);

  const saveSelectedDogToStorage = (dog) => {
    if (import.meta.client && dog?.id) {
      localStorage.setItem(SELECTED_DOG_KEY, dog.id);
    }
  };

  const getSelectedDogIdFromStorage = () => {
    if (import.meta.client) {
      return localStorage.getItem(SELECTED_DOG_KEY);
    }
    return null;
  };

  watch(selectedDog, (newDog) => {
    saveSelectedDogToStorage(newDog);
  });

  const fetchMyDogs = async () => {
    try {
      const response = await fetch("/api/dogs");
      if (!response.ok) {
        throw new Error("Failed to fetch dogs");
      }
      dogs.value = await response.json();
      console.log("Fetched dogs:", dogs.value);

      const savedDogId = getSelectedDogIdFromStorage();
      if (savedDogId && dogs.value.length > 0) {
        const savedDog = dogs.value.find(
          (dog) => String(dog.id) === savedDogId
        );
        if (savedDog) {
          selectedDog.value = savedDog;
          return;
        }
      }

      if (!selectedDog.value && dogs.value.length > 0) {
        selectedDog.value = dogs.value[0];
      }
    } catch (error) {
      console.error(error);
    }
  };

  onMounted(async () => {
    await fetchMyDogs();
  });

  const clearDogCache = () => {
    if (import.meta.client) {
      localStorage.removeItem(SELECTED_DOG_KEY);
    }
    dogs.value = [];
    selectedDog.value = null;
  };

  const removeDogById = (dogId) => {
    dogs.value = dogs.value.filter((dog) => dog.id !== dogId);
    if (selectedDog.value?.id === dogId) {
      selectedDog.value = dogs.value.length > 0 ? dogs.value[0] : null;
    }
  };

  const updateDogInStore = (updatedDog) => {
    const index = dogs.value.findIndex((dog) => dog.id === updatedDog.id);
    if (index !== -1) {
      dogs.value.splice(index, 1, updatedDog);
      if (selectedDog.value?.id === updatedDog.id) {
        selectedDog.value = updatedDog;
      }
    }
  };

  const fetchOwners = async (dogId) => {
    const response = await fetch(`/api/dogs/${dogId}/owners`);
    if (!response.ok) {
      throw new Error("Failed to fetch owners");
    }

    const data = await response.json();
    return data;
  };

  return {
    dogs,
    selectedDog,
    fetchMyDogs,
    fetchOwners,
    clearDogCache,
    removeDogById,
    updateDogInStore,
  };
});
