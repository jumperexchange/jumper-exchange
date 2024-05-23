function generateKey(pre: string) {
  return `${pre}_${Math.random().toString().substring(4)}`;
}

export default generateKey;
