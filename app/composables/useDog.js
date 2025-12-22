export const fetchOneDog = async (dogId) => {
  try {
    const response = await fetch(`/api/pets/${dogId}`);
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
    const response = await fetch('/api/pets', {
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

export const deleteDog = async (dogId) => {
  try {
    const response = await fetch(`/api/pets/${dogId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Failed to delete dog');
    }
    return {
      code: 200,
      data: null
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message
    };
  }
}

export const updateDog = async (dogId, dogData) => {
  try {
    const res = await fetch(`/api/pets/${dogId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dogData)
    });
    if (!res.ok) {
      throw new Error('Failed to update dog');
    }
    return {
      code: 200,
      data: await res.json()
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message
    };
  }
}

export const addDogOwner = async (dogId, newOwnerEmail) => {
  try {
    const response = await fetch(`/api/pets/${dogId}/add-owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ newOwnerEmail })
    });
    if (!response.ok) {
      console.log("Response not ok:", response);
      throw createError({
      statusCode: 400,
      message: response.message,
    });
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

export const removeDogOwner = async (dogId, ownerUserId) => {
  try {
    const response = await fetch(`/api/pets/${dogId}/remove-owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ownerUserId })
    });
    if (!response.ok) {
      throw new Error('Failed to remove dog owner');
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