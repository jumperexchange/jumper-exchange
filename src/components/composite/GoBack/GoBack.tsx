'use client';

import Box from '@mui/material/Box';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

import { useGoBack } from 'src/hooks/routing/useGoBack';
import { AppPaths } from 'src/const/urls';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Badge } from 'src/components/Badge/Badge';

interface GoBackProps {
  path?: AppPaths;
  dataTestId?: string;
}

export const GoBack = ({ path, dataTestId }: GoBackProps) => {
  const { t } = useTranslation();
  const handleGoBack = useGoBack(path ?? AppPaths.Main);
  return (
    <Box sx={{ width: '100%' }}>
      <Badge
        label={t('navbar.links.back')}
        onClick={handleGoBack}
        startIcon={<ArrowBackIcon />}
        size={BadgeSize.LG}
        variant={BadgeVariant.Alpha}
        data-testid={dataTestId}
      />
    </Box>
  );
};
