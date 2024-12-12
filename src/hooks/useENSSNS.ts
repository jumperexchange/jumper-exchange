import { getAddressLabel } from 'src/utils/getAddressLabel';
import type { Address, GetEnsNameReturnType } from 'viem';
import { useEnsName } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { useBonfidaSNS } from './useBonfidaSNS';

export interface UseENSSNSType {
  name?: GetEnsNameReturnType;
  isSuccess: boolean;
  isError: boolean;
}

export const useENSSNS = (address: string | undefined): UseENSSNSType => {
  // SNS via bonfida´s sns-react package:
  // https://www.youtube.com/watch?v=MWz-Vt1SoFE
  // https://www.npmjs.com/package/@bonfida/sns-react

  // testing api endpoint -->
  // ✅ works as expected
  // google: 4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC
  // https://sns-sdk-proxy.bonfida.workers.dev/reverse-lookup/4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC

  // ✅ works as expected -->
  // alex: 4g91FFE76SzjTvx4bUcNUUFXWw9wYLwcKbaEayVg9bgC
  // https://sns-sdk-proxy.bonfida.workers.dev/reverse-lookup/4g91FFE76SzjTvx4bUcNUUFXWw9wYLwcKbaEayVg9bgC

  // ❌ testing sns-react --> fails
  // returns null !!! -->
  // const { result } = useReverseLookup(
  //   connection,
  //   new PublicKey('4SthxbjwRJGW4uugoA111j6NKjBye1pZb16y4PHZ3TZC'),
  // );

  // SNS via useQuery:
  const {
    data: snsName,
    isSuccess: isSuccessSns,
    isError: isErrorSns,
  } = useBonfidaSNS({
    walletAddress: address,
  });

  // ENS:
  const {
    data: ensName,
    isSuccess: isSuccessEns,
    isError: isErrorEns,
  } = useEnsName({
    address: address as Address | undefined,
    chainId: mainnet.id,
  });

  const label = getAddressLabel({
    isSuccess: isSuccessEns || isSuccessSns,
    name: snsName || ensName,
    address,
  });

  return {
    name: label,
    isSuccess: isSuccessSns || isSuccessEns,
    isError: isErrorSns && isErrorEns,
  };
};
