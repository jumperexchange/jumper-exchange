interface AddressValidation {
  isValid: boolean;
  addressType?: 'EVM' | 'SVM';
}

function isValidEVMAddress(address: string): boolean {
  // Check if address is a string and not empty
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Check if it matches the EVM address pattern
  // - Starts with 0x
  // - Followed by 40 hexadecimal characters (20 bytes)
  // - Case insensitive
  const evmAddressRegex = /^0x[a-fA-F0-9]{40}$/;

  return evmAddressRegex.test(address);
}

function isValidSVMAddress(address: string): boolean {
  // Check if address is a string and not empty
  if (!address || typeof address !== 'string') {
    return false;
  }

  // Solana addresses:
  // - Are base58 encoded
  // - Typically 32-44 characters long
  // - Contain only base58 characters (1-9, A-H, J-N, P-Z, a-k, m-z)
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

  return base58Regex.test(address);
}

export function isValidEvmOrSvmAddress(value: string): AddressValidation {
  // Split the URL into its components
  if (isValidEVMAddress(value)) {
    return {
      isValid: true,
      addressType: 'EVM',
    };
  } else if (isValidSVMAddress(value)) {
    return {
      isValid: true,
      addressType: 'SVM',
    };
  }

  return { isValid: false };
}
