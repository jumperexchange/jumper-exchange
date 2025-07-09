const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getFeatureFlag = async (feature: string, distinctId: string) => {
  const searchParams = new URLSearchParams();
  searchParams.set('key', feature);
  searchParams.set('distinctId', distinctId);

  const response = await fetch(
    `${apiBaseUrl}/posthog/feature-flag?${searchParams.toString()}`,
  );

  const resFormatted = await response.json();

  return !!resFormatted.data;
};
