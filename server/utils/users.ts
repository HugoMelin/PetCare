import type { Prisma, PrismaClient } from "../../generated/prisma/client";
import { auth } from "~~/server/utils/auth";
import { prisma } from "./prisma";
import { getPetsOwnedByUserId, removePetOwner, switchPetCreator } from "./pets";

type PetWithOwners = {
  id: number;
  createdByUserId: string;
  owner: { id: string }[];
};

export const verifyUserPassword = async (headers: Headers, password: string | undefined) => {
  if (typeof password !== "string" || password.length === 0) {
    throw createError({
      statusCode: 400,
      message: "Mot de passe requis",
    });
  }
  
  return await auth.api.verifyPassword({
    body: {
      password: password
    },
    headers,
});
}

export const deleteUserService = async (userId: string) => {
  let step = "recherche de l’utilisateur";
  let petId: number | undefined;
  console.info("[deleteUserService] Début", { userId });
  try {
    const response = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Check if user exists
      const user = await tx.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        throw new Error("User not found");
      }
      console.info("[deleteUserService] Utilisateur trouvé", { userId });
  
      // Get pets owned by the user
      step = "chargement des animaux et propriétaires";
      const pets = await getPetsOwnedByUserId(userId, ["owner"], tx);
      console.info("[deleteUserService] Animaux chargés", { userId, count: pets.length });
  
      // Delete ownerShip for the pets owned by the user
      for (const pet of pets) {
        await removeUserFromPets(pet, userId, tx);
      }
  
      // Delete pet where no owner exists
      petId = undefined;
      step = "suppression des animaux sans propriétaire";
      const deletedPets = await deletePetsWithoutOwner(userId, tx);
      console.info("[deleteUserService] Animaux supprimés", { userId, count: deletedPets.count });
  
      step = "suppression de l’utilisateur";
      return await deleteUser(userId, tx);
    })
    console.info("[deleteUserService] Suppression terminée", { userId });
    return response;
  } catch (error) {
    console.error("[deleteUserService] Échec", { userId, step, petId }, error);
    const reason = error instanceof Error ? error.message : String(error);
    const petContext = petId !== undefined ? ` (animal ${petId})` : "";
    throw new Error(`Échec lors de ${step}${petContext} : ${reason}`, { cause: error });
  }
}

const removeUserFromPets = async (pet: PetWithOwners, userId: string, db: Prisma.TransactionClient | PrismaClient = prisma) => {
  let step = "lecture des propriétaires";

  try {
    const isOwner = pet.createdByUserId === userId;
    const nextOwner = pet.owner.find(owner => owner.id !== userId);

    if (isOwner && nextOwner) {
      step = "transfert du créateur";
      await switchPetCreator(pet.id, nextOwner?.id, db);
    }

    step = "retrait du propriétaire";
    await removePetOwner(pet.id, userId, db);
    console.info("[deleteUserService] Propriétaire retiré de l’animal", { userId, petId: pet.id });
  } catch (error) {
    throw new Error(
      `Échec lors de ${step} (animal ${pet.id})`,
      { cause: error }
    )
  }
}

const deletePetsWithoutOwner = async (userId: string, db: Prisma.TransactionClient | PrismaClient = prisma) => {
  return await db.pet.deleteMany({
    where: {
      createdByUserId: userId,
      owner: {
        none: {},
      },
    },
  });
}

const deleteUser = async (userId: string, db: Prisma.TransactionClient | PrismaClient = prisma) => {
  const response = await db.user.delete({
    where: { id: userId },
  });

  return response;
}
