import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded';
import type { CardProps } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldWrapper } from '../../JumperWidget.style';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { FeeBreakdownTooltip } from './FeeBreakdownTooltip';
import type { ExtendedToken } from '@/types/tokens';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import type { OdosQuoteResponse } from '@/components/composite/DustFlow/api/odos';

interface OdosNetworkCostProps extends CardProps {
  quote: OdosQuoteResponse;
  outputToken?: ExtendedToken;
  slippagePercent?: number;
}

export const OdosNetworkCost: React.FC<OdosNetworkCostProps> = ({
  quote,
  outputToken,
  slippagePercent,
}) => {
  const { t } = useTranslation();
  const [cardExpanded, setCardExpanded] = useState(false);
  const { toDisplayAmount } = useTokenFormatters();

  const toggleCard = () => {
    setCardExpanded((prev) => !prev);
  };

  const gasCostUSD = quote.gasEstimateValue ?? 0;
  const priceImpact = quote.priceImpact ?? 0;
  const netOutValueUSD = quote.netOutValue;

  const gasCosts = useMemo(() => {
    if (gasCostUSD <= 0 || !outputToken) {
      return [];
    }
    return [
      {
        token: outputToken,
        amountUSD: gasCostUSD,
        amount: String(quote.gasEstimate ?? 0),
      },
    ];
  }, [gasCostUSD, outputToken, quote.gasEstimate]);

  const minReceivedFormatted = useMemo(() => {
    if (netOutValueUSD != null && netOutValueUSD > 0) {
      return t('format.currency', { value: netOutValueUSD });
    }
    if (
      outputToken &&
      quote.outAmounts?.length &&
      quote.outAmounts[0] !== undefined
    ) {
      const balance = {
        token: outputToken,
        amount: BigInt(quote.outAmounts[0]),
      };
      return toDisplayAmount(balance, balance.token.symbol, {
        maximumFractionDigits: 6,
      });
    }
    return '—';
  }, [netOutValueUSD, outputToken, quote, t, toDisplayAmount]);

  return (
    <FieldWrapper sx={{ gap: 0 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'left',
          }}
        />
        <Collapse timeout={100} in={!cardExpanded} mountOnEnter>
          <FeeBreakdownTooltip gasCosts={gasCosts}>
            <Box
              onClick={toggleCard}
              role="button"
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                cursor: 'pointer',
              }}
            >
              <LocalGasStationRounded sx={{ height: 16, width: 16 }} />
              <Typography
                data-value={gasCostUSD}
                sx={{
                  fontSize: 14,
                  color: 'text.primary',
                  fontWeight: 600,
                  lineHeight: 1.429,
                }}
              >
                {!gasCostUSD
                  ? t('jumperWidget.networkCosts.fees.free')
                  : t('format.currency', { value: gasCostUSD })}
              </Typography>
            </Box>
          </FeeBreakdownTooltip>
        </Collapse>
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
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography variant="body2">
              {t('jumperWidget.networkCosts.fees.network')}
            </Typography>
            <FeeBreakdownTooltip gasCosts={gasCosts}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {!gasCostUSD
                  ? t('jumperWidget.networkCosts.fees.free')
                  : t('format.currency', { value: gasCostUSD })}
              </Typography>
            </FeeBreakdownTooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
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
                  value: priceImpact,
                  usePlusSign: true,
                })}
              </Typography>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 0.5,
            }}
          >
            <Typography variant="body2">
              {t('jumperWidget.networkCosts.maxSlippage')}
            </Typography>
            <Tooltip title={t('tooltips.slippage')}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, cursor: 'help' }}
              >
                {slippagePercent != null
                  ? t('format.percent', { value: slippagePercent })
                  : t('jumperWidget.networkCosts.auto')}
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
                {minReceivedFormatted}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </FieldWrapper>
  );
};
