'use client';
import { alpha, Box, darken, Typography } from '@mui/material';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { SeoPageContainer } from 'src/components/SeoPageContainer.style';

const SwapExplanationSection = () => {
  const faqData = [
    { Question: 'Some Question here 1', Answer: 'Some Answer here 1' },
    { Question: 'Some Question here 2', Answer: 'Some Answer here 2' },
  ];
  return (
    <SeoPageContainer
      sx={(theme) => ({
        width: '100%',
        backgroundColor: alpha(theme.palette.white.main, 0.48),
      })}
    >
      <AccordionFAQ
        accordionHeader={
          <Box sx={(theme) => ({ marginBottom: theme.spacing(2) })}>
            <Typography variant="h2">FAQ</Typography>
          </Box>
        }
        content={faqData}
        questionTextTypography="bodyLargeStrong"
        itemSx={(theme) => ({
          background: theme.palette.white.main,
          boxShadow: theme.palette.shadow.main,
          '&:hover': {
            background: darken(theme.palette.white.main, 0.04),
          },
        })}
      />
    </SeoPageContainer>
  );
};

export default SwapExplanationSection;
