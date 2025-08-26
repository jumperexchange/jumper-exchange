import { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletMenu } from '@lifi/wallet-management';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Badge } from 'src/components/Badge/Badge';
import { Button } from 'src/components/Button/Button';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';

export const ZapPlaceholderWidget = () => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  const handleOpenWalletMenu = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    openWalletMenu();
  };
  return (
    <SectionCard>
      <Stack sx={{ gap: 3 }}>
        <Badge
          startIcon={<AccessTimeIcon />}
          label="Coming soon"
          variant={BadgeVariant.Secondary}
        />
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="bodyLargeStrong">
            {t('widget.zap.placeholder.title')}
          </Typography>
          <Typography>{t('widget.zap.placeholder.description')}</Typography>
        </Stack>
        <Button fullWidth size="medium" onClick={handleOpenWalletMenu}>
          {t('button.connectAnotherWallet')}
        </Button>
      </Stack>
    </SectionCard>
  );
};
