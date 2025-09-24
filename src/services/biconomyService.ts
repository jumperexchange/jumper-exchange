import {
  toMultichainNexusAccount,
  createMeeClient,
  signQuote,
  getMEEVersion,
  MEEVersion,
} from '@biconomy/abstractjs';
import { createWalletClient, http, custom } from 'viem';
import type { Hex, WalletClient } from 'viem';
import { chains } from 'src/const/chains/chains';

/**
 * Get viem chain by chain ID
 */
function getViemChainByChainId(chainId: number): any {
  const chain = Object.values(chains).find((chain) => chain.id === chainId);

  if (!chain) {
    throw new Error(`Chain ${chainId} not supported`);
  }

  return chain;
}

/**
 * Service for handling Biconomy operations on the frontend
 */
class BiconomyService {
  /**
   * Execute sweep using a pre-generated quote from the backend
   */
  async executeSweep(
    walletClient: WalletClient,
    provider: any,
    chainId: number,
    quote: any,
  ): Promise<string> {
    try {
      // Validate quote parameter
      if (!quote) {
        throw new Error('Quote parameter is undefined');
      }

      // Process quote to convert string values back to BigInt where needed
      const processValue = (value: any): any => {
        if (
          typeof value === 'string' &&
          /^\d+$/.test(value) &&
          value.length > 0
        ) {
          try {
            // Convert string numbers to BigInt
            return BigInt(value);
          } catch (e) {
            // If BigInt conversion fails, return original value
            return value;
          }
        } else if (typeof value === 'object' && value !== null) {
          if (Array.isArray(value)) {
            return value.map(processValue);
          } else {
            const processed: any = {};
            for (const [key, val] of Object.entries(value)) {
              processed[key] = processValue(val);
            }
            return processed;
          }
        }
        return value;
      };

      const processedQuote = processValue(quote);

      // Create chain configurations for the current chain
      const chain = getViemChainByChainId(chainId);
      const chainConfigurations = [
        {
          chain: chain,
          transport: custom(provider, { key: 'jumper-custom-sweep' }),
          version: getMEEVersion(MEEVersion.V2_1_0),
        },
      ];

      // Create nexus account for the wallet
      const nexusAccount = await toMultichainNexusAccount({
        signer: createWalletClient({
          account: walletClient.account?.address as Hex,
          chain: walletClient.chain,
          transport: custom(provider, { key: 'jumper-custom-sweep' }),
        }),
        chainConfigurations,
      });

      // Create MEE client
      const meeClient = await createMeeClient({
        account: nexusAccount,
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY || '',
      });

      // Execute the pre-generated quote (this will prompt for wallet signature)
      const result = await meeClient.executeQuote({
        quote: processedQuote,
      });

      return result.hash;
    } catch (error) {
      throw new Error(`Failed to execute sweep: ${(error as Error).message}`);
    }
  }
}

// Export singleton instance
export const biconomyService = new BiconomyService();
