import { prisma } from './prisma';

export const getDogsByUserId = async (userId) => {
  return await prisma.dog.findMany({
    where: { createdByUserId: userId },
  });
};

export const getDogsOwnedByUserId = async (userId) => {
  return await prisma.dog.findMany({
    where: { owner: { some: { id: userId } } },
  });
};

export const getDogById = async (dogId) => {
  return await prisma.dog.findUnique({
    where: { id: dogId },
    include: {
      weightEntries: {
        orderBy: { date: 'desc' },
      },
      dewormingSchedules: true,
      owner: true,
    },
  });
};

export const createDog = async (payload) => {
  const {
    name,
    birthdate,
    breed,
    userId
  } = payload;

  return await prisma.dog.create({
    data: {
      name: name,
      birthdate: birthdate ? new Date(birthdate) : null,
      breed: breed || null,
      createdByUserId: userId,
      owner: {
        connect: { id: userId },
      }
    },
  });
};

export const updateDog = async (dogId, payload) => {
  const {
    name,
    birthdate,
    breed,
  } = payload;

  return await prisma.dog.update({
    where: { id: parseInt(dogId) },
    data: {
      name: name !== undefined ? name : undefined,
      birthdate: birthdate !== undefined ?  new Date(birthdate) : undefined,
      breed: breed !== undefined ? breed : undefined,
    },
  });
};

export const deleteDog = async (dogId) => {
  return await prisma.dog.delete({
    where: { id: parseInt(dogId) },
  });
};

export const isUserDogCreator = async (userId, dogId) => {
  const dog = await prisma.dog.findFirst({
    where: {
      id: parseInt(dogId),
      createdByUserId: userId,
    },
  });

  return !!dog;
};


export const isUserDogOwner = async (userId, dogId) => {
  const dog = await prisma.dog.findFirst({
    where: {
      id: parseInt(dogId),
      OR: [
        { createdByUserId: userId },
        { owner: { some: { id: userId } } },
      ],
    },
  });

  return !!dog;
};

export const addDogOwners = async (dogId, newOwnerUserId) => {
  return await prisma.dog.update({
    where: { id: parseInt(dogId) },
    data: {
      owner: {
        connect: { id: newOwnerUserId },
      },
    },
  });
};

export const removeDogOwner = async (dogId, ownerUserId) => {
  return await prisma.dog.update({
    where: { id: parseInt(dogId) },
    data: {
      owner: {
        disconnect: { id: ownerUserId },
      },
    },
  });
};
