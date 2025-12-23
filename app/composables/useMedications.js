export default function useMedications() {
  async function fetchActualMedication(petId = 1) {
    console.log("Fetching actual medication:", petId);

    try {
      const res = await $fetch(`/api/pets/${petId}/medications`, {
        cache: "no-store",
        headers: {
          "cache-control": "no-store",
        },
      });
      console.log("Actual medication fetched:", res);
      return res;
    } catch (error) {
      console.error("Error fetching actual medication:", error);
      throw error;
    }
  }

  async function updateMedication(payload) {
    console.log("Updating medication with payload:", payload);

    const petId = payload.petId;

    try {
      const res = await $fetch(`/api/pets/${petId}/medications`, {
        method: "POST",
        cache: "no-store",
        headers: {
          "cache-control": "no-store",
        },
        body: payload,
      });
      console.log("Medication updated:", res);
      return res;
    } catch (error) {
      console.error("Error updating medication:", error);
      throw error;
    }
  }

  function isLate(nextDoseDate) {
    if (!nextDoseDate) return false;

    const targetDate = new Date(nextDoseDate);
    const today = new Date();

    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return targetDate < today;
  }

  return {
    fetchActualMedication,
    updateMedication,
    isLate,
  };
}
