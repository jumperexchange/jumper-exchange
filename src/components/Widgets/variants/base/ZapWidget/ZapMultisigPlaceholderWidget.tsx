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

export const ZapMultisigPlaceholderWidget = () => {
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
            Your wallet is currently not supported
          </Typography>
          <Typography>
            We are working on adding support for embedded and smart contract
            wallets. In the mean time please use a different wallet to complete
            this mission.
          </Typography>
        </Stack>
        <Button fullWidth size="medium" onClick={handleOpenWalletMenu}>
          {t('button.connectAnotherWallet')}
        </Button>
      </Stack>
    </SectionCard>
  );
};
