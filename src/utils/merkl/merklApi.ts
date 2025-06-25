import { MerklApi } from '@merkl/api';

export const MERKL_API = 'https://api.merkl.xyz';
export const MERKL_CACHE_TIME = 1000 * 60 * 60; // 1 hour
export const MERKL_STALE_TIME = 1000 * 60 * 5; // 5 minutes

// Instantiate the API client once at the top
export const merklApi = MerklApi(MERKL_API).v4;
export const MERKL_CLAIMING_ADDRESS =
  '0x3Ef3D8bA38EBe18DB133cEc108f4D14CE00Dd9Ae';
