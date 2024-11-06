import { ContractMap } from "../contracts";
import { isSolidityAddressValid } from "../utils";

export const useCreateVaultMarket = ({
  chainId = 0,
  frontendFee,
  vaultAddress,
  vaultOwner,
  vaultName,
}: {
  chainId: number;
  frontendFee: string;
  vaultAddress: string | undefined | null;
  vaultOwner: string | undefined | null;
  vaultName: string;
}) => {
  // Check is market is ready to be created
  let isReady = false;

  // Options to pass to writeContract()
  let writeContractOptions = null;

  // Get smart contract
  const WrappedVaultFactory =
    ContractMap[chainId as keyof typeof ContractMap]?.WrappedVaultFactory ??
    undefined;

  // Check arguments
  const isVaultAddressValid = isSolidityAddressValid("address", vaultAddress);
  const isVaultOwnerValid = isSolidityAddressValid("address", vaultOwner);

  // If all data is ready, set isReady to true and set writeContractOptions
  if (WrappedVaultFactory && isVaultAddressValid && isVaultOwnerValid) {
    isReady = true;

    writeContractOptions = {
      address: WrappedVaultFactory.address,
      abi: WrappedVaultFactory.abi,
      functionName: "wrapVault",
      args: [
        vaultAddress,
        vaultOwner,
        vaultName,
        frontendFee, // 1e18 = 100%
      ],
    };
  }

  return {
    isReady,
    writeContractOptions,
  };
};
