import { defineStore } from 'pinia';

export const useDogStore = defineStore('dogStore', () =>{
 const dogs = ref([]);
 const selectedDog = ref(null);

 const fetchMyDogs = async () => {
  try {
    const response = await fetch('/api/dogs');
    if (!response.ok) {
     throw new Error('Failed to fetch dogs');
    }
    dogs.value = await response.json();
    
    if (!selectedDog.value && dogs.value.length > 0) {
    selectedDog.value = dogs.value[0];
    }
  } catch (error) {
    console.error(error);
  }
 }

 onMounted(() => {
  fetchMyDogs();
 });

 return {
  dogs,
  selectedDog,
  fetchMyDogs,
 }
});