'use client';

import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import { Link } from '@/components/Link';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { Bouncer } from './Bouncer';

export const BlockedAccountCallout = () => {
  const { t } = useTranslation();

  return (
    <Bouncer blocked>
      <Box sx={{ mb: 2 }}>
        <BaseAlert
          variant={BaseAlertVariant.Error}
          title={t('bouncer.blocked.title', 'Account Restricted')}
          description={t(
            'bouncer.blocked.description',
            'Your account has been restricted. If you believe this is an error, please contact support.',
          )}
        >
          <Link
            href="https://jumper.exchange/support"
            target="_blank"
            rel="noopener noreferrer"
            sx={(theme) => ({
              color: (theme.vars || theme).palette.statusErrorFg,
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            })}
          >
            {t('bouncer.blocked.contactSupport', 'Contact Support')}
          </Link>
        </BaseAlert>
      </Box>
    </Bouncer>
  );
};
