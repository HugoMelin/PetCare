import { prisma } from "./prisma";

/**
 * @typedef {import("../../generated/prisma/client").Prisma.TransactionClient} DbClient
 */

export const getPetsByUserId = async (userId) => {
  return await prisma.pet.findMany({
    where: { createdByUserId: userId },
  });
};

/**
 * @param {string} userId
 * @param {Array<string>} populate - Array of fields to populate
 * @param {DbClient} db - Prisma client instance
 * @returns {Promise<import("../../generated/prisma/client").Prisma.PetGetPayload<{ include: { owner: true } }>[] >}
 */
export const getPetsOwnedByUserId = async (userId, populate = [], db = prisma) => {
  return await db.pet.findMany({
    where: { owner: { some: { id: userId } } },
    include: {
      owner: populate.includes("owner"),
      weightEntries: populate.includes("weightEntries")
    }
  });
};

export const getPetById = async (petId) => {
  return await prisma.pet.findUnique({
    where: { id: parseInt(petId) },
    include: {
      weightEntries: {
        orderBy: { date: "desc" },
      },
      medications: true,
      owner: true,
    },
  });
};

export const getPetOwners = async (petId) => {
  const pet = await prisma.pet.findUnique({
    where: { id: parseInt(petId) },
    include: {
      owner: true,
    },
  });

  return pet ? pet.owner : [];
};

export const createPet = async (payload) => {
  const { name, type, birthdate, breed, userId } = payload;

  return await prisma.pet.create({
    data: {
      name: name,
      type: type || undefined,
      birthdate: birthdate ? new Date(birthdate) : null,
      breed: breed || null,
      createdByUserId: userId,
      owner: {
        connect: { id: userId },
      },
    },
  });
};

export const updatePet = async (petId, payload) => {
  const { name, type, birthdate, breed } = payload;

  return await prisma.pet.update({
    where: { id: parseInt(petId) },
    data: {
      name: name !== undefined ? name : undefined,
      type: type !== undefined ? type : undefined,
      birthdate: birthdate !== undefined ? new Date(birthdate) : undefined,
      breed: breed !== undefined ? breed : undefined,
    },
  });
};

export const deletePet = async (petId) => {
  return await prisma.pet.delete({
    where: { id: parseInt(petId) },
  });
};

export const isUserPetCreator = async (userId, petId) => {
  const pet = await prisma.pet.findFirst({
    where: {
      id: parseInt(petId),
      createdByUserId: userId,
    },
  });

  return !!pet;
};

export const isUserPetOwner = async (userId, petId) => {
  const pet = await prisma.pet.findFirst({
    where: {
      id: parseInt(petId),
      OR: [{ createdByUserId: userId }, { owner: { some: { id: userId } } }],
    },
  });

  return !!pet;
};

export const addPetOwners = async (petId, newOwnerEmail) => {
  const user = await prisma.user.findUnique({
    where: { email: newOwnerEmail },
  });

  if (!user) {
    throw new Error("Utilisateur non trouvé");
  }

  const res = await prisma.pet.update({
    where: { id: parseInt(petId) },
    data: {
      owner: {
        connect: { email: newOwnerEmail },
      },
    },
  });

  if (!res) {
    throw new Error("Échec de l'ajout du propriétaire");
  }

  return user;
};

export const removePetOwner = async (petId, ownerUserId, db = prisma) => {
  return await db.pet.update({
    where: { id: parseInt(petId) },
    data: {
      owner: {
        disconnect: { id: ownerUserId },
      },
    },
  });
};

export const switchPetCreator = async (petId, newCreatorUserId, db = prisma) => {
  return await db.pet.update({
    where: { id: parseInt(petId) },
    data: {
      createdByUserId: newCreatorUserId,
    },
  });
};
