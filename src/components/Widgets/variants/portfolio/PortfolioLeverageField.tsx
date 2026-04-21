'use client';

import {
  ContentContainer,
  FieldWrapper,
} from '@/components/composite/JumperWidget/JumperWidget.style';
import {
  StyledSlider,
  StyledSliderContainer,
  StyledSliderRangeContainer,
} from '@/components/core/form/Select/Select.styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const MIN_LEVERAGE = 1;
const DEFAULT_MAX_LEVERAGE = 5;

interface PortfolioLeverageFieldProps {
  value: number;
  max?: number;
  onChange: (value: number) => void;
}

export function PortfolioLeverageField({
  value,
  max = DEFAULT_MAX_LEVERAGE,
  onChange,
}: PortfolioLeverageFieldProps) {
  return (
    // <ContentContainer sx={{ paddingBottom: 0 }}>
    <FieldWrapper>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="bodySmallStrong">
          Target Leverage Factor
        </Typography>
        <Typography variant="bodySmallStrong">{value.toFixed(1)}x</Typography>
      </Box>
      <StyledSliderContainer>
        <StyledSlider
          value={value}
          min={MIN_LEVERAGE}
          max={max}
          step={0.1}
          onChange={(_, v) => onChange(v as number)}
          valueLabelDisplay="off"
          sx={{
            '& .MuiSlider-rail': {
              margin: 0,
              width: '100%',
            },
          }}
        />
        <StyledSliderRangeContainer>
          <Typography variant="bodyXSmall">{MIN_LEVERAGE}x</Typography>
          <Typography variant="bodyXSmall">{max.toFixed(1)}x</Typography>
        </StyledSliderRangeContainer>
      </StyledSliderContainer>
    </FieldWrapper>
    // </ContentContainer>
  );
}
