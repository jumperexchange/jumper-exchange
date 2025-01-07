import { Box } from '@mui/material';
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Link,
  Tooltip,
  Typography,
  useTheme,
  AccordionDetails,
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
import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material';
import SvgIcon from '@mui/material/SvgIcon/SvgIcon';

import AccordionSummary from '@mui/material/AccordionSummary';
import { BerachainDetailsAccordion } from '../BerachainWidget/DepositWidget/WidgetDeposit.style';

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
  type = 'deposit',
}: {
  type: 'deposit' | 'withdraw';
  market: EnrichedMarketDataType;
}) {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (_: React.ChangeEvent<{}>, expanded: boolean) => {
    setOpen(expanded);
  };

  return (
    <BerachainDetailsAccordion
      expanded={open}
      disableGutters
      onChange={handleChange}
      sx={{ borderRadius: '16px !important' }}
    >
      <AccordionSummary sx={{ borderRadius: '16px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography>Transfer Details</Typography>
          {!open ? <ArrowDropDown /> : <ArrowDropUp />}
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          borderBottomLeftRadius: '16px !important',
          borderBottomRightRadius: '16px !important',
        }}
      >
        <Box
          sx={{
            flexDirection: 'column',
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {market.market_type === RoycoMarketType.recipe.value && (
            <Recipe market={market} type={type} />
          )}
          {/* {market.market_type === RoycoMarketType.vault.value && <Vault market={market} />} */}
          {/**
           * @info Market Id
           */}
          <InfoCard.Row>
            <InfoCard.Row.Key>Market ID</InfoCard.Row.Key>
            <InfoCard.Row.Value>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
              >
                {`${shortAddress(market.market_id ?? '')}`}
              </Typography>
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
            </InfoCard.Row.Value>
          </InfoCard.Row>
          {/**
           * @info Reward Style
           * @condition Recipe Market
           */}
          {/* {market.market_type === RoycoMarketType.recipe.value && (
            <InfoCard.Row>
              <InfoCard.Row.Key>Reward Style</InfoCard.Row.Key>
              <InfoCard.Row.Value>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="span"
                >
                  {
                    MarketRewardStyle[
                      market.reward_style === 0
                        ? 'upfront'
                        : market.reward_style === 1
                          ? 'arrear'
                          : 'forfeitable'
                    ].label
                  }
                </Typography>

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
          )} */}
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
                </Typography>
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
              </InfoCard.Row.Value>
            </InfoCard.Row>
          }
          {/**
           * @info TVL
           */}
          {
            // <InfoCard.Row>
            //   <InfoCard.Row.Key>TVL</InfoCard.Row.Key>
            //   <InfoCard.Row.Value>
            //     <Typography
            //       variant="body2"
            //       color="textSecondary"
            //       component="span"
            //     >
            //       {Intl.NumberFormat('en-US', {
            //         style: 'currency',
            //         currency: 'USD',
            //         notation: 'standard',
            //         useGrouping: true,
            //       }).format(market.locked_quantity_usd ?? 0)}
            //     </Typography>
            //     <Tooltip
            //       title={
            //         market.market_type === RoycoMarketType.recipe.value
            //           ? 'Value of all input tokens locked inside weiroll wallets'
            //           : 'Value of all input tokens deposited in underlying vault through Royco'
            //       }
            //       placement="top"
            //       enterTouchDelay={0}
            //       arrow
            //     >
            //       <InfoIcon
            //         htmlColor="white"
            //         sx={{ cursor: 'help', marginX: 1 }}
            //       />
            //     </Tooltip>
            //   </InfoCard.Row.Value>
            // </InfoCard.Row>
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
              </Link>
              <ExternalLinkIcon
                sx={{
                  marginX: 1,
                  height: '24px', //Matches `h-5`, 5 in Tailwind corresponds to 20px (since 1 unit = 4px in MUI)
                  width: '24px', //Matches `w-5`, 5 in Tailwind corresponds to 20px
                  padding: '0.1rem', // Matches `p-[0.1rem]`, equivalent to 0.1rem (1rem = 16px, so 0.1rem = 1.6px)
                  color: 'text.primary', // Matches `text-secondary`, using MUI's theme for secondary color
                }}
                strokeWidth={1.5}
              />
            </InfoCard.Row.Value>
          </InfoCard.Row>
        </Box>
      </AccordionDetails>
    </BerachainDetailsAccordion>
  );
}

export default BerachainTransactionDetails;
