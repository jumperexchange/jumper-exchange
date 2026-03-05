import type { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useWalletMenu } from '@lifi/wallet-management';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { Badge } from 'src/components/Badge/Badge';
import { Button } from 'src/components/Button/Button';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';
import type { SxProps, Theme } from '@mui/material/styles';

interface ZapPlaceholderWidgetProps {
  label?: string;
  title: ReactNode;
  description: ReactNode;
  sx?: SxProps<Theme>;
}

export const ZapPlaceholderWidget = ({
  label,
  title,
  description,
  sx,
}: ZapPlaceholderWidgetProps) => {
  const { t } = useTranslation();
  const { openWalletMenu } = useWalletMenu();

  const handleOpenWalletMenu = (event?: MouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    openWalletMenu();
  };

  return (
    <SectionCard sx={sx}>
      <Stack sx={{ gap: 3 }}>
        <Badge
          startIcon={<AccessTimeIcon />}
          label={label ?? t('widget.zap.placeholder.comingSoon')}
          variant={BadgeVariant.Secondary}
        />
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="bodyLargeStrong">{title}</Typography>
          <Typography>{description}</Typography>
        </Stack>
        <Button fullWidth size="medium" onClick={handleOpenWalletMenu}>
          {t('button.connectAnotherWallet')}
        </Button>
      </Stack>
    </SectionCard>
  );
};
