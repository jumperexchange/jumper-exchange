import { ExpandableSection } from '@/components/core/sections/ExpandableSection/ExpandableSection';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { defaultConfig } from './constants';
import type { FC, PropsWithChildren } from 'react';
import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { useTranslation } from 'react-i18next';
import useMediaQuery from '@mui/material/useMediaQuery';
import { PortfolioHoldingsSectionHeaderSkeleton } from './PortfolioHoldingsSectionHeaderSkeleton';

interface PortfolioHoldingsSectionProps extends PropsWithChildren {
  title: string;
  amount: number;
  progress: number;
  shouldExpand?: boolean;
  isLoading?: boolean;
}

export const PortfolioHoldingsSection: FC<PortfolioHoldingsSectionProps> = ({
  title,
  amount,
  progress,
  children,
  shouldExpand,
  isLoading,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  return (
    <SectionCard
      sx={(theme) => ({
        padding: theme.spacing(1.5),
        backgroundColor: (theme.vars || theme).palette.surface1.main,
      })}
    >
      <ExpandableSection
        shouldExpand={shouldExpand}
        renderHeader={() =>
          isLoading ? (
            <PortfolioHoldingsSectionHeaderSkeleton />
          ) : (
            <Stack
              direction="row"
              sx={{
                gap: 2,
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Stack direction="row" sx={{ gap: 2 }}>
                <Typography variant={defaultConfig.titleVariant}>
                  {title}
                </Typography>
                <Typography
                  variant={defaultConfig.titleVariant}
                  color="textSecondary"
                >
                  {t('format.percent', { value: progress / 100 })}
                </Typography>
              </Stack>
              <Typography variant={defaultConfig.titleVariant} sx={{ mr: 1 }}>
                {t(`format.${isMobile ? 'currencyCompact' : 'currency'}`, {
                  value: amount,
                })}
              </Typography>
            </Stack>
          )
        }
      >
        {children}
      </ExpandableSection>
    </SectionCard>
  );
};
