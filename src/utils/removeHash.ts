export function removeHash(str: string) {
  if (str.startsWith('#')) {
    return str.substring(1);
  }
  return str;
}
