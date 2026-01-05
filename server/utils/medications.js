import { prisma } from "./prisma";

export const getAllMedicationsByPetId = async (petId) => {
  return await prisma.medication.findMany({
    where: {
      petId: parseInt(petId),
    },
    orderBy: { medication: "asc" },
  });
};

export const addMedicationEntry = async (
  petId,
  medication,
  frequencyDays,
  nextDoseDate,
  date = new Date(),
) => {
  return await prisma.medication.create({
    data: {
      petId: parseInt(petId),
      medication: medication,
      lastDoseDate: new Date(date),
      frequencyDays: parseInt(frequencyDays),
      nextDoseDate: new Date(nextDoseDate),
    },
  });
};

export const updateMedicationEntry = async (
  id,
  medication,
  frequencyDays,
  nextDoseDate,
  date = new Date(),
) => {
  return await prisma.medication.update({
    where: { id: parseInt(id) },
    data: {
      medication: medication,
      lastDoseDate: new Date(date),
      frequencyDays: parseInt(frequencyDays),
      nextDoseDate: new Date(nextDoseDate),
    },
  });
};

export const deleteMedicationEntry = async (id) => {
  return await prisma.medication.delete({
    where: { id: parseInt(id) },
  });
};
