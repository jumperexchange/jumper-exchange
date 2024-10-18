import type { TypographyProps } from '@mui/material';
import { Typography, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

export interface PromoLabelProps extends TypographyProps {
  label?: string;
}

export const PromoLabel = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'label',
})<PromoLabelProps>(({ theme, label }) => {
  const { t } = useTranslation();

  return {
    position: 'absolute',
    top: -8,
    right: -12,
    ':before': {
      content: `"${label || t('promo.new')}"`,
      height: 24,
      textTransform: 'uppercase',
      padding: theme.spacing(0.75, 1.5),
      whiteSpace: 'nowrap',
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
      userSelect: 'none',
      borderRadius: '12px',
      zIndex: 1,
    },
  };
});
