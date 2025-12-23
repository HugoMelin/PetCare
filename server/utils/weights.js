import { prisma } from './prisma';

export const getAllWeights = async () => {
  return await prisma.weightEntry.findMany();
};

export const getWeightsByPetId = async (petId) => {
  return await prisma.weightEntry.findMany({
    where: { petId: parseInt(petId) },
    orderBy: [{ date: 'desc' }, { id: 'desc' }],
  });
};

export const addWeightEntry = async (payload) => {
  const { petId, weight, date = new Date().toISOString().substr(0, 16), comment } = payload;
  return await prisma.weightEntry.create({
    data: {
      petId: parseInt(petId),
      weight: parseFloat(weight),
      date: new Date(date),
      comment: comment,
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
