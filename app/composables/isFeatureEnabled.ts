/** À appeler dans setup ; le résultat SSR est réutilisé pendant l’hydratation. */
export const isFeatureEnabled = (key: string) => {
  return useAsyncData(
    `feature:${key}`,
    async () => {
      const response = await $fetch<{ enabled: boolean }>(
        `/api/public/features/${encodeURIComponent(key)}`,
      );

      // Un objet transfère aussi un état désactivé dans le payload SSR.
      return { enabled: response.enabled };
    },
    { default: () => ({ enabled: false }) },
  );
};
