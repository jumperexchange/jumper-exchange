export const buildURL = (url: string, params?: Record<string, any>): URL => {
  const urlObj = new URL(url);
  params = new URLSearchParams(params);
  urlObj.search = params.toString();
  return urlObj;
};
