import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Box, Skeleton, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { BerachainMarketFilter } from '../BerachainMarketFilter/BerachainMarketFilter';
import { BerachainMarketFilterItem } from '../BerachainMarketFilter/BerachainMarketFilter.style';
import {
  BerachainMarketFilterArrow,
  BerachainMarketFiltersButton,
} from '../BerachainMarkets.style';
import { BerachainMarketsFilterBox } from './BerachainMarketsFilters.style';
import { useEnrichedMarkets } from 'royco/hooks';
import type { EnrichedMarketDataType } from 'royco/queries';

export const BerachainFilterIncentivesMenu = () => {
  const { incentiveFilter, setIncentiveFilter } =
    useBerachainMarketsFilterStore((state) => state);

  const [anchorTokenEl, setAnchorTokenEl] = useState<null | HTMLElement>(null);
  const [openTokensFilterMenu, setOpenTokensFilterMenu] = useState(false);

  const handleTokensFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openTokensFilterMenu) {
      setAnchorTokenEl(null);
      setOpenTokensFilterMenu(false);
    } else {
      setAnchorTokenEl(event.currentTarget);
      setOpenTokensFilterMenu(true);
    }
  };
  const assetsFilterId = 'token-filter-button';
  const assetsMenuId = 'token-filter-menu';

  const { data } = useEnrichedMarkets({
    is_verified: false,
    sorting: [{ id: 'locked_quantity_usd', desc: true }],
  });

  const tokens = useMemo(() => {
    if (!data) {
      return [];
    }

    const mappedTokens = new Map<
      string,
      EnrichedMarketDataType['incentive_tokens_data'][0]
    >();

    for (const token of data) {
      for (const incentive of token.incentive_tokens_data) {
        mappedTokens.set(incentive.symbol, incentive);
      }
    }

    return mappedTokens;
  }, [data]);

  return (
    <BerachainMarketsFilterBox>
      <BerachainMarketFiltersButton
        id={assetsFilterId}
        aria-controls={openTokensFilterMenu ? assetsMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={openTokensFilterMenu ? 'true' : undefined}
        onClick={handleTokensFilterClick}
      >
        <Typography variant="bodyMedium">All Incentives</Typography>
        <BerachainMarketFilterArrow active={openTokensFilterMenu} />
      </BerachainMarketFiltersButton>
      <BerachainMarketFilter
        open={openTokensFilterMenu}
        setOpen={setOpenTokensFilterMenu}
        anchorEl={anchorTokenEl}
        setAnchorEl={setAnchorTokenEl}
        idLabel={assetsFilterId}
        idMenu={assetsMenuId}
      >
        {Array.from(tokens.values()).map((token, index) => {
          if (!token) {
            return null;
          }
          return (
            <BerachainMarketFilterItem
              key={`berachain-token-filter-${index}-${token.symbol}`}
              onClick={() => {
                setIncentiveFilter(token.symbol);
              }}
            >
              {incentiveFilter.includes(token.symbol) ? (
                <RadioButtonUncheckedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              ) : (
                <CheckCircleRoundedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              )}

              {token.image ? (
                <Box
                  component="img"
                  src={token.image}
                  alt={`${token.symbol}-logo`}
                  width={20}
                  height={20}
                  style={{ borderRadius: '10px', marginLeft: '12px' }}
                ></Box>
              ) : (
                <Skeleton
                  variant="circular"
                  sx={{ width: '20px', height: '20px' }}
                />
              )}
              <Typography variant="bodySmall" marginLeft={'8px'}>
                {token.name}
              </Typography>
            </BerachainMarketFilterItem>
          );
        })}
      </BerachainMarketFilter>
    </BerachainMarketsFilterBox>
  );
};
