import { type ContractCall, useFieldActions } from '@lifi/widget';
import type { FC } from 'react';
import { useEffect } from 'react';

interface ZapDepositSettingsProps {
  toChainId: number;
  toTokenAddress: string;
  contractCalls: ContractCall[];
}

// @Note unfortunately using the formRef did not provide the correct updates without the buildUrl set to true in the widget config
// So sticking with this solution for now
export const ZapDepositSettings: FC<ZapDepositSettingsProps> = ({
  toChainId,
  toTokenAddress,
  contractCalls,
}) => {
  const { setFieldValue } = useFieldActions();

  useEffect(() => {
    setFieldValue('toChain', toChainId, { isTouched: true });
    setFieldValue('toToken', toTokenAddress, { isTouched: true });
    setFieldValue('contractCalls', contractCalls ?? [], { isTouched: true });
  }, [setFieldValue, toChainId, toTokenAddress, contractCalls]);

  return null;
};
