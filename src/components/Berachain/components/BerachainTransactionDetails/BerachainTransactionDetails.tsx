import { Box } from '@mui/system';
import {
  Button,
  Collapse,
  IconButton,
  Link,
  Tooltip,
  Typography,
} from '@mui/material';
import type { EnrichedMarketDataType } from 'royco/queries';
import type {
  RoycoMarketRewardStyleRecordType,
  TypedRoycoMarketRewardStyle,
} from 'royco/market';
import { RoycoMarketRewardStyle, RoycoMarketType } from 'royco/market';
import Recipe from './Recipe';
import { useState } from 'react';
import { InfoCard } from './InfoCard';
import { getExplorerUrl, shortAddress } from 'royco/utils';
import InfoIcon from '@mui/icons-material/Info';
import ExternalLinkIcon from '@mui/icons-material/Link';

export const MarketRewardStyle: Record<
  TypedRoycoMarketRewardStyle,
  RoycoMarketRewardStyleRecordType & {
    label: string;
    tag: string;
    description: string;
  }
> = {
  upfront: {
    ...RoycoMarketRewardStyle.upfront,
    label: 'Upfront',
    tag: '',
    description: 'Pay all incentives at the completion of action.',
  },
  arrear: {
    ...RoycoMarketRewardStyle.arrear,
    label: 'Arrear',
    tag: '',
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
  },
  forfeitable: {
    ...RoycoMarketRewardStyle.forfeitable,
    label: 'Forfeitable',
    tag: '',
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
  },
};

function BerachainTransactionDetails({
  market,
}: {
  market: EnrichedMarketDataType;
}) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box>
      <Button variant="text" onClick={() => setOpen(!open)}>
        Transaction Details
      </Button>
      <Collapse in={open}>
        {market.market_type === RoycoMarketType.recipe.value && (
          <Recipe market={market} />
        )}
        {/*{market.market_type === RoycoMarketType.vault.value && <Vault market={market} />}*/}

        {/**
         * @info Market Id
         */}
        <InfoCard.Row>
          <InfoCard.Row.Key>Market ID</InfoCard.Row.Key>
          <InfoCard.Row.Value>
            <Typography variant="body2" color="textSecondary" component="span">
              {`${shortAddress(market.market_id ?? '')}`}
              <Tooltip
                title="Market id is constructed as concatenation of chain id,
              market type and market index. For recipes, market id is
              hash of the market and for vaults, it is the address of
              wrapped vault."
                placement="top"
                enterTouchDelay={0}
                arrow
              >
                <InfoIcon
                  htmlColor="white"
                  sx={{ cursor: 'help', marginX: 1 }}
                />
              </Tooltip>
            </Typography>
          </InfoCard.Row.Value>
        </InfoCard.Row>

        {/**
         * @info Reward Style
         * @condition Recipe Market
         */}
        {market.market_type === RoycoMarketType.recipe.value && (
          <InfoCard.Row>
            <InfoCard.Row.Key>Reward Style</InfoCard.Row.Key>
            <InfoCard.Row.Value>
              {
                MarketRewardStyle[
                  market.reward_style === 0
                    ? 'upfront'
                    : market.reward_style === 1
                      ? 'arrear'
                      : 'forfeitable'
                ].label
              }

              <Tooltip
                title={
                  MarketRewardStyle[
                    market.reward_style === 0
                      ? 'upfront'
                      : market.reward_style === 1
                        ? 'arrear'
                        : 'forfeitable'
                  ].description
                }
                placement="top"
                enterTouchDelay={0}
                arrow
              >
                <InfoIcon
                  htmlColor="white"
                  sx={{ cursor: 'help', marginX: 1 }}
                />
              </Tooltip>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        )}

        {/**
         * @info Incentives
         */}
        {
          <InfoCard.Row>
            <InfoCard.Row.Key>Incentives Remaining</InfoCard.Row.Key>
            <InfoCard.Row.Value>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'standard',
                  useGrouping: true,
                }).format(market.total_incentive_amounts_usd ?? 0)}
                <Tooltip
                  title={
                    market.market_type === RoycoMarketType.recipe.value
                      ? 'Remaining incentives in all IP offers'
                      : 'Remaining incentives in a present or future campaign'
                  }
                  placement="top"
                  enterTouchDelay={0}
                  arrow
                >
                  <InfoIcon
                    htmlColor="white"
                    sx={{ cursor: 'help', marginX: 1 }}
                  />
                </Tooltip>
              </Typography>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        }

        {/**
         * @info TVL
         */}
        {
          <InfoCard.Row>
            <InfoCard.Row.Key>TVL</InfoCard.Row.Key>
            <InfoCard.Row.Value>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                {Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  notation: 'standard',
                  useGrouping: true,
                }).format(market.locked_quantity_usd ?? 0)}
                <Tooltip
                  title={
                    market.market_type === RoycoMarketType.recipe.value
                      ? 'Value of all input tokens locked inside weiroll wallets'
                      : 'Value of all input tokens deposited in underlying vault through Royco'
                  }
                  placement="top"
                  enterTouchDelay={0}
                  arrow
                >
                  <InfoIcon
                    htmlColor="white"
                    sx={{ cursor: 'help', marginX: 1 }}
                  />
                </Tooltip>
              </Typography>
            </InfoCard.Row.Value>
          </InfoCard.Row>
        }

        <InfoCard.Row>
          <InfoCard.Row.Key>Input Token</InfoCard.Row.Key>

          <InfoCard.Row.Value>
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href={getExplorerUrl({
                chainId: market.chain_id!,
                type: 'address',
                value: market.input_token_data.contract_address ?? '',
              })}
              className="flex items-center gap-1"
            >
              {
                // @ts-ignore
                market.input_token_data.contract_address.slice(0, 6) +
                  '...' +
                  // @ts-ignore
                  market.input_token_data.contract_address.slice(-4)
              }
              {/* <InfoTip {...INFO_TIP_PROPS}>Wrapped Vault</InfoTip> */}
              <IconButton
                sx={{
                  height: '20px', // Matches `h-5`, 5 in Tailwind corresponds to 20px (since 1 unit = 4px in MUI)
                  width: '20px', // Matches `w-5`, 5 in Tailwind corresponds to 20px
                  padding: '0.1rem', // Matches `p-[0.1rem]`, equivalent to 0.1rem (1rem = 16px, so 0.1rem = 1.6px)
                  color: 'secondary.main', // Matches `text-secondary`, using MUI's theme for secondary color
                }}
              >
                <ExternalLinkIcon strokeWidth={1.5} />
              </IconButton>
            </Link>
          </InfoCard.Row.Value>
        </InfoCard.Row>
      </Collapse>
    </Box>
  );
}

export default BerachainTransactionDetails;
