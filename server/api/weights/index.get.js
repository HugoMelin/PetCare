import { requireAuth } from "~~/server/utils/auth";
import { getAllWeights } from "~~/server/utils/weights";

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const weights = await getAllWeights(event.context.session.user.id);
  return weights;
});
