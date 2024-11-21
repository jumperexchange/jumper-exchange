import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
  alpha,
  darken,
  InputAdornment,
  TextField,
  useTheme,
} from '@mui/material';
import { useState } from 'react';
import { berachainMarkets } from 'src/components/Berachain/const/berachainExampleData';
import { useBerachainMarkets } from 'src/components/Berachain/hooks/useBerachainMarkets';
import { useBerachainMarketsFilterStore } from 'src/components/Berachain/stores/BerachainMarketsFilterStore';
import { BerachainSearchAutocomplete } from './BerachainSearch.style';
export const BerachainSearch = () => {
  const theme = useTheme();
  const [isInputEmpty, setIsInputEmpty] = useState(true);

  const { search, setSearch } = useBerachainMarketsFilterStore(
    (state) => state,
  );

  const data = useBerachainMarkets(berachainMarkets);
  return (
    <BerachainSearchAutocomplete
      autoComplete={true}
      size="medium"
      popupIcon={null}
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
            paddingTop: 0,
            paddingBottom: 0,
            backgroundColor: '#313131',
            borderRadius: '8px',
            transition: 'background-color 0.3s ease-in-out',
            '&:hover': {
              backgroundColor: darken('#313131', 0.16),
            },
            '& .MuiInputBase-input::placeholder': {
              opacity: isInputEmpty ? 1 : 0,
              color: alpha(theme.palette.text.primary, 0.48),
              transition: 'opacity 0.2s ease-in-out',
              typography: theme.typography.bodyMedium,
            },
          }}
          {...params}
          placeholder="Search for markets"
          InputLabelProps={{
            ...params.InputLabelProps,
            shrink: false,
          }}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchRoundedIcon
                  sx={{
                    width: '24px',
                    height: '24px',
                    color: alpha(theme.palette.text.primary, 0.48),
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
      )}
    />
  );
};
