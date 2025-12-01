import { prisma } from './prisma';

export const getAllWeights = async () => {
  return await prisma.weightEntry.findMany();
};

export const getWeightsByDogId = async (dogId) => {
  return await prisma.weightEntry.findMany({
    where: { dogId: parseInt(dogId) },
    orderBy: { date: 'desc' },
  });
};

export const addWeightEntry = async (dogId, weight, date = new Date()) => {
  return await prisma.weightEntry.create({
    data: {
      dogId: parseInt(dogId),
      weight: parseFloat(weight),
      date: new Date(date),
    },
  });
};

export const updateWeightEntry = async (id, weight = null, comment = null, date = null) => {
  return await prisma.weightEntry.update({
    where: { id: parseInt(id) },
    data: {
      weight: weight !== null ? parseFloat(weight) : undefined,
      date: date !== null ? new Date(date) : undefined,
      comment: comment !== null ? comment : undefined,
    },
  });
}

export const deleteWeightEntry = async (id) => {
  return await prisma.weightEntry.delete({
    where: { id: parseInt(id) },
  });
}