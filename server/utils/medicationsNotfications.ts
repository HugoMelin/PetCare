import { prisma } from "./prisma";

export const getAllMedicationsNotifications = async () => {
  const now = new Date();
  const sevenDaysFromNowStart = new Date(now);
  sevenDaysFromNowStart.setDate(sevenDaysFromNowStart.getDate() + 7);
  sevenDaysFromNowStart.setHours(0, 0, 0, 0);

  const sevenDaysFromNowEnd = new Date(sevenDaysFromNowStart);
  sevenDaysFromNowEnd.setDate(sevenDaysFromNowEnd.getDate() + 1);

  const medicationNotificationFilter = {
    OR: [
      {
        nextDoseDate: {
          lt: now,
        },
      },
      {
        nextDoseDate: {
          gte: sevenDaysFromNowStart,
          lt: sevenDaysFromNowEnd,
        },
      },
    ],
  };

  return await prisma.pet.findMany({
    where: {
      medications: {
        some: medicationNotificationFilter,
      },
    },
    include: {
      owner: {
        where: {
          wantsRemindersMails: true,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      medications: {
        where: medicationNotificationFilter,
      },
    },
  });
};

export const getUserMedicationNotifications = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      wantsRemindersMails: true,
    }
  });
}

export const updateUserReminderStatus = async (userId: string, status: boolean) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id: userId },
    data: { wantsRemindersMails: status },
  });
}