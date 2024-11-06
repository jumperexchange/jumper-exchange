import { ContractAddresses } from './contract-addresses';
import { ContractAbis } from './contract-abis';
import { NULL_ADDRESS } from '../../constants';
import { erc20Abi, erc4626Abi } from 'viem';

export const Contracts = {
  WrappedVault: {
    address: ContractAddresses.WrappedVault,
    abi: ContractAbis.WrappedVault,
  },
  WrappedVaultFactory: {
    address: ContractAddresses.WrappedVaultFactory,
    abi: ContractAbis.WrappedVaultFactory,
  },
  PointsFactory: {
    address: ContractAddresses.PointsFactory,
    abi: ContractAbis.PointsFactory,
  },
  RecipeMarketHub: {
    address: ContractAddresses.RecipeMarketHub,
    abi: ContractAbis.RecipeMarketHub,
  },
  VaultMarketHub: {
    address: ContractAddresses.VaultMarketHub,
    abi: ContractAbis.VaultMarketHub,
  },
  WeirollWallet: {
    address: ContractAddresses.WeirollWallet,
    abi: ContractAbis.WeirollWallet,
  },
  Erc20: {
    address: NULL_ADDRESS,
    abi: erc20Abi,
  },
  Erc4626: {
    address: NULL_ADDRESS,
    abi: erc4626Abi,
  },
  WeirollWalletHelper: {
    address: ContractAddresses.WeirollWalletHelper,
    abi: ContractAbis.WeirollWalletHelper,
  },
};
