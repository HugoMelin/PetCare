import { deleteWeightEntry } from '~~/server/utils/weights';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  
  if (!id) return { error: 'Weight entry ID is required' };

  return deleteWeightEntry(id);
});