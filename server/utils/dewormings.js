import { prisma } from './prisma';

export const getActualDewormingsByDogId = async (dogId) => {
  return await prisma.DewormingSchedule.findFirst({
    where: {
      dogId: parseInt(dogId),
    },
    orderBy: { nextDoseDate: 'desc' },
  });
}

export const addDewormingEntry = async (dogId, medication, frequencyDays, nextDoseDate, date = new Date()) => {
  return await prisma.DewormingSchedule.create({
    data: {
      dogId: parseInt(dogId),
      medication: medication,
      lastDoseDate: new Date(date),
      frequencyDays: parseInt(frequencyDays),
      nextDoseDate: new Date(nextDoseDate),
    },
  });
}

export const updateDewormingEntry = async (id, medication, frequencyDays, nextDoseDate, date = new Date()) => {
  return await prisma.DewormingSchedule.update({
    where: { id: parseInt(id) },
    data: {
      medication: medication,
      lastDoseDate: new Date(date),
      frequencyDays: parseInt(frequencyDays),
      nextDoseDate: new Date(nextDoseDate),
    },
  });
}

export const deleteDewormingEntry = async (id) => {
  return await prisma.DewormingSchedule.delete({
    where: { id: parseInt(id) },
  });
}