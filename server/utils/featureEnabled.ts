export const isFeatureEnabled = async (key: string): Promise<{key: string; enabled: boolean}> => {
  const feature = await prisma.feature.findUnique({
    where: { key },
    select: { 
      enabled: true,
      enabledAt: true,
    },
  });

  const now = new Date();
  const enabledAt = feature?.enabledAt ? new Date(feature.enabledAt) : now;

  // return new Date(enabledAt) <= new Date();

  return { 
    "key" : key,
    "enabled" : feature?.enabled && enabledAt
      ? new Date(enabledAt) <= new Date() 
      : false
  };
}