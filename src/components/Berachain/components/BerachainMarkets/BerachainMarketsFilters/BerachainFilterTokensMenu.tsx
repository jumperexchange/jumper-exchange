import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { berachainMarkets } from 'src/components/Berachain/const/berachainExampleData';
import { useBerachainMarketTokens } from 'src/components/Berachain/hooks/useBerachainMarketTokens';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { BerachainMarketFilter } from '../BerachainMarketFilter/BerachainMarketFilter';
import { BerachainMarketFilterItem } from '../BerachainMarketFilter/BerachainMarketFilter.style';
import {
  BerachainMarketFilterArrow,
  BerachainMarketFiltersButton,
} from '../BerachainMarkets.style';
import { BerachainMarketsFilterBox } from './BerachainMarketsFilters.style';

export const BerachainFilterTokensMenu = () => {
  const { tokenFilter, setTokenFilter } = useBerachainMarketsFilterStore(
    (state) => state,
  );

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

  const data = useBerachainMarketTokens(berachainMarkets);

  return (
    <BerachainMarketsFilterBox>
      <Typography variant="bodySmall" color={'text.primary'}>
        Base Assets
      </Typography>
      <BerachainMarketFiltersButton
        id={assetsFilterId}
        aria-controls={openTokensFilterMenu ? 'assets-filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openTokensFilterMenu ? 'true' : undefined}
        onClick={handleTokensFilterClick}
      >
        <Typography variant="bodySmall">All selected</Typography>
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
        {data.tokens.map((token) => {
          if (!token) {
            return null;
          }
          return (
            <BerachainMarketFilterItem
              onClick={() => {
                setTokenFilter(token.address);
              }}
            >
              {tokenFilter.includes(token.address) ? (
                <RadioButtonUncheckedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              ) : (
                <CheckCircleRoundedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              )}

              {token.logoURI ? (
                <Image
                  src={token.logoURI}
                  alt={`${token.symbol}-logo`}
                  width={20}
                  height={20}
                  style={{ borderRadius: '10px', marginLeft: '12px' }}
                ></Image>
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
