import ErrorIcon from '@mui/icons-material/Error';
import { StepButton, StepConnector } from '@mui/material';
import Box from '@mui/material/Box';
import Step from '@mui/material/Step';
import Stepper from '@mui/material/Stepper';
import { Checked } from 'src/components/illustrations/Checked';
import {
  WalletHackedStepBox,
  WalletHackedStepImage,
  WalletHackedStepText,
} from './WalletHackedStepper.style';

interface WalletHackedStepperProps {
  step: number;
  maxSteps: number;
  onClick?: () => void;
  sourceWallet?: string | null;
  destinationWallet?: string | null;
  sourceWalletVerified?: boolean;
  destinationWalletVerified?: boolean;
  sourceWalletSigned?: boolean;
  destinationWalletSigned?: boolean;
  showError?: boolean;
}

export default function WalletHackedStepper({
  step,
  maxSteps,
  onClick,
  sourceWallet,
  destinationWallet,
  sourceWalletVerified,
  destinationWalletVerified,
  sourceWalletSigned,
  destinationWalletSigned,
  showError,
}: WalletHackedStepperProps) {
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper
        nonLinear
        activeStep={step}
        connector={<StepConnector sx={{ height: '20px' }} />}
        sx={(theme) => ({
          ...(showError && {
            '& .MuiStepLabel-iconContainer.Mui-completed': {
              backgroundColor: theme.palette.white.main,
              svg: {
                color: theme.palette.grey[400],
              },
            },
          }),
          '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
            ...(!showError && { display: 'none' }),
            backgroundColor: theme.palette.white.main,
            svg: {
              color: theme.palette.error.main,
            },
          },
        })}
      >
        {/* Source Wallet Steps */}
        <Step completed={sourceWalletVerified || sourceWalletSigned}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={sourceWalletSigned}
            className="step-button"
            icon={
              showError &&
              !sourceWalletSigned && (
                <ErrorIcon sx={{ width: 32, height: 32 }} />
              )
            }
          >
            <WalletHackedStepBox>
              <WalletHackedStepImage
                src={'/chain-icon-eth.svg'}
                width={64}
                height={64}
                alt="Source wallet"
              />
              <WalletHackedStepText variant="bodySmall">
                {!sourceWallet
                  ? 'Connect Source'
                  : !sourceWalletVerified
                    ? 'Verify Source'
                    : !sourceWalletSigned
                      ? 'Sign with Source'
                      : 'Source Complete'}
              </WalletHackedStepText>
              {sourceWallet && (
                <WalletHackedStepText variant="bodySmall" sx={{ mt: 1 }}>
                  {sourceWallet}
                </WalletHackedStepText>
              )}
            </WalletHackedStepBox>
          </StepButton>
        </Step>

        {/* Destination Wallet Steps */}
        <Step completed={destinationWalletVerified || destinationWalletSigned}>
          <StepButton
            disableRipple={true}
            color="inherit"
            disabled={destinationWalletSigned}
            className="step-button"
            icon={
              showError &&
              !destinationWalletSigned && (
                <ErrorIcon sx={{ width: 32, height: 32 }} />
              )
            }
          >
            <WalletHackedStepBox>
              <WalletHackedStepImage
                src={'/chain-icon-sol.svg'}
                width={64}
                height={64}
                alt="Destination wallet"
              />
              <WalletHackedStepText variant="bodySmall">
                {!destinationWallet
                  ? 'Connect Destination'
                  : !destinationWalletVerified
                    ? 'Verify Destination'
                    : !destinationWalletSigned
                      ? 'Sign with Destination'
                      : 'Destination Complete'}
              </WalletHackedStepText>
              {destinationWallet && (
                <WalletHackedStepText variant="bodySmall" sx={{ mt: 1 }}>
                  {destinationWallet}
                </WalletHackedStepText>
              )}
            </WalletHackedStepBox>
          </StepButton>
        </Step>

        {/* Final Verification Step */}
        <Step completed={sourceWalletVerified && destinationWalletVerified}>
          <StepButton
            disableRipple={true}
            color="inherit"
            icon={
              showError &&
              !sourceWalletVerified &&
              !destinationWalletVerified && (
                <ErrorIcon sx={{ width: 32, height: 32 }} />
              )
            }
            disabled={sourceWalletVerified && destinationWalletVerified}
            className="step-button"
          >
            <WalletHackedStepBox>
              <Checked />
              <WalletHackedStepText variant="bodySmall">
                Verify signatures
              </WalletHackedStepText>
            </WalletHackedStepBox>
          </StepButton>
        </Step>
      </Stepper>
    </Box>
  );
}
