import type { FC } from 'react';
import { useState } from 'react';
import type { ComposeResponseData } from '@/app/lib/lifi-composer-client';
import type { ExtendedToken } from '@/types/tokens';
import { createTokenBalance } from '@/types/tokens';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ShowChart from '@mui/icons-material/ShowChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslation } from 'react-i18next';
import { FieldWrapper } from '../../JumperWidget.style';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import { sumBy } from 'lodash';

interface ComposerNetworkCostProps {
  composerQuote: ComposeResponseData;
  outputToken: ExtendedToken;
  slippage: number;
}

export const ComposerNetworkCost: FC<ComposerNetworkCostProps> = ({
  composerQuote,
  outputToken,
  slippage,
}) => {
  const { t } = useTranslation();
  const { toDisplayAmount } = useTokenFormatters();
  const [cardExpanded, setCardExpanded] = useState(false);

  const toggleCard = () => setCardExpanded((prev) => !prev);

  const { priceImpact, producedResources } = composerQuote;

  const priceImpactDecimal =
    (priceImpact.outputValueUsd >= priceImpact.inputValueUsd ? 1 : -1) *
    (priceImpact.impactBps / 10000);

  const totalAmountOutMin = sumBy(
    Object.values(producedResources),
    (resource) => Number(resource.simulated.amountOutMin),
  );

  const minReceivedBalance = createTokenBalance(
    outputToken,
    totalAmountOutMin.toString(),
  );
  const minReceivedString = toDisplayAmount(
    minReceivedBalance,
    outputToken.symbol,
    { maximumFractionDigits: 6 },
  );

  return (
    <FieldWrapper sx={{ gap: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <Collapse timeout={100} in={!cardExpanded} mountOnEnter>
            <Box
              onClick={toggleCard}
              role="button"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: (theme) => theme.spacing(0.5),
                px: 1,
                cursor: 'pointer',
              }}
            >
              <ShowChart
                sx={{
                  height: 16,
                  width: 16,
                  color: (theme) => (theme.vars || theme).palette.alpha500.main,
                }}
              />
              <Typography
                sx={{
                  fontSize: 14,
                  color: 'text.primary',
                  fontWeight: 600,
                  lineHeight: 1.429,
                }}
              >
                {t('format.percent', {
                  value: priceImpactDecimal,
                  usePlusSign: true,
                })}
              </Typography>
            </Box>
          </Collapse>
        </Box>
        <IconButton onClick={toggleCard} size={Size.SM}>
          {cardExpanded ? (
            <ExpandLess fontSize="inherit" />
          ) : (
            <ExpandMore fontSize="inherit" />
          )}
        </IconButton>
      </Box>
      <Collapse timeout={225} in={cardExpanded} mountOnEnter>
        <Box sx={{ marginTop: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
          >
            <Typography variant="body2">
              {t('jumperWidget.networkCosts.priceImpact')}
            </Typography>
            <Tooltip title={t('tooltips.priceImpact')}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {t('format.percent', {
                  value: priceImpactDecimal,
                  usePlusSign: true,
                })}
              </Typography>
            </Tooltip>
          </Box>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
          >
            <Typography variant="body2">
              {t('jumperWidget.networkCosts.maxSlippage')}
            </Typography>
            <Tooltip title={t('tooltips.slippage')}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {t('format.percent', { value: slippage })}
              </Typography>
            </Tooltip>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              {t('jumperWidget.networkCosts.minReceived')}
            </Typography>
            <Tooltip title={t('tooltips.minReceived')}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {minReceivedString}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </FieldWrapper>
  );
};
