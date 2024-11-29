import { useReverseLookup } from '@bonfida/sns-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import type { Address, GetEnsNameReturnType } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
export interface UseENSSNSType {
  name?: GetEnsNameReturnType;
  isSuccess: boolean;
}

export const useENSSNS = (address: string | undefined): UseENSSNSType => {
  // SNS:
  // https://www.youtube.com/watch?v=MWz-Vt1SoFE
  // https://www.npmjs.com/package/@bonfida/sns-react

  // const wallet = useWallet();
  const { connection } = useConnection();
  // google: 4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC
  // https://sns-sdk-proxy.bonfida.workers.dev/reverse-lookup/4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC

  // alex: 4g91FFE76SzjTvx4bUcNUUFXWw9wYLwcKbaEayVg9bgC
  // https://sns-sdk-proxy.bonfida.workers.dev/reverse-lookup/4g91FFE76SzjTvx4bUcNUUFXWw9wYLwcKbaEayVg9bgC

  // returns null !!!
  const { result } = useReverseLookup(
    connection,
    new PublicKey('4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC'),
  );

  // console.log('REVERSE:', result);

  // const primaryDomain = usePrimaryDomain(
  //   connection,
  //   new PublicKey('HKKp49qGWXd639QsuH7JiLijfVW5UtCVY4s1n2HANwEA'),
  // );
  // console.log('testing sns...', primaryDomain?.result);

  // ENS:
  const { data: ensName, isSuccess } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });

  if (!ensName) {
    return { name: address, isSuccess: false };
  }

  return { name: ensName, isSuccess };
};
