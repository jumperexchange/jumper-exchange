import {
  type ContractCall,
  type TokenAmount,
  useFieldActions,
} from '@lifi/widget';
import { Avatar, Box, Chip, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import WidgetLikeField from 'src/components/Zap/WidgetLikeField/WidgetLikeField';
import { formatUnits } from 'viem';
import { ProjectData } from '../ZapWidget';
import { Breakpoint, useTheme } from '@mui/material';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        [theme.breakpoints.down('md' as Breakpoint)]: {
          minWidth: 316,
          maxWidth: 316,
        },
        [theme.breakpoints.up('md' as Breakpoint)]: {
          minWidth: 416,
          maxWidth: 416,
        },
      }}
    >
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
    </Box>
  );
};
