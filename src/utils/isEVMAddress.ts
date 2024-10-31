export function isEVMAddress(walletAddress?: string) {
  return walletAddress?.startsWith('0x') ?? false;
}
