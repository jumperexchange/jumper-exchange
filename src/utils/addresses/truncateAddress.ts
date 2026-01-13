export const truncateAddress = (
  address?: string,
  prefixLength: number = 7,
  suffixLength: number = 5,
) => {
  if (address) {
    return `${address.slice(0, prefixLength)}...${address.substring(address.length - suffixLength)}`;
  } else {
    return '';
  }
};
