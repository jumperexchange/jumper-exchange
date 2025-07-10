import ErrorIcon from '@mui/icons-material/Error';
import WalletIcon from '@mui/icons-material/Wallet';
import { StepConnector } from '@mui/material';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import { Checked } from 'src/components/illustrations/Checked';
import { useWalletHacked } from '../context/WalletHackedContext';
import {
  WalletHackedStep,
  WalletHackedStepBox,
  WalletHackedStepButton,
  WalletHackedStepText,
} from './WalletHackedStepper.style';

interface WalletHackedStepperProps {
  step: number;
  maxSteps: number;
  onClick?: () => void;
  sourceWallet: string | undefined;
  destinationWallet: string | undefined;
  sourceWalletVerified: boolean;
  destinationWalletVerified: boolean;
  sourceWalletSigned: boolean;
  destinationWalletSigned: boolean;
  showError?: boolean;
}

export default function WalletHackedStepper() {
  const {
    currentStep,
    setCurrentStep,
    sourceWallet,
    destinationWallet,
    error,
  } = useWalletHacked();

  const step = 1;
  const showError = !!error;
  const sourceWalletVerified = sourceWallet?.verified;
  const sourceWalletSigned = sourceWallet?.signed;
  const destinationWalletVerified = destinationWallet?.verified;
  const destinationWalletSigned = destinationWallet?.signed;

  return (
    <Box sx={{ width: '100%' }}>
      {/* <Divider /> */}
      <Stepper
        nonLinear
        activeStep={step}
        connector={<StepConnector sx={{ height: 'auto' }} />}
        sx={(theme) => ({
          margin: theme.spacing(3, 0, 2),
          // ...(showError && {
          '& .MuiStepLabel-iconContainer': {
            paddingRight: 0,
            width: '16px',
            right: '20px',
            top: '28px',
            '&.MuiStepIcon-root': {
              height: '100%',
              width: '100%',
            },
            '&.Mui-completed': {
              backgroundColor: (theme.vars || theme).palette.white.main,
              // height: '8px',
              // width: '8px',
              svg: {
                ...(showError && {
                  color: (theme.vars || theme).palette.grey[400],
                }),
              },
            },
          },
          // }),
          '& .MuiStepLabel-iconContainer:not(.Mui-completed)': {
            ...(!showError && { display: 'none' }),
            backgroundColor: (theme.vars || theme).palette.white.main,
            svg: {
              color: (theme.vars || theme).palette.error.main,
            },
          },
        })}
      >
        {/* Source Wallet Steps */}
        <WalletHackedStep
          completed={sourceWalletVerified || sourceWalletSigned}
        >
          <WalletHackedStepButton
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
              <Box
                sx={(theme) => ({
                  backgroundColor: (theme.vars || theme).palette.bg.main,
                  borderRadius: '50%',
                  padding: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${(theme.vars || theme).palette.white.main}`,
                })}
              >
                <WalletIcon
                  sx={(theme) => ({
                    color: (theme.vars || theme).palette.primary.main,
                  })}
                  width={32}
                  height={32}
                />
              </Box>
              <WalletHackedStepText variant="bodyXSmall">
                {!sourceWallet
                  ? 'Connect'
                  : !sourceWalletVerified
                    ? 'Verify'
                    : !sourceWalletSigned
                      ? 'Sign'
                      : 'Complete'}
              </WalletHackedStepText>
              {/* {sourceWallet && (
                <WalletHackedStepText variant="bodyXSmall" sx={{ mt: 1 }}>
                  {sourceWallet?.account?.address}
                </WalletHackedStepText>
              )} */}
            </WalletHackedStepBox>
          </WalletHackedStepButton>
        </WalletHackedStep>

        {/* Destination Wallet Steps */}
        <WalletHackedStep
          completed={destinationWalletVerified || destinationWalletSigned}
        >
          <WalletHackedStepButton
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
              <Box
                sx={(theme) => ({
                  backgroundColor: '#F3EBFF',
                  borderRadius: '50%',
                  padding: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${(theme.vars || theme).palette.white.main}`,
                })}
              >
                <WalletIcon
                  sx={(theme) => ({
                    color: (theme.vars || theme).palette.primary.main,
                  })}
                  width={32}
                  height={32}
                />
              </Box>
              <WalletHackedStepText variant="bodyXSmall">
                {!destinationWallet
                  ? 'Connect'
                  : !destinationWalletVerified
                    ? 'Verify'
                    : !destinationWalletSigned
                      ? 'Sign'
                      : 'Destination'}
              </WalletHackedStepText>
              {/* {destinationWallet && (
                <WalletHackedStepText variant="bodyXSmall" sx={{ mt: 1 }}>
                  {destinationWallet?.account?.address}
                </WalletHackedStepText>
              )} */}
            </WalletHackedStepBox>
          </WalletHackedStepButton>
        </WalletHackedStep>

        {/* Final Verification Step */}
        <WalletHackedStep
          completed={sourceWalletVerified && destinationWalletVerified}
        >
          <WalletHackedStepButton
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
              <WalletHackedStepText variant="bodyXSmall">
                Verify
              </WalletHackedStepText>
            </WalletHackedStepBox>
          </WalletHackedStepButton>
        </WalletHackedStep>
      </Stepper>
    </Box>
  );
}
