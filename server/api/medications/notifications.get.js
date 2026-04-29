import { getAllMedicationsNotifications } from "~~/server/utils/medicationsNotfications";

export default defineEventHandler(async () => {
  const result = await getAllMedicationsNotifications();

  return result;
});
