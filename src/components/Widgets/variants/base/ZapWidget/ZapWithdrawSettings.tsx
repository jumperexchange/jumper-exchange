import { type ContractCall, useFieldActions } from '@lifi/widget';
import type { FC } from 'react';
import { useEffect } from 'react';

interface ZapWithdrawSettingsProps {
  fromChain: number;
  fromToken: string;
  contractCalls: ContractCall[];
}

// @Note unfortunately using the formRef did not provide the correct updates without the buildUrl set to true in the widget config
// So sticking with this solution for now
export const ZapWithdrawSettings: FC<ZapWithdrawSettingsProps> = ({
  fromChain,
  fromToken,
  contractCalls,
}) => {
  const { setFieldValue } = useFieldActions();

  useEffect(() => {
    setFieldValue('fromChain', fromChain, { isTouched: true });
    setFieldValue('fromToken', fromToken, { isTouched: true });
    setFieldValue('contractCalls', contractCalls ?? [], { isTouched: true });
  }, [setFieldValue, fromChain, fromToken, contractCalls]);

  return null;
};
