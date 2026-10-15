import type { AdminDashboardStats } from "~~/shared/types/admin-dashboard";
import { requireAuth } from "../../utils/auth";
import { prisma } from "../../utils/prisma";

export default defineEventHandler(
  async (event): Promise<AdminDashboardStats> => {
    const session = await requireAuth(event);
    if (!session.user.role?.split(",").includes("admin")) {
      throw createError({ statusCode: 403, statusMessage: "Forbidden" });
    }
    setResponseHeader(event, "Cache-Control", "private, no-store");

    const [
      users,
      pets,
      medications,
      weights,
      treatedPets,
      species,
      topMedications,
    ] = await prisma.$transaction([
      prisma.user.findMany({
        select: { _count: { select: { petsOwned: true } } },
      }),
      prisma.pet.count(),
      prisma.medication.count(),
      prisma.weightEntry.count(),
      prisma.pet.count({ where: { medications: { some: {} } } }),
      prisma.pet.groupBy({
        by: ["type"],
        _count: { _all: true },
        orderBy: { _count: { type: "desc" } },
      }),
      prisma.medication.groupBy({
        by: ["medication"],
        _count: { _all: true },
        orderBy: { _count: { medication: "desc" } },
        take: 5,
      }),
    ]);

    const ownership = [
      { label: "Aucun animal", value: 0 },
      { label: "1 animal", value: 0 },
      { label: "2 animaux", value: 0 },
      { label: "3 animaux ou plus", value: 0 },
    ];
    for (const user of users) {
      ownership[Math.min(user._count.petsOwned, 3)]!.value++;
    }

    return {
      totals: { users: users.length, pets, medications, weights },
      ownership,
      species: species.map((item) => ({
        label: item.type || "Non renseigné",
        value: item._count._all,
      })),
      medicationCoverage: [
        { label: "Avec traitement", value: treatedPets },
        { label: "Sans traitement", value: pets - treatedPets },
      ],
      topMedications: topMedications.map((item) => ({
        label: item.medication,
        value: item._count._all,
      })),
    };
  },
);
