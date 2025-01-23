import BadgeWithChain from '@/components/ZapWidget/BadgeWithChain';
import { type ContractCall, type TokenAmount } from '@lifi/widget';
import { formatUnits } from 'viem';
import WidgetLikeField from '../WidgetLikeField/WidgetLikeField';
import type { ProjectData } from '../ZapWidget';
import { WithdrawWidgetBox } from './WithdrawWidget.style';

export interface WithdrawWidgetProps {
  token: TokenAmount;
  contractCalls?: ContractCall[];
  lpTokenDecimals: number;
  projectData: ProjectData;
  depositTokenData: any;
  refetchPosition: () => void;
}

export const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  token,
  lpTokenDecimals,
  projectData,
  depositTokenData,
  refetchPosition,
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
        label={`Redeem from Pool`}
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
            ? formatUnits(depositTokenData, lpTokenDecimals)
            : '0.00',
        }}
        balance={
          depositTokenData
            ? formatUnits(depositTokenData, lpTokenDecimals)
            : '0.00'
        }
        projectData={projectData}
        writeDecimals={lpTokenDecimals}
      />
    </WithdrawWidgetBox>
  );
};
