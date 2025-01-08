import { StepButton, StepConnector } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { Checked } from 'src/components/illustrations/Checked';
import {
  WalletLinkingStepBox,
  WalletLinkingStepImage,
  WalletLinkingStepText,
} from './WalletLinkingStepper.style';

const steps = [
  <WalletLinkingStepBox>
    <WalletLinkingStepImage
      src={'/chain-icon-eth.svg'}
      width={64}
      height={64}
      alt="Ethereum logo"
    />
    <WalletLinkingStepText variant="bodySmall">
      Sign with EVM
    </WalletLinkingStepText>
  </WalletLinkingStepBox>,
  <WalletLinkingStepBox>
    <WalletLinkingStepImage
      src={'/chain-icon-sol.svg'}
      width={64}
      height={64}
      alt="Ethereum logo"
    />
    <WalletLinkingStepText variant="bodySmall">
      Sign with Solana
    </WalletLinkingStepText>
  </WalletLinkingStepBox>,
  <WalletLinkingStepBox>
    <Checked />
    <WalletLinkingStepText variant="bodySmall">
      Verify signatures
    </WalletLinkingStepText>
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
  // const classes = useStyles();

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        nonLinear
        activeStep={step}
        connector={<StepConnector />}
        sx={{
          '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
            display: 'none',
          },
        }}
      >
        {steps.map((label, index) => (
          <Step key={`step-${index}`} completed={completed}>
            <StepButton
              color="inherit"
              disabled={completed}
              className="step-button"
              onClick={onClick}
            >
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
