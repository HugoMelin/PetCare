import type { Prisma, PrismaClient } from "../../generated/prisma/client";
import { prisma } from "./prisma";
import { getPetsOwnedByUserId, removePetOwner, switchPetCreator } from "./pets";

type PetWithOwners = {
  id: number;
  createdByUserId: string;
  owner: { id: string }[];
};

export const petsCleaner = async (userId: string) => {
  let step = "recherche de l’utilisateur";
  console.info("[petsCleaner] Début", { userId });
  try {
    const response = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        // Check if user exists
        const user = await tx.user.findUnique({
          where: { id: userId },
        });

        if (!user) {
          throw new Error("User not found");
        }
        console.info("[petsCleaner] Utilisateur trouvé", { userId });

        // Get pets owned by the user
        step = "chargement des animaux et propriétaires";
        const pets = await getPetsOwnedByUserId(userId, ["owner"], tx);
        console.info("[petsCleaner] Animaux chargés", {
          userId,
          count: pets.length,
        });

        // Delete ownerShip for the pets owned by the user
        for (const pet of pets) {
          await removeUserFromPets(pet, userId, tx);
        }

        // Delete pet where no owner exists
        step = "suppression des animaux sans propriétaire";
        const deletedPets = await deletePetsWithoutOwner(userId, tx);
        console.info("[petsCleaner] Animaux supprimés", {
          userId,
          count: deletedPets.count,
        });

        return true;
      },
    );
    console.info("[petsCleaner] Nettoyage des animaux terminé", { userId });
    return response;
  } catch (error) {
    console.error("[petsCleaner] Échec", { userId, step }, error);
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Échec lors de ${step} : ${reason}`, {
      cause: error,
    });
  }
};

const removeUserFromPets = async (
  pet: PetWithOwners,
  userId: string,
  db: Prisma.TransactionClient | PrismaClient = prisma,
) => {
  let step = "lecture des propriétaires";

  try {
    const isOwner = pet.createdByUserId === userId;
    const nextOwner = pet.owner.find((owner) => owner.id !== userId);

    if (isOwner && nextOwner) {
      step = "transfert du créateur";
      await switchPetCreator(pet.id, nextOwner?.id, db);
    }

    step = "retrait du propriétaire";
    await removePetOwner(pet.id, userId, db);
    console.info("[petsCleaner] Propriétaire retiré de l’animal", {
      userId,
      petId: pet.id,
    });
  } catch (error) {
    throw new Error(`Échec lors de ${step} (animal ${pet.id})`, {
      cause: error,
    });
  }
};

const deletePetsWithoutOwner = async (
  userId: string,
  db: Prisma.TransactionClient | PrismaClient = prisma,
) => {
  return await db.pet.deleteMany({
    where: {
      createdByUserId: userId,
      owner: {
        none: {},
      },
    },
  });
};
