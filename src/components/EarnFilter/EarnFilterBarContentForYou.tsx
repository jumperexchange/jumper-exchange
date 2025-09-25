import { FC, PropsWithChildren } from 'react';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import { RecommendationIcon } from '../illustrations/RecommendationIcon';
import { EarnListMode } from './EarnListMode';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { AnimatePresence } from 'framer-motion';

const LayoutContainer = styled(motion.div)({
  width: '100%',
  height: '100%',
});

export const EarnFilterBarContentForYou: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();

  const { totalMarkets, usedYourAddress } = useEarnFiltering();

  const formatedTotalMarkets = totalMarkets.toLocaleString();

  const copy = usedYourAddress
    ? t('earn.copy.forYouBasedOnActivity', {
        totalMarkets: formatedTotalMarkets,
      })
    : t('earn.copy.forYouDefault', { totalMarkets: formatedTotalMarkets });

  // TODO: add latest update in backend and render here

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        gap: 2,
      }}
    >
      {/* Left side: Badge and copy */}
      <AnimatePresence>
        <LayoutContainer
          initial={{ opacity: 0, y: '100%' }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 40,
          }}
        >
          <Stack direction="row" gap={1} alignItems="center" flex={1}>
            <Badge
              variant={BadgeVariant.Secondary}
              size={BadgeSize.LG}
              startIcon={<RecommendationIcon height={20} width={20} />}
            />
            <Typography variant="bodyMediumStrong">{copy}</Typography>
            <Badge
              variant={BadgeVariant.Secondary}
              size={BadgeSize.SM}
              label="Updated 12 hours ago"
            />
          </Stack>
        </LayoutContainer>
      </AnimatePresence>

      {children}
    </Box>
  );
};
