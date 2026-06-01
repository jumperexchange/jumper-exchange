import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useState, type FC } from 'react';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { BaseSurfaceSkeleton } from '@/components/core/skeletons/BaseSurfaceSkeleton/BaseSurfaceSkeleton.style';
import { useTranslation } from 'react-i18next';
interface PromoCodeRendererProps {
  promoCode?: string;
  isLoading: boolean;
}

export const isPromoPlaceholderParagraph = (text: string) =>
  text.startsWith('<PROMO');

export const PromoCodeRenderer: FC<PromoCodeRendererProps> = ({
  promoCode,
  isLoading,
}) => {
  const { t } = useTranslation();
  const [showCopyMessage, setShowCopyMessage] = useState(false);

  const handleCopyToClipboard = () => {
    if (!promoCode) {
      return;
    }
    navigator.clipboard.writeText(promoCode);
    setShowCopyMessage(true);
    setTimeout(() => setShowCopyMessage(false), 3000);
  };

  const renderLabel = () => {
    return (
      <Typography variant="bodyMedium" color="textSecondary">
        {t('labels.promoCode')}
      </Typography>
    );
  };

  const renderPromoCodeContent = () => {
    if (isLoading) {
      return (
        <>
          {renderLabel()}
          <BaseSurfaceSkeleton
            variant="rounded"
            sx={{
              height: 40,
              width: 104,
              backgroundColor: (theme) =>
                (theme.vars || theme).palette.surface1.main,
            }}
          />
        </>
      );
    }

    if (promoCode) {
      return (
        <>
          {renderLabel()}
          <Tooltip
            title={t('tooltips.copied')}
            open={showCopyMessage}
            disableHoverListener
            disableFocusListener
            disableTouchListener
            slotProps={{
              tooltip: {
                sx: {
                  color: (theme) =>
                    (theme.vars || theme).palette.statusSuccessFg,
                  backgroundColor: (theme) =>
                    (theme.vars || theme).palette.statusSuccessBg,
                  '& .MuiTooltip-arrow': {
                    color: (theme) =>
                      (theme.vars || theme).palette.statusSuccessBg,
                  },
                },
              },
            }}
          >
            <Box>
              <Button
                endAdornment={<ContentCopyIcon />}
                variant={Variant.Borderless}
                onClick={handleCopyToClipboard}
              >
                {promoCode}
              </Button>
            </Box>
          </Tooltip>
        </>
      );
    }

    return null;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 0.75,
        my: 0.75,
      }}
    >
      {renderPromoCodeContent()}
    </Box>
  );
};
