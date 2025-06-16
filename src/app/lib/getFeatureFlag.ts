const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

// @Note: Need to check how we need to handle the API call without a distinct id
// as we want to enable the feature flag globally and render the page on the server side.
export const getFeatureFlag = async (feature: string) => {
  const response = await fetch(
    `${apiBaseUrl}/posthog/feature-flag?key=${feature}`,
  );
  const resFormatted = await response.json();

  return !!resFormatted.data;
};
