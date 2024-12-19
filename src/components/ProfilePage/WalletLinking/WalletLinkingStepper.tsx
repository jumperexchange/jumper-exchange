import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import Image from 'next/image';
import { Checked } from 'src/components/illustrations/Checked';
import { WalletLinkingStepBox } from './WalletLinkingStepper.style';

const steps = [
  <WalletLinkingStepBox>
    <Image
      src={'/chain-icon-eth-edit-min.svg'}
      width={64}
      height={64}
      alt="Ethereum logo"
    />
    <Typography variant="bodySmall">Sign with EVM</Typography>
  </WalletLinkingStepBox>,
  <WalletLinkingStepBox>
    <Image
      src={'/chain-icon-sol-edit-min.svg'}
      width={64}
      height={64}
      alt="Ethereum logo"
    />
    <Typography variant="bodySmall">Sign with Solana</Typography>
  </WalletLinkingStepBox>,
  <WalletLinkingStepBox>
    <Checked />
    <Typography variant="bodySmall">Verify signatures</Typography>
  </WalletLinkingStepBox>,
];

interface WalletLinkingStepperProps {
  step: number;
  maxSteps: number;
  onClick?: () => void;
  completed: boolean;
}

export default function WalletLinkingStepper({
  step,
  onClick,
  completed,
}: WalletLinkingStepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={step}>
        {steps.map((label, index) => (
          <Step key={`step-${index}`} completed={completed}>
            {label}
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
