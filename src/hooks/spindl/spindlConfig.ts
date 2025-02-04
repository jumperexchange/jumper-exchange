export const getSpindlConfig = () => {
  if (
    !process.env.NEXT_PUBLIC_SPINDL_API_KEY ||
    !process.env.NEXT_PUBLIC_SPINDL_API_URL
  ) {
    return;
  }
  return {
    apiUrl: process.env.NEXT_PUBLIC_SPINDL_API_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-API-ACCESS-KEY': process.env.NEXT_PUBLIC_SPINDL_API_KEY,
    },
  };
};
