import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Typography } from '@mui/material';
import { useState } from 'react';
import { useBerachainMarketProtocols } from 'src/components/Berachain/hooks/useBerachainMarketProtocols';
import { useBerachainMarkets } from 'src/components/Berachain/hooks/useBerachainMarkets';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { BerachainMarketFilter } from '../BerachainMarketFilter/BerachainMarketFilter';
import { BerachainMarketFilterItem } from '../BerachainMarketFilter/BerachainMarketFilter.style';
import {
  BerachainMarketFilterArrow,
  BerachainMarketFiltersButton,
} from '../BerachainMarkets.style';
import { BerachainMarketsFilterBox } from './BerachainMarketsFilters.style';

export const BerachainFilterProtocolsMenu = () => {
  const { data: berachainMarkets } = useBerachainMarkets();
  const { protocolFilter, setProtocolFilter } = useBerachainMarketsFilterStore(
    (state) => state,
  );
  const [anchorTokenEl, setAnchorProtocolEl] = useState<null | HTMLElement>(
    null,
  );
  const [openProtocolsFilterMenu, setOpenProtocolsFilterMenu] = useState(false);

  const handleTokensFilterClick = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (openProtocolsFilterMenu) {
      setAnchorProtocolEl(null);
      setOpenProtocolsFilterMenu(false);
    } else {
      setAnchorProtocolEl(event.currentTarget);
      setOpenProtocolsFilterMenu(true);
    }
  };
  const assetsFilterId = 'token-filter-button';
  const assetsMenuId = 'token-filter-menu';

  // @ts-expect-error
  const data = useBerachainMarketProtocols(berachainMarkets);

  return (
    <BerachainMarketsFilterBox>
      {/* <Typography variant="bodySmall" color={'text.primary'}>
        Protocols
      </Typography> */}
      <BerachainMarketFiltersButton
        id={assetsFilterId}
        aria-controls={openProtocolsFilterMenu ? assetsMenuId : undefined}
        aria-haspopup="true"
        aria-expanded={openProtocolsFilterMenu ? 'true' : undefined}
        onClick={handleTokensFilterClick}
      >
        <Typography variant="bodySmall">All Protocols</Typography>
        <BerachainMarketFilterArrow active={openProtocolsFilterMenu} />
      </BerachainMarketFiltersButton>
      <BerachainMarketFilter
        open={openProtocolsFilterMenu}
        setOpen={setOpenProtocolsFilterMenu}
        anchorEl={anchorTokenEl}
        setAnchorEl={setAnchorProtocolEl}
        idLabel={assetsFilterId}
        idMenu={assetsMenuId}
      >
        {data?.map((protocol: string, index: number) => {
          if (!protocol) {
            return null;
          }
          return (
            <BerachainMarketFilterItem
              key={`berachain-protocol-filter-${index}-${protocol}`}
              onClick={() => {
                setProtocolFilter(protocol);
              }}
            >
              {protocolFilter.includes(protocol) ? (
                <RadioButtonUncheckedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              ) : (
                <CheckCircleRoundedIcon
                  sx={{ color: '#FF8425', width: '24px', height: '24px' }}
                />
              )}
              <Typography variant="bodySmall" marginLeft={'8px'}>
                {protocol}
              </Typography>
            </BerachainMarketFilterItem>
          );
        })}
      </BerachainMarketFilter>
    </BerachainMarketsFilterBox>
  );
};
