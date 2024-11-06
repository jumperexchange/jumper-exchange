import type { Address } from 'viem';
import {
  createPublicClient,
  erc4626Abi,
  getContract,
  http,
  isAddress,
} from 'viem';
import { BigNumber, ethers } from 'ethers';

import {
  Abi as ZodAbi,
  SolidityAddress as ZodSolidityAddress,
  SolidityString as ZodSolidityString,
  SolidityInt as ZodSolidityInt,
  SolidityBytes as ZodSolidityBytes,
  SolidityBool as ZodSolidityBool,
  SolidityArray as ZodSolidityArray,
} from 'abitype/zod';
import { getChain } from './get-chain-all';
import { RPC_API_KEYS } from '../constants';

export const isAbiValid = (value: string) => {
  try {
    const parsedJson = JSON.parse(value);
    return ZodAbi.parse(parsedJson);
  } catch (error) {
    return false;
  }
};

/// Solidity Array Checker

export const isSolidityArrayType = (type: string) => {
  try {
    ZodSolidityArray.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

/// Solidity Array Checker

/// Solidity Address Validators

export const isSolidityAddressType = (type: string) => {
  try {
    ZodSolidityAddress.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityAddressValid = (
  type: string,
  value: string | undefined | null,
) => {
  if (!value) {
    return false;
  }
  return isAddress(value);
};

export const isSolidityAddressArrayType = (type: string) => {
  try {
    const baseType = type.replace('[]', '');

    return isSolidityAddressType(baseType);
  } catch (error) {
    return false;
  }
};

export const isSolidityAddressArrayValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }

    const baseType = type.replace('[]', '');
    const values = value.split(',');

    return values.every((v) => isSolidityAddressValid(baseType, v));
  } catch (error) {
    return false;
  }
};

export const refineSolidityAddress = (type: string, value: string) => {
  const refinedValue = value.trim().toLowerCase();
  return refinedValue as Address;
};

export const refineSolidityAddressArray = (type: string, value: string) => {
  const values = value.split(',');
  const refinedValues = values.map((v) => refineSolidityAddress(type, v));
  return refinedValues as Address[];
};

/// Solidity Address Validators

/// Solidity Int Validators

export const isSolidityIntType = (type: string) => {
  try {
    ZodSolidityInt.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityIntValid = (type: string, value: string | undefined) => {
  try {
    if (!value) {
      return false;
    }
    const trimmedValue = value.trim();
    ethers.utils.defaultAbiCoder.encode([type], [trimmedValue]);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityIntArrayType = (type: string) => {
  try {
    const baseType = type.replace('[]', '');
    return isSolidityIntType(baseType);
  } catch (error) {
    return false;
  }
};

export const isSolidityIntArrayValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }

    const baseType = type.replace('[]', '');
    const values = value.split(',');

    return values.every((v) => isSolidityIntValid(baseType, v));
  } catch (error) {
    return false;
  }
};

export const refineSolidityInt = (type: string, value: string) => {
  const refinedValue = value.trim();
  return refinedValue as string;
};

export const refineSolidityIntArray = (type: string, value: string) => {
  const baseType = type.replace('[]', '');
  const values = value.split(',');
  const encodedValues = values.map((v) => refineSolidityInt(baseType, v));

  return encodedValues as string[];
};

/// Solidity Int Validators

/// Solidity Bool Validators

export const isSolidityBoolType = (type: string) => {
  try {
    ZodSolidityBool.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityBoolValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }

    const trimmedValue = value.trim().toLowerCase();

    return (
      trimmedValue === 'true' ||
      trimmedValue === 'false' ||
      trimmedValue === '0' ||
      trimmedValue === '1'
    );
  } catch (error) {
    return false;
  }
};

export const isSolidityBoolArrayType = (type: string) => {
  try {
    const baseType = type.replace('[]', '');
    return isSolidityBoolType(baseType);
  } catch (error) {
    return false;
  }
};

export const isSolidityBoolArrayValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }

    const values = value.split(',');

    return values.every((v) => isSolidityBoolValid(type, v));
  } catch (error) {
    return false;
  }
};

export const refineSolidityBool = (type: string, value: string) => {
  let currentBool = value.trim().toLowerCase();
  let refinedValue: boolean = false;

  if (currentBool === 'true') {
    refinedValue = true;
  } else if (currentBool === 'false') {
    refinedValue = false;
  } else if (currentBool === '1') {
    refinedValue = true;
  } else if (currentBool === '0') {
    refinedValue = false;
  }

  return refinedValue;
};

export const refineSolidityBoolArray = (type: string, value: string) => {
  const values = value.split(',');
  const refinedValues = values.map((v) => refineSolidityBool(type, v));
  return refinedValues as boolean[];
};

/// Solidity Bool Validators

/// Solidity String Validators

export const isSolidityStringType = (type: string): boolean => {
  try {
    ZodSolidityString.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityStringValid = (
  type: string,
  value: string | undefined,
  noTrim: boolean = false,
): boolean => {
  try {
    if (!value) {
      return false;
    }

    if (!isSolidityStringType(type)) {
      throw new Error('Invalid type');
    }

    let trimmedValue = noTrim === false ? value.trim() : value;

    ethers.utils.defaultAbiCoder.encode([type], [trimmedValue]);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityStringArrayType = (type: string) => {
  try {
    const baseType = type.replace('[]', '');
    return isSolidityStringType(baseType);
  } catch (error) {
    return false;
  }
};

export const isSolidityStringArrayValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }
    const values = value.split(',');
    return values.every((v) => isSolidityStringValid(type, v));
  } catch (error) {
    return false;
  }
};

export const refineSolidityString = (
  type: string,
  value: string,
  noTrim: boolean = false,
) => {
  const refinedValue = noTrim === false ? value.trim() : value;
  return refinedValue;
};

export const refineSolidityStringArray = (type: string, value: string) => {
  const values = value.split(',');
  const refinedValues = values.map((v) => refineSolidityString(type, v));
  return refinedValues;
};

/// Solidity String Validators

/// Solidity Bytes Validators

export const isSolidityBytesType = (type: string) => {
  try {
    ZodSolidityBytes.parse(type);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityBytesValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }
    const trimmedValue = value.trim();
    ethers.utils.defaultAbiCoder.encode([type], [trimmedValue]);
    return true;
  } catch (error) {
    return false;
  }
};

export const isSolidityBytesArrayType = (type: string) => {
  try {
    const baseType = type.replace('[]', '');
    return isSolidityBytesType(baseType);
  } catch (error) {
    return false;
  }
};

export const isSolidityBytesArrayValid = (
  type: string,
  value: string | undefined,
) => {
  try {
    if (!value) {
      return false;
    }

    const baseType = type.replace('[]', '');
    const values = value.split(',');

    return values.every((v) => isSolidityBytesValid(baseType, v));
  } catch (error) {
    return false;
  }
};

export const refineSolidityBytes = (type: string, value: string): string => {
  const refinedValue = value.trim();
  return refinedValue as string;
};

export const refineSolidityBytesArray = (
  type: string,
  value: string,
): string[] => {
  const baseType = type.replace('[]', '');
  const values = value.split(',');
  const encodedValues = values.map((v) => refineSolidityBytes(baseType, v));
  return encodedValues as string[];
};

/// Solidity Bytes Validators

// export const isERC4626VaultAddressValid = async (
//   chain_id: number,
//   address: string | undefined
// ) => {
//   try {
//     if (!address) return false;
//     if (!isAddress(address)) return false;

//     const chain = getChain(chain_id);

//     const provider = new ethers.providers.JsonRpcProvider(
//       chain.rpcUrls.default.http[0]
//     );

//     const randomSigner = ethers.Wallet.createRandom().connect(provider);

//     const erc4626Functions = [
//       "asset()",
//       "totalAssets()",
//       "convertToShares(uint256)",
//       "convertToAssets(uint256)",
//       "maxDeposit(address)",
//       "maxMint(address)",
//       "maxWithdraw(address)",
//       "maxRedeem(address)",
//       "previewDeposit(uint256)",
//       "previewMint(uint256)",
//       "previewWithdraw(uint256)",
//       "previewRedeem(uint256)",
//       "deposit(uint256,address)",
//       "mint(uint256,address)",
//       "withdraw(uint256,address,address)",
//       "redeem(uint256,address,address)",
//     ];

//     const contract = new ethers.Contract(
//       address,
//       erc4626Functions.map((fn) => `function ${fn}`),
//       randomSigner
//     );

//     // Create an array of promises to call each function
//     const checks = erc4626Functions.map(async (fn) => {
//       const methodName = fn.split("(")[0]; // Extract function name
//       const method = contract[methodName];

//       if (typeof method !== "function") {
//         throw new Error(
//           `Method ${methodName} is not a function on the contract.`
//         );
//       }

//       // Call the method without arguments (assuming no state change functions are called)
//       await method();
//     });

//     // Run all function calls in parallel
//     await Promise.all(checks);

//     // If all function calls succeed, it's likely an ERC-4626 vault
//     return true;
//   } catch (error) {
//     console.log("error while checking vault validity", error);
//     return false;
//   }
// };

export const isERC4626VaultAddressValid = async (
  chain_id: number,
  address: string | undefined,
) => {
  try {
    if (!address) {
      return false;
    }
    if (!ethers.utils.isAddress(address)) {
      return false;
    }

    const chain = getChain(chain_id);

    const publicClient = createPublicClient({
      chain,
      transport: http(RPC_API_KEYS[chain_id]),
    });

    const contract = getContract({
      address: address as `0x${string}`,
      abi: erc4626Abi,
      client: publicClient,
    });

    const readOnlyMethods = ['asset', 'totalAssets'];

    // Call all the read-only methods in parallel
    const results = await Promise.all(
      readOnlyMethods.map(async (method) => {
        try {
          const result = await contract.read[method]();
          return { method, result };
        } catch (error) {
          // console.log(`Error calling ${method}:`, error);
          return { method, error };
        }
      }),
    );

    // Check if any of the methods resulted in an error
    const valid = results.every(({ error }) => !error);

    if (!valid) {
      // console.log("One or more required methods are missing or reverted");
      return false;
    }

    return true;
  } catch (error) {
    // console.log("Error while checking vault validity", error);
    return false;
  }
};
