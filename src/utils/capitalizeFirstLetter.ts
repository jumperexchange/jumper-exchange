export const capitalizeFirstLetter = (text: string | undefined) => {
  return text !== undefined && text.charAt(0).toUpperCase() + text.slice(1);
};
