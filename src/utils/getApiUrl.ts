const getApiUrl = (): string => {
  const isBetaEnabled = window?.localStorage.getItem("use-beta")

  let apiUrl = process.env.NEXT_PUBLIC_LIFI_API_URL
  if (isBetaEnabled) {
    apiUrl = `${apiUrl}/beta`
  }

  return apiUrl;
};

export default getApiUrl;
