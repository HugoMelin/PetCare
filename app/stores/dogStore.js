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

  onMounted(() => {
    fetchMyDogs();
  });

  const clearDogCache = () => {
    if (import.meta.client) {
      localStorage.removeItem(SELECTED_DOG_KEY);
    }
    dogs.value = [];
    selectedDog.value = null;
  };

  return {
    dogs,
    selectedDog,
    fetchMyDogs,
    clearDogCache,
  };
});
