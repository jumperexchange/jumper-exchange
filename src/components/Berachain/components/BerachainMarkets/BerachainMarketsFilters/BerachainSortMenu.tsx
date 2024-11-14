import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { BerachainMarketFilter } from '../BerachainMarketFilter/BerachainMarketFilter';
import { BerachainMarketFilterItem } from '../BerachainMarketFilter/BerachainMarketFilter.style';
import {
  BerachainMarketFilterArrow,
  BerachainMarketFiltersButton,
} from '../BerachainMarkets.style';
import {
  BerachainMarketsSortFilterBox,
  BerachainMarketsSortLabel,
} from './BerachainMarketsFilters.style';

export const BerachainSortMenu = () => {
  const { sort, setSort } = useBerachainMarketsFilterStore((state) => state);
  const [anchorSortEl, setAnchorSortEl] = useState<null | HTMLElement>(null);
  const [openSortMenu, setOpenSortMenu] = useState(false);

  const handleSortClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (openSortMenu) {
      setAnchorSortEl(null);
      setOpenSortMenu(false);
    } else {
      setAnchorSortEl(event.currentTarget);
      setOpenSortMenu(true);
    }
  };
  const assetsFilterId = 'sort-button';
  const assetsMenuId = 'sort-menu';

  const data = ['APY', 'TVL'];

  return (
    <BerachainMarketsSortFilterBox>
      <BerachainMarketsSortLabel variant="bodySmall">
        Sort by
      </BerachainMarketsSortLabel>
      <BerachainMarketFiltersButton
        id={assetsFilterId}
        aria-controls={openSortMenu ? 'assets-filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openSortMenu ? 'true' : undefined}
        onClick={handleSortClick}
      >
        <Typography variant="bodySmall">All selected</Typography>
        <BerachainMarketFilterArrow active={openSortMenu} />
      </BerachainMarketFiltersButton>
      <BerachainMarketFilter
        open={openSortMenu}
        setOpen={setOpenSortMenu}
        anchorEl={anchorSortEl}
        setAnchorEl={setAnchorSortEl}
        idLabel={assetsFilterId}
        idMenu={assetsMenuId}
      >
        {data.map((sortType: string) => {
          if (!sortType) {
            return null;
          }
          return (
            <BerachainMarketFilterItem
              onClick={() => {
                setSort(sortType);
              }}
            >
              {sort?.includes(sortType) ? (
                <CheckCircleRoundedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              ) : (
                <RadioButtonUncheckedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              )}
              <Typography variant="bodySmall" marginLeft={'8px'}>
                {sortType}
              </Typography>
            </BerachainMarketFilterItem>
          );
        })}
      </BerachainMarketFilter>
    </BerachainMarketsSortFilterBox>
  );
};
