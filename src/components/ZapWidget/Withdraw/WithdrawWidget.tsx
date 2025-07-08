import BadgeWithChain from '@/components/ZapWidget/BadgeWithChain';
import { type ContractCall, type TokenAmount } from '@lifi/widget';
import { formatUnits } from 'viem';
import WidgetLikeField from '../WidgetLikeField/WidgetLikeField';
import { WithdrawWidgetBox } from './WithdrawWidget.style';
import type { AbiFunction } from 'viem';
import { ProjectData } from 'src/types/questDetails';

export interface WithdrawWidgetProps {
  poolName?: string;
  token: TokenAmount;
  contractCalls?: ContractCall[];
  lpTokenDecimals: number;
  projectData: ProjectData;
  depositTokenData: number | bigint | undefined;
  refetchPosition: () => void;
  withdrawAbi?: AbiFunction;
}

export const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  poolName,
  token,
  lpTokenDecimals,
  projectData,
  depositTokenData,
  refetchPosition,
  withdrawAbi,
}) => {
  return (
    <WithdrawWidgetBox>
      <WidgetLikeField
        contractCalls={[
          {
            data: '0x',
            type: 'send',
            label: 'Redeem',
            // Deprecated
            onVerify: () => {
              return Promise.resolve(true);
            },
          },
        ]}
        refetch={refetchPosition}
        label={`Redeem from ${poolName || 'Pool'}`}
        token={token}
        image={
          token?.logoURI && (
            <BadgeWithChain
              chainId={projectData?.chainId}
              logoURI={token?.logoURI}
              alt={token?.name}
            />
          )
        }
        placeholder="0"
        helperText={{
          left: 'Available balance',
          right: depositTokenData
            ? formatUnits(BigInt(depositTokenData), lpTokenDecimals)
            : '0.00',
        }}
        balance={
          depositTokenData
            ? formatUnits(BigInt(depositTokenData), lpTokenDecimals)
            : '0.00'
        }
        projectData={projectData}
        writeDecimals={lpTokenDecimals}
        withdrawAbi={withdrawAbi}
      />
    </WithdrawWidgetBox>
  );
};
