import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  alpha,
  darken,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Breakpoint } from '@mui/material/styles';
export const BerachainSearch = () => {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { search, setSearch } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  useEffect(() => {
    if (searchParams.has('q')) {
      setSearch(searchParams.get('q')!);
    }
  }, []);

  return (
    <TextField
      placeholder="Search for markets"
      id="outlined-start-adornment"
      onChange={(e) => {
        setSearch(e.target.value);
        router.push('?q=' + e.target.value);
      }}
      defaultValue={searchParams.get('q')}
      sx={{
        m: 0.5,
        width: '30ch',
        // padding: '12px 8px',
        borderRadius: '16px',
        border: '1px solid #383433',
        background: '#1E1D1C',
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchRoundedIcon
                sx={{
                  width: '24px',
                  // height: '24px',
                  color: alpha(theme.palette.text.primary, 0.48),
                  height: 48,
                  // width: 280,
                  // padding: 0,
                  // alignSelf: 'flex-end',
                  '.MuiOutlinedInput-root': {
                    height: 48,
                    padding: theme.spacing(1, 2),
                    borderRadius: '8px',
                  },
                  [theme.breakpoints.down('md' as Breakpoint)]: {
                    display: 'none',
                  },
                }}
              />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};
