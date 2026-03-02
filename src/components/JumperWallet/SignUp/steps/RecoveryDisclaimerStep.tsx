'use client';

import { Typography, Box } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isProduction } from '@/utils/isProduction';
import { StepContent } from '../SignUpWizard.style';

const COUNTDOWN_SECONDS = 6;

interface RecoveryDisclaimerStepProps {
  threshold: number;
  onReady: () => void;
}

export function RecoveryDisclaimerStep({
  threshold,
  onReady,
}: RecoveryDisclaimerStepProps) {
  const { t } = useTranslation();
  const [secondsLeft, setSecondsLeft] = useState(
    isProduction ? COUNTDOWN_SECONDS : 0,
  );

  useEffect(() => {
    if (!isProduction) {
      onReady();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onReady();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // onReady is intentionally omitted — it's a stable callback and we only
    // want this effect to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <StepContent>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          textAlign: 'center',
        }}
      >
        <WarningAmberIcon
          sx={(theme) => ({
            fontSize: 48,
            color: (theme.vars || theme).palette.warning.main,
          })}
        />

        <Typography variant="h6" fontWeight={700}>
          {t('jumperWallet.signup.disclaimerTitle')}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {t('jumperWallet.signup.disclaimerBody', { threshold })}
        </Typography>
      </Box>

      {secondsLeft > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: 'block', textAlign: 'center', mt: 1 }}
        >
          {t('jumperWallet.signup.disclaimerAcknowledgeCountdown', {
            seconds: secondsLeft,
          })}
        </Typography>
      )}
    </StepContent>
  );
}
