export default function useDewormings() {
  async function fetchActualDeworming(dogId = 1) {
    console.log("Fetching actual deworming:", dogId);

    try {
      const res = await $fetch(`/api/dogs/${dogId}/dewormings`);
      console.log("Actual deworming fetched:", res);
      return res;
    } catch (error) {
      console.error("Error fetching actual deworming:", error);
      throw error;
    }
  }

  async function updateDeworming(payload) {
    console.log("Updating deworming with payload:", payload);

    const dogId = payload.dogId || 1;
    
    try {
      const res = await $fetch(`/api/dogs/${dogId}/dewormings`, {
        method: 'POST',
        body: payload,
      });
      console.log("Deworming updated:", res);
      return res;
    } catch (error) {
      console.error("Error updating deworming:", error);
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
    fetchActualDeworming,
    updateDeworming,
    isLate,
  };
}