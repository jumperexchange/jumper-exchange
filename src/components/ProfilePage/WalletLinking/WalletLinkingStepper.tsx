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
  evmSigned?: boolean;
  svmSigned?: boolean;
  evmVerified?: boolean;
  svmVerified?: boolean;
  evmAndSvmCompleted?: boolean;
  startWalletsVerification?: boolean;
}

export default function WalletLinkingStepper({
  step,
  maxSteps,
  onClick,
  evmSigned,
  svmSigned,
  evmVerified,
  svmVerified,
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
          ...(((step !== maxSteps && (evmSigned || svmSigned)) ||
            (step === maxSteps && (!evmVerified || !svmVerified))) && {
            '& .MuiStepLabel-iconContainer.Mui-completed': {
              backgroundColor: theme.palette.white.main,
              svg: {
                color: theme.palette.grey[400],
              },
            },
          }),
          ...(step !== maxSteps && {
            '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
              display: 'none',
            },
          }),
          ...(step === maxSteps && {
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
        <Step completed={evmVerified || evmSigned}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={evmSigned}
            className="step-button"
            icon={
              step === maxSteps &&
              !evmSigned && <ErrorIcon sx={{ width: 32, height: 32 }} />
            }

            // icon={
            //   <CheckIcon
            //     width={24}
            //     height={24}
            //     sx={(theme) => ({ color: theme.palette.white.main })}
            //     color={evmSigned ? 'primary' : 'disabled'}
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
        <Step completed={svmVerified || svmSigned}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={svmSigned}
            className="step-button"
            icon={
              step === maxSteps &&
              !svmSigned && <ErrorIcon sx={{ width: 32, height: 32 }} />
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
        <Step completed={evmVerified && svmVerified}>
          <StepButton
            disableRipple={true}
            color="inherit"
            icon={
              step === maxSteps &&
              !evmVerified &&
              !svmVerified && <ErrorIcon sx={{ width: 32, height: 32 }} />
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
