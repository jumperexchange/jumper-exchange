/**
 * EIP-1193 compliant provider for the Jumper Internal Wallet.
 *
 * Wraps a local HD wallet for signing operations.
 * Delegates read operations to the chain's JSON-RPC endpoint.
 *
 * The wallet reference is controlled externally by the connector:
 * - Set after password verification for signing
 * - Nulled after signing or session expiry
 */
import { type LocalAccount } from 'viem/accounts';
import { type EIP1193RequestFn, hexToNumber, numberToHex } from 'viem';

export interface JumperWalletProviderOptions {
  address: `0x${string}`;
  chainId: number;
  rpcUrl: string;
}

export interface JumperWalletEIP1193Provider {
  request: EIP1193RequestFn;
  setAccount: (account: LocalAccount | null) => void;
  setChain: (chainId: number, rpcUrl: string) => void;
  on: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (
    event: string,
    listener: (...args: unknown[]) => void,
  ) => void;
  emit: (event: string, ...args: unknown[]) => void;
}

export function createJumperWalletProvider(
  options: JumperWalletProviderOptions,
): JumperWalletEIP1193Provider {
  let account: LocalAccount | null = null;
  let currentChainId = options.chainId;
  let currentRpcUrl = options.rpcUrl;
  const listeners = new Map<string, Set<(...args: unknown[]) => void>>();

  const request = async ({
    method,
    params,
  }: {
    method: string;
    params?: unknown;
  }) => {
    switch (method) {
      case 'eth_chainId':
        return numberToHex(currentChainId);

      case 'eth_accounts':
      case 'eth_requestAccounts':
        return [options.address];

      case 'personal_sign': {
        if (!account) {
          throw new Error('Wallet locked. Please enter your password.');
        }
        const [message] = params as [string, string];
        const messageBytes =
          typeof message === 'string' && message.startsWith('0x')
            ? { raw: message as `0x${string}` }
            : message;
        return account.signMessage({ message: messageBytes });
      }

      case 'eth_signTypedData_v4': {
        if (!account) {
          throw new Error('Wallet locked. Please enter your password.');
        }
        const [, typedDataJson] = params as [string, string];
        const typedData = JSON.parse(typedDataJson);
        const { EIP712Domain: _, ...types } = typedData.types;
        return account.signTypedData({
          domain: typedData.domain,
          types,
          primaryType: typedData.primaryType,
          message: typedData.message,
        });
      }

      case 'eth_sendTransaction': {
        if (!account) {
          throw new Error('Wallet locked. Please enter your password.');
        }
        // For sending transactions, we need to sign and broadcast via RPC
        const [txParams] = params as [Record<string, unknown>];

        // Sign the transaction
        const serializedTx = await account.signTransaction({
          ...txParams,
          chainId: currentChainId,
          type: txParams.type as 'legacy' | 'eip1559' | 'eip2930' | undefined,
        } as Parameters<LocalAccount['signTransaction']>[0]);

        // Broadcast via RPC
        return rpcRequest('eth_sendRawTransaction', [serializedTx]);
      }

      case 'wallet_switchEthereumChain': {
        const [{ chainId: newChainIdHex }] = params as [{ chainId: string }];
        currentChainId = hexToNumber(newChainIdHex as `0x${string}`);
        return null;
      }

      default:
        // Delegate read operations to JSON-RPC
        return rpcRequest(method, params as unknown[]);
    }
  };

  async function rpcRequest(
    method: string,
    params?: unknown[],
  ): Promise<unknown> {
    const response = await fetch(currentRpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method,
        params: params ?? [],
      }),
    });
    const json = await response.json();
    if (json.error) {
      throw new Error(json.error.message);
    }
    return json.result;
  }

  return {
    request: request as EIP1193RequestFn,

    setAccount(newAccount: LocalAccount | null) {
      account = newAccount;
    },

    setChain(chainId: number, rpcUrl: string) {
      currentChainId = chainId;
      currentRpcUrl = rpcUrl;
    },

    on(event: string, listener: (...args: unknown[]) => void) {
      if (!listeners.has(event)) {
        listeners.set(event, new Set());
      }
      listeners.get(event)!.add(listener);
    },

    removeListener(event: string, listener: (...args: unknown[]) => void) {
      listeners.get(event)?.delete(listener);
    },

    emit(event: string, ...args: unknown[]) {
      listeners.get(event)?.forEach((listener) => listener(...args));
    },
  };
}
