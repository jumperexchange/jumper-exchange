import type { ButtonProps } from '@/components/Button';
import { ButtonTransparent } from '@/components/Button';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface EarnViewAllMarketsButtonProps extends ButtonProps {}

export const EarnViewAllMarketsButton: FC<EarnViewAllMarketsButtonProps> = ({
  onClick,
}) => {
  const { t } = useTranslation();
  return (
    <ButtonTransparent
      onClick={onClick}
      sx={(theme) => ({
        '&.MuiButtonBase-root.MuiButton-root': {
          ...theme.typography.bodySmallStrong,
          alignSelf: 'center',
          width: '100%',
          padding: theme.spacing(1.375, 2),
          backgroundColor: (theme.vars || theme).palette.buttonAlphaDarkBg,
          color: (theme.vars || theme).palette.buttonAlphaDarkAction,
          [theme.breakpoints.up('sm')]: {
            width: 'fit-content',
          },
        },
      })}
    >
      {t('earn.actions.viewAllMarkets')}
    </ButtonTransparent>
  );
};
