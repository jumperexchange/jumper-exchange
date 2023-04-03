// TODO: hotfix until wallet-management v2 is released
// REMOVE AFTER WALLET MANAGEMENT V2 RELEASE

/* eslint-disable radix */
import type { Token } from '@lifi/sdk';
import {
  getChainById,
  MetaMaskProviderErrorCode,
  prefixChainId,
} from '@lifi/sdk';
import { supportedWallets } from '@lifi/wallet-management';
import type { TallyHo } from '@lifi/wallet-management/connectors/tallyho';
import type { WalletConnect } from '@lifi/wallet-management/connectors/walletConnect';

const getAppropriateProvider = () => {
  const walletConnect = supportedWallets.find(
    (wallet) => wallet.name === 'Wallet Connect',
  );
  const tallyho = supportedWallets.find((wallet) => wallet.name === 'Tally Ho');
  console.log(tallyho);
  console.log(walletConnect);

  let provider: any;
  if ((walletConnect?.web3react?.connector as WalletConnect)?.isCurrentlyUsed) {
    provider = (walletConnect?.web3react.connector as WalletConnect)
      .walletConnectProvider;
  } else if ((tallyho?.web3react?.connector as TallyHo)?.isCurrentlyUsed) {
    const { tally } = window as any;
    provider = tally;
  } else {
    const { ethereum } = window as any;
    provider = ethereum;
  }
  return provider;
};

export const switchChain = async (chainId: number): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const provider: any = getAppropriateProvider();
    if (!provider) {
      resolve(false);
    }
    try {
      provider
        .request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: getChainById(chainId).metamask?.chainId }],
        })
        .catch((error: any) => {
          if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
            addChain(chainId).then((result) => resolve(result));
          } else {
            reject(error);
          }
        });
      provider.once('chainChanged', (id: string) => {
        if (parseInt(id) === chainId) {
          resolve(true);
        }
      });
    } catch (error: any) {
      // const ERROR_CODE_UNKNOWN_CHAIN = 4902
      if (error.code !== MetaMaskProviderErrorCode.userRejectedRequest) {
        addChain(chainId).then((result) => resolve(result));
      } else {
        console.error(error);
        resolve(false);
      }
    }
  });
};

export const addChain = async (chainId: number) => {
  const provider: any = getAppropriateProvider();

  if (!provider) {
    return false;
  }

  const params = getChainById(chainId).metamask;
  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });
    return true;
  } catch (error: any) {
    console.error(`Error adding chain ${chainId}: ${error.message}`);
  }
  return false;
};

export const addToken = async (token: Token) => {
  const provider: any = getAppropriateProvider();

  if (!provider) {
    return false;
  }
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await provider.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: token.address, // The address that the token is at.
          symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: token.decimals, // The number of decimals in the token
          image: token.logoURI, // A string url of the token logo
        },
      },
    });
    return wasAdded;
  } catch (error) {
    console.error(error);
  }
  return false;
};

export const switchChainAndAddToken = async (chainId: number, token: Token) => {
  const provider: any = getAppropriateProvider();

  if (!provider) {
    return;
  }
  const chainIdPrefixed = prefixChainId(chainId);

  if (chainIdPrefixed !== provider.chainId) {
    await switchChain(chainId);
    provider.once('chainChanged', async (id: string) => {
      if (parseInt(id, 10) === chainId) {
        await addToken(token);
      }
    });
  } else {
    await addToken(token);
  }
};
