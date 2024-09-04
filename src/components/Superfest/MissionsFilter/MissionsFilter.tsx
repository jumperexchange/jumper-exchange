import { type Theme, Typography, useTheme } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: '#fff0ca',
    },
  },
};

function getStyles(name: string, personName: readonly string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
interface MissionsFilterProps {
  title: string;
  options: string[];
  activeChoices: string[];
  handleChange: (event: SelectChangeEvent<string[]>) => void;
}
export const MissionsFilter = ({
  title,
  options,
  activeChoices,
  handleChange,
}: MissionsFilterProps) => {
  const theme = useTheme();

  return (
    <FormControl sx={{ width: 120 }}>
      <Select
        multiple
        displayEmpty
        value={activeChoices}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={() => {
          return (
            <Typography
              variant="bodyMediumStrong"
              fontSize="18px"
              lineHeight="24px"
            >
              {
                //* todo: check typography (sora) *//
              }
              {title}
            </Typography>
          );
        }}
        MenuProps={MenuProps}
        inputProps={{ 'aria-label': 'Without label' }}
        onClose={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        {options.map((name) => (
          <MenuItem
            key={name}
            value={name}
            style={getStyles(name, activeChoices, theme)}
          >
            <Checkbox checked={activeChoices.indexOf(name) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
