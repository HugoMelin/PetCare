import { auth } from '../../utils/auth.ts';

export default defineEventHandler((event) => {
  return auth.handler(toWebRequest(event));
});