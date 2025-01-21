import ErrorIcon from '@mui/icons-material/Error';
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

interface WalletLinkingStepperProps {
  step: number;
  maxSteps: number;
  onClick?: () => void;
  evmCompleted?: boolean;
  solanaCompleted?: boolean;
  evmAndSvmCompleted?: boolean;
  startWalletsVerification?: boolean;
}

export default function WalletLinkingStepper({
  step,
  onClick,
  evmCompleted,
  solanaCompleted,
  evmAndSvmCompleted,
  startWalletsVerification,
}: WalletLinkingStepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        nonLinear
        activeStep={step}
        connector={<StepConnector />}
        sx={(theme) => ({
          ...(step !== 3 && {
            '& .MuiStepLabel-iconContainer.Mui-completed': {
              backgroundColor: theme.palette.white.main,
              svg: {
                color: theme.palette.grey[400],
              },
            },
            '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
              display: 'none',
            },
          }),
          ...(step === 3 && {
            '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
              ...(!startWalletsVerification && { display: 'none' }),
              backgroundColor: theme.palette.white.main,
              svg: {
                color: theme.palette.error.main,
              },
            },
          }),
        })}
      >
        <Step completed={evmCompleted}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={evmCompleted}
            className="step-button"
            icon={
              step === 3 &&
              !evmCompleted && <ErrorIcon sx={{ width: 32, height: 32 }} />
            }

            // icon={
            //   <CheckIcon
            //     width={24}
            //     height={24}
            //     sx={(theme) => ({ color: theme.palette.white.main })}
            //     color={evmCompleted ? 'primary' : 'disabled'}
            //   />
            // }
            // onClick={onClick}
          >
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
            </WalletLinkingStepBox>
          </StepButton>
        </Step>
        <Step completed={solanaCompleted}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={solanaCompleted}
            className="step-button"
            icon={
              step === 3 &&
              !solanaCompleted && <ErrorIcon sx={{ width: 32, height: 32 }} />
            }
            // onClick={onClick}
          >
            <WalletLinkingStepBox>
              <WalletLinkingStepImage
                src={'/chain-icon-sol.svg'}
                width={64}
                height={64}
                alt="Solana logo"
              />
              <WalletLinkingStepText variant="bodySmall">
                Sign with Solana
              </WalletLinkingStepText>
            </WalletLinkingStepBox>
          </StepButton>
        </Step>
        <Step completed={evmAndSvmCompleted}>
          <StepButton
            disableRipple={true}
            color="inherit"
            icon={
              step === 3 &&
              !evmAndSvmCompleted && (
                <ErrorIcon sx={{ width: 32, height: 32 }} />
              )
            }
            disabled={evmAndSvmCompleted}
            className="step-button"
            // onClick={onClick}
          >
            <WalletLinkingStepBox>
              <Checked />
              <WalletLinkingStepText variant="bodySmall">
                Verify signatures
              </WalletLinkingStepText>
            </WalletLinkingStepBox>
          </StepButton>
        </Step>
      </Stepper>
    </Box>
  );
}
