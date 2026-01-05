import { getAllWeights } from "~~/server/utils/weights";

export default defineEventHandler(async () => {
  const weights = await getAllWeights();
  return weights;
});
