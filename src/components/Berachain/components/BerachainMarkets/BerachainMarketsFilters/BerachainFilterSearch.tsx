import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  alpha,
  Autocomplete,
  darken,
  InputAdornment,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { berachainMarkets } from 'src/components/Berachain/hooks/useBerachainMarket';
import { useBerachainMarkets } from 'src/components/Berachain/hooks/useBerachainMarkets';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
export const BerachainFilterSearchMenu = () => {
  const theme = useTheme();
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const { search, setSearch } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  const data = useBerachainMarkets(berachainMarkets);
  return (
    <Autocomplete
      autoComplete={true}
      size="small"
      autoSelect={true}
      // open={true} // for debugging
      clearOnEscape={false}
      onFocus={() => setIsInputEmpty(false)}
      onBlur={() => !search && setIsInputEmpty(true)}
      onInputChange={(event, value) => {
        setIsInputEmpty(value.length === 0);
        if (search === value) {
          setSearch(undefined);
        } else {
          setSearch(value);
        }
      }}
      // padding-top: 0;
      // padding-bottom: 0;
      // height: 40px;
      sx={{
        height: '40px',
        width: '280px',
        padding: 0,
        alignSelf: 'flex-end',
        '&:hover': {
          '.MuiOutlinedInput-root .MuiOutlinedInput-root': {
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              border: '1px solid red', //#554F4E
            },
          },
        },
      }}
      slotProps={{
        paper: {
          sx: {
            // paper menu container
            padding: '12px 8px',
            borderRadius: '8px',
            border: '1px solid #383433',
            background: '#1E1D1C',
            // list-container
            '& .MuiAutocomplete-listbox': {
              padding: 0,
              // selected option
              '& .MuiAutocomplete-option[data-focus="true"]': {
                background: 'blue',
              },
              '& .MuiAutocomplete-option[aria-selected="true"]': {
                background: alpha(theme.palette.white.main, 0.16),
                border: '1px solid #FF8425',
                '&:hover': {
                  background: alpha(theme.palette.white.main, 0.16),
                },
              },
              '& .MuiAutocomplete-option[aria-selected="true"].Mui-focused': {
                border: '1px solid #FF8425',
                background: alpha(theme.palette.white.main, 0.16),
              },
              // option
              '& .MuiAutocomplete-option': {
                borderRadius: '8px',
                background: alpha(theme.palette.white.main, 0.08),
                marginTop: theme.spacing(0.5),
                paddingLeft: theme.spacing(1),
                paddingRight: theme.spacing(1),
                ':first-of-type': {
                  marginTop: 0,
                },
                '&:hover': {
                  background: alpha(theme.palette.white.main, 0.16),
                },
              },
            },
          },
        },
      }}
      options={data}
      // disablePortal
      renderInput={(params) => (
        <TextField
          sx={{
            height: '40px',
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: '#313131',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease-in-out',

            '&:hover': {
              backgroundColor: darken('#313131', 0.16),
            },
          }}
          {...params}
          label={!isInputEmpty ? 'Search for markets or assets' : undefined}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{ width: '24px', height: '24px', color: 'text.primary' }}
                />
                {isInputEmpty && (
                  <Typography variant="bodySmall" color={'text.primary'}>
                    Search for markets or assets
                  </Typography>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
