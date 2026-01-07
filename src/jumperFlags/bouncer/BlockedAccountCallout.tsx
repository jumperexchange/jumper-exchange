'use client';

import { BaseAlert } from '@/components/Alerts/BaseAlert/BaseAlert';
import { BaseAlertVariant } from '@/components/Alerts/BaseAlert/BaseAlert.styles';
import { Link } from '@/components/Link';
import Box from '@mui/material/Box';
import { useTranslation } from 'react-i18next';
import { Bouncer } from './Bouncer';

export const BlockedAccountCallout = () => {
  const { t } = useTranslation();
  const tString = t as (key: string) => string;

  return (
    <Bouncer blocked>
      <Box sx={{ mb: 2 }}>
        <BaseAlert
          variant={BaseAlertVariant.Error}
          title={tString('bouncer.blockedAccountTitle')}
          description={tString('bouncer.blockedAccountDescription')}
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
            {tString('bouncer.contactSupport')}
          </Link>
        </BaseAlert>
      </Box>
    </Bouncer>
  );
};
