import { type ContractCall, useFieldActions } from '@lifi/widget';
import { FC, useEffect } from 'react';

interface ZapDepositSettingsProps {
  toChain: string;
  toToken: string;
  contractCalls: ContractCall[];
}

// @Note unfortunately using the formRef did not provide the correct updates without the buildUrl set to true in the widget config
// So sticking with this solution for now
export const ZapDepositSettings: FC<ZapDepositSettingsProps> = ({
  toChain,
  toToken,
  contractCalls,
}) => {
  const { setFieldValue } = useFieldActions();

  useEffect(() => {
    setFieldValue('toChain', toChain, { isTouched: true });
    setFieldValue('toToken', toToken, { isTouched: true });
    setFieldValue('contractCalls', contractCalls ?? [], { isTouched: true });
  }, [setFieldValue, toChain, toToken, contractCalls]);

  return null;
};
