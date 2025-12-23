export const fetchOnePet = async (petId) => {
  try {
    const response = await fetch(`/api/pets/${petId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch pet");
    }
    return {
      code: 200,
      data: await response.json(),
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};

export const addPet = async (petData) => {
  try {
    const response = await fetch("/api/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    });
    if (!response.ok) {
      throw new Error("Failed to add pet");
    }
    return {
      code: 201,
      data: await response.json(),
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};

export const deletePet = async (petId) => {
  try {
    const response = await fetch(`/api/pets/${petId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete pet");
    }
    return {
      code: 200,
      data: null,
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};

export const updatePet = async (petId, petData) => {
  try {
    const res = await fetch(`/api/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(petData),
    });
    if (!res.ok) {
      throw new Error("Failed to update pet");
    }
    return {
      code: 200,
      data: await res.json(),
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};

export const addPetOwner = async (petId, newOwnerEmail) => {
  try {
    const response = await fetch(`/api/pets/${petId}/add-owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ newOwnerEmail }),
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
      data: await response.json(),
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};

export const removePetOwner = async (petId, ownerUserId) => {
  try {
    const response = await fetch(`/api/pets/${petId}/remove-owner`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ownerUserId }),
    });
    if (!response.ok) {
      throw new Error("Failed to remove pet owner");
    }
    return {
      code: 200,
      data: await response.json(),
    };
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: error.message,
    };
  }
};
