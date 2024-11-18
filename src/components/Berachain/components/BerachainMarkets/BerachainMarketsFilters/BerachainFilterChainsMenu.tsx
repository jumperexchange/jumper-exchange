import type { ChainId, ExtendedChain } from '@lifi/sdk';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { berachainMarkets } from 'src/components/Berachain/const/berachainExampleData';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { useChains } from 'src/hooks/useChains';
import { BerachainMarketFilter } from '../BerachainMarketFilter/BerachainMarketFilter';
import { BerachainMarketFilterItem } from '../BerachainMarketFilter/BerachainMarketFilter.style';
import {
  BerachainMarketFilterArrow,
  BerachainMarketFiltersButton,
} from '../BerachainMarkets.style';
import { BerachainMarketsFilterBox } from './BerachainMarketsFilters.style';

export const BerachainFilterChainsMenu = () => {
  const { chainFilter, setChainFilter } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  const [anchorAssetsEl, setAnchorAssetsEl] = useState<null | HTMLElement>(
    null,
  );
  const [openAssetsFilterMenu, setOpenAssetsFilterMenu] = useState(false);

  const handleAssetsFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openAssetsFilterMenu) {
      setAnchorAssetsEl(null);
      setOpenAssetsFilterMenu(false);
    } else {
      setAnchorAssetsEl(event.currentTarget);
      setOpenAssetsFilterMenu(true);
    }
  };
  const assetsFilterId = 'assets-filter-button';
  const assetsMenuId = 'assets-filter-menu';

  const { chains: unfilteredChains } = useChains();

  // Filter chains-data with available Chains from request
  const chains: ExtendedChain[] = useMemo(() => {
    const filteredChains: ChainId[] = [];
    berachainMarkets.forEach((market) => {
      // Check if the chain is not already in the chains array
      if (!filteredChains.includes(market.chain)) {
        // If it's not present, add it to the chains array
        filteredChains.push(market.chain);
      }
    });
    return unfilteredChains.filter((el) => {
      return filteredChains.includes(el.id);
    });
  }, [unfilteredChains]);

  return (
    <BerachainMarketsFilterBox>
      <Typography variant="bodySmall" color={'text.primary'}>
        Chains
      </Typography>
      <BerachainMarketFiltersButton
        id={assetsFilterId}
        aria-controls={openAssetsFilterMenu ? 'assets-filter-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openAssetsFilterMenu ? 'true' : undefined}
        onClick={handleAssetsFilterClick}
      >
        <Typography variant="bodySmall">All selected</Typography>
        <BerachainMarketFilterArrow active={openAssetsFilterMenu} />
      </BerachainMarketFiltersButton>
      <BerachainMarketFilter
        open={openAssetsFilterMenu}
        setOpen={setOpenAssetsFilterMenu}
        anchorEl={anchorAssetsEl}
        setAnchorEl={setAnchorAssetsEl}
        idLabel={assetsFilterId}
        idMenu={assetsMenuId}
      >
        {chains.map((chain) => (
          <BerachainMarketFilterItem
            onClick={() => {
              setChainFilter(chain.id);
            }}
          >
            {chainFilter.includes(chain.id) ? (
              <RadioButtonUncheckedIcon
                sx={{ color: '#FF8425', width: '24px', height: '24px' }}
              />
            ) : (
              <CheckCircleRoundedIcon
                sx={{ color: '#FF8425', width: '24px', height: '24px' }}
              />
            )}

            {chain.logoURI ? (
              <Image
                src={chain.logoURI}
                alt={`${chain.name}-logo`}
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
              {chain.name}
            </Typography>
          </BerachainMarketFilterItem>
        ))}
      </BerachainMarketFilter>
    </BerachainMarketsFilterBox>
  );
};
