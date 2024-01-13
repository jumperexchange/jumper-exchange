import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';

export const CustomSlider = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleDecrease = () => {
    setValue((prevValue) => (prevValue > 0 ? prevValue - 1 : 0));
  };

  const handleIncrease = () => {
    setValue((prevValue) => (prevValue < 100 ? prevValue + 1 : 100));
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handleDecrease}>
        <ArrowBackIosIcon />
      </IconButton>

      <IconButton onClick={handleIncrease}>
        <ArrowForwardIosIcon />
      </IconButton>
    </div>
  );
};
