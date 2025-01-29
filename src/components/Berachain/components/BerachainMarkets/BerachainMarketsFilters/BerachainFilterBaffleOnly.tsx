import {
  FormControlLabel,
  useTheme,
} from '@mui/material';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import Checkbox from '@mui/material/Checkbox';
export const BerachainFilterBaffleOnly = () => {
  const { baffleOnly, setBaffleOnly } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBaffleOnly(event.target.checked);
  };

  return (
    <FormControlLabel sx={(theme) => ({
      color: theme.palette.text.primary,
    })} control={<Checkbox onChange={handleChange} checked={baffleOnly} />} label="Baffle Only" />
  )
};
