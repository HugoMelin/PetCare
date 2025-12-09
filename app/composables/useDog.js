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

export const addDog = async (dogData) => {
  try {
    const response = await fetch('/api/dogs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dogData)
    });
    if (!response.ok) {
      throw new Error('Failed to add dog');
    }
    return {
      code: 201,
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