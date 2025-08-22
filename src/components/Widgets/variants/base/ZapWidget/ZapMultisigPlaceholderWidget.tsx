import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useTranslation } from 'react-i18next';
import { Button } from 'src/components/Button/Button';

import { AppPaths } from 'src/const/urls';
import { Link } from 'src/components/Link';
import { Badge } from 'src/components/Badge/Badge';
import { SectionCard } from 'src/components/Cards/SectionCard/SectionCard';
import { BadgeVariant } from 'src/components/Badge/Badge.styles';

export const ZapMultisigPlaceholderWidget = () => {
  const { t } = useTranslation();
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
            Not yet supported in your environment
          </Typography>
          <Typography>
            We're not supporting zap missions yet for embedded and smart
            contract wallets
          </Typography>
        </Stack>
        <Link
          href={AppPaths.Missions}
          sx={{ width: '100%', textDecoration: 'none' }}
        >
          <Button fullWidth size="medium">
            {t('button.goBack')}
          </Button>
        </Link>
      </Stack>
    </SectionCard>
  );
};
