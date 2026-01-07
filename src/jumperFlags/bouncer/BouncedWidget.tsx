'use client';

import { Widget } from '@/components/Widgets/Widget';
import type { WidgetProps } from '@/components/Widgets/Widget.types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { Bouncer } from './Bouncer';

interface BouncedWidgetProps extends WidgetProps {}

export const BouncedWidget = (props: BouncedWidgetProps) => {
  const { t } = useTranslation();

  return (
    <>
      <Bouncer loading allowed>
        <Widget {...props} />
      </Bouncer>
      <Bouncer blocked>
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(4),
            backgroundColor: (theme.vars || theme).palette.surface2.main,
            borderRadius: theme.shape.borderRadius,
            minHeight: 400,
            textAlign: 'center',
          })}
        >
          <Typography variant="headerSmall" sx={{ mb: 2 }}>
            {t('bouncer.widget.blocked.title', 'Access Restricted')}
          </Typography>
          <Typography variant="bodyMedium" color="text.secondary">
            {t(
              'bouncer.widget.blocked.description',
              'Your account has been restricted and you cannot use this feature. Please contact support if you need assistance.',
            )}
          </Typography>
        </Box>
      </Bouncer>
    </>
  );
};
