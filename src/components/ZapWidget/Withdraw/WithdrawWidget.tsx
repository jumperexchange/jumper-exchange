import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import type { ProjectData } from '../ZapWidget';
import { Breakpoint, useTheme } from '@mui/material';
import { WithdrawWidgetBox } from './WithdrawWidget.style';
import WidgetLikeField from '../WidgetLikeField/WidgetLikeField';
import BadgeWithChain from '@/components/ZapWidget/BadgeWithChain';

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
  const theme = useTheme();

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
