import {
  type DeFiReacherValidateHashResponse,
  getDeFiReacherValidateHash,
} from '@/app/lib/getDeFiReacherValidateHash';
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { type Hex } from 'viem';

type UseDeFiReacherValidateHashResult = UseMutationResult<
  DeFiReacherValidateHashResponse | null,
  Error,
  Hex
>;

export const useDeFiReacherValidateHash =
  (): UseDeFiReacherValidateHashResult => {
    return useMutation<DeFiReacherValidateHashResponse | null, Error, Hex>({
      mutationFn: (txHash: Hex) => getDeFiReacherValidateHash(txHash),
    });
  };
