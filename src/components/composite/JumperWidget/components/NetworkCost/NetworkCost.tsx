import type { LiFiStep } from '@lifi/sdk';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import LocalGasStationRounded from '@mui/icons-material/LocalGasStationRounded';
import type { CardProps } from '@mui/material';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useFeeCostsBreakdown,
  useMinReceivedAmount,
  usePriceImpact,
  useSlippage,
} from './hooks';
import { FieldWrapper } from '../../JumperWidget.style';
import { Tooltip } from '@/components/core/Tooltip/Tooltip';
import { IconButton } from '@/components/core/buttons/IconButton/IconButton';
import { Size } from '@/components/core/buttons/types';
import { TokenRate } from './TokenRate';
import { FeeBreakdownTooltip } from './FeeBreakdownTooltip';

interface NetworkCostProps extends CardProps {
  steps: LiFiStep[];
}

// @Note:
// Logic here is based on the widget TransactionDetails component
// We're missing only the integrator fee and gasless parts

export const NetworkCost: React.FC<NetworkCostProps> = ({ steps }) => {
  const { t } = useTranslation();
  const [cardExpanded, setCardExpanded] = useState(false);

  const toggleCard = () => {
    setCardExpanded((cardExpanded) => !cardExpanded);
  };

  const { gasCosts, feeCosts, gasCostUSD, feeCostUSD, combinedFeesUSD } =
    useFeeCostsBreakdown(steps);

  const priceImpact = usePriceImpact(steps);
  const slippage = useSlippage(steps);
  const minReceivedFormattedString = useMinReceivedAmount(steps);

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
        >
          {steps.length === 1 && <TokenRate step={steps[0]} />}
        </Box>
        <Collapse timeout={100} in={!cardExpanded} mountOnEnter>
          <FeeBreakdownTooltip gasCosts={gasCosts} feeCosts={feeCosts}>
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
                data-value={combinedFeesUSD}
                sx={{
                  fontSize: 14,
                  color: 'text.primary',
                  fontWeight: 600,
                  lineHeight: 1.429,
                }}
              >
                {!combinedFeesUSD
                  ? t('jumperWidget.networkCosts.fees.free')
                  : t('format.currency', { value: combinedFeesUSD })}
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
          {feeCosts.length ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.5,
              }}
            >
              <Typography variant="body2">
                {t('jumperWidget.networkCosts.fees.provider')}
              </Typography>
              <FeeBreakdownTooltip feeCosts={feeCosts}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, cursor: 'help' }}
                >
                  {t('format.currency', { value: feeCostUSD })}
                </Typography>
              </FeeBreakdownTooltip>
            </Box>
          ) : null}
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
                {slippage
                  ? t('format.percent', { value: slippage })
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
                {minReceivedFormattedString}
              </Typography>
            </Tooltip>
          </Box>
        </Box>
      </Collapse>
    </FieldWrapper>
  );
};
