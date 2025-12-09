export const fetchOneDog = async (dogId) => {
  try {
    const response = await fetch(`/api/dogs/${dogId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch dog');
    }
    return {
      code: 200,
      data: await response.json()
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message
    };
  }
}