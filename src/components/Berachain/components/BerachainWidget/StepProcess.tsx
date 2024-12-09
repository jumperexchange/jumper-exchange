import { Box, TextField, Typography } from '@mui/material';
import {
  BerachainActionPledgeButton,
} from '@/components/Berachain/components/BerachainWidgetWip/BerachainWidgetWip.style';
import { Config, useConfig } from 'wagmi';
import { getConnectorClient } from 'wagmi/actions';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import type { Account, Chain, Client, Transport } from 'viem';
import { ContractCall } from '@lifi/sdk';
import { Step } from '@lifi/widget';
import WidgetLikeWIP, { getEthersSigner } from '@/components/Berachain/components/BerachainWidget/WidgetLikeWIP';
import { useProcessMessage } from '@lifi/widget/src/hooks/useProcessMessage';
import { useExplorer } from '@lifi/widget/dist/esm/hooks/useExplorer';
import CircularProgress from '@mui/material/CircularProgress';

function StepProcess({ step, process }) {
  const { title, message } = useProcessMessage(step, process)
  const { getTransactionLink } = useExplorer()

  return (
    <Box px={2} py={1}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <CircularProgress process={process} />
        <Typography
          mx={2}
          flex={1}
          fontSize={14}
          fontWeight={process.error ? 600 : 400}
        >
          {title}
        </Typography>
      </Box>
      {message ? (
        <Typography
          ml={7}
          fontSize={14}
          fontWeight={500}
          color="text.secondary"
        >
          {message}
        </Typography>
      ) : null}
    </Box>
  )
}

export default StepProcess;
