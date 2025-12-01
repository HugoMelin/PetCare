import { prisma } from '../utils/prisma';

export default defineEventHandler(async () => {
  const dogs = await prisma.dog.findMany();
  return dogs;
});