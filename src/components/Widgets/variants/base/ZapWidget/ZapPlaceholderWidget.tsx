import { FC, MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletMenu } from '@lifi/wallet-management';
import type { ParseKeys } from 'i18next';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Badge } from 'src/components/Badge/Badge';
import { Button } from 'src/components/Button/Button';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';

interface ZapPlaceholderWidgetProps {
  titleKey: ParseKeys<'translation'>;
  descriptionKey: ParseKeys<'translation'>;
}

export const ZapPlaceholderWidget: FC<ZapPlaceholderWidgetProps> = ({
  titleKey,
  descriptionKey,
}) => {
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
          label={t('widget.zap.placeholder.comingSoon')}
          variant={BadgeVariant.Secondary}
        />
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="bodyLargeStrong">{t(titleKey)}</Typography>
          <Typography>{t(descriptionKey)}</Typography>
        </Stack>
        <Button fullWidth size="medium" onClick={handleOpenWalletMenu}>
          {t('button.connectAnotherWallet')}
        </Button>
      </Stack>
    </SectionCard>
  );
};
