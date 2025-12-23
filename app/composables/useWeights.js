export default function useWeights() {
  async function addWeight(petId, weightData) {
    // Logic to add weight entry
    console.log("Adding weight:", weightData);

    const { weight, date, comment } = weightData;

    try {
      const res = await $fetch("/api/weights", {
        method: "POST",
        cache: "no-store",
        headers: {
          "cache-control": "no-store",
        },
        body: {
          petId,
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

  async function fetchWeights(petId = 1) {
    console.log("Fetching weights...");
    try {
      const res = await $fetch(`/api/pets/${petId}/weights`, {
        cache: "no-store",
        headers: {
          "cache-control": "no-store",
        },
      });
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
