export default function useWeights() {
  async function addWeight(weightData) {
    // Logic to add weight entry
    console.log("Adding weight:", weightData);

    const { weight, date, comment } = weightData;

    try {
      const res = await $fetch('/api/weights', {
        method: 'POST',
        body: {
          dogId: 1, // Replace with actual dogId
          weight,
          date,
          comment,
        },
      });
      console.log("Weight added:", res);
      return res;
    } catch (error) {
      console.error("Error adding weight:", error);
      throw error;
    }
  }

  async function fetchWeights(dogId = 1) {
    console.log("Fetching weights...");
    try {
      const res = await $fetch(`/api/dogs/${dogId}/weights`);
      console.log("Weights fetched:", res);
      return res;
    } catch (error) {
      console.error("Error fetching weights:", error);
      throw error;
    }
  }

  return {
    addWeight,
    fetchWeights,
  };
}