import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { formatUnits } from 'viem';
import { ProjectData } from '../ZapWidget';
import { Breakpoint, useTheme } from '@mui/material';
import { WithdrawWidgetBox } from './WithdrawWidget.style';
import WidgetLikeField from '../WidgetLikeField/WidgetLikeField';

export interface WithdrawWidgetProps {
  token: TokenAmount;
  contractCalls?: ContractCall[];
  lpTokenDecimals: number;
  projectData: ProjectData;
  depositTokenData: any;
}

export const WithdrawWidget: React.FC<WithdrawWidgetProps> = ({
  token,
  lpTokenDecimals,
  projectData,
  depositTokenData,
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
            onVerify: () => Promise.resolve(true),
          },
        ]}
        label={`Redeem from Pool`}
        image={{
          url: token?.logoURI || '',
          name: token?.name || '',
        }}
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
