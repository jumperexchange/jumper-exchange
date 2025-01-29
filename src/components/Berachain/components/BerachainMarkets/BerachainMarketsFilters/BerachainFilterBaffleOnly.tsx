import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import Checkbox from '@mui/material/Checkbox';
import { BerachainMarketBaffleFormControlLabel } from '@/components/Berachain/components/BerachainMarkets/BerachainMarkets.style';
export const BerachainFilterBaffleOnly = () => {
  const { baffleOnly, setBaffleOnly } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaffleOnly(event.target.checked);
  };

  return (
    <BerachainMarketBaffleFormControlLabel
      control={<Checkbox onChange={handleChange} checked={baffleOnly} />}
      label="Baffle Only"
    />
  );
};
