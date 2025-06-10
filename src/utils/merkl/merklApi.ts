import { MerklApi } from '@merkl/api';

export const MERKL_API = 'https://api.merkl.xyz';
export const CACHE_TIME = 1000 * 60 * 60; // 1 hour
export const STALE_TIME = 1000 * 60 * 5; // 5 minutes

// Instantiate the API client once at the top
export const merklApi = MerklApi(MERKL_API).v4;
