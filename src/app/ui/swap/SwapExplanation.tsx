'use client';
import { Box, Typography, alpha } from '@mui/material';
import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { DynamicPagesContainer } from 'src/components/DynamicPagesContainer';

const SwapExplanationSection = () => {
  const faqData = [
    { Question: 'Some Question here 1', Answer: 'Some Answer here 1' },
    { Question: 'Some Question here 2', Answer: 'Some Answer here 2' },
  ];
  return (
    <DynamicPagesContainer
      sx={() => ({
        width: '100%',
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
          background: theme.palette.bgSecondary.main,
          boxShadow: theme.palette.shadow.main,
          '&:hover': {
            background:
              theme.palette.mode === 'light'
                ? theme.palette.white.main
                : alpha(theme.palette.white.main, 0.16),
          },
        })}
      />
    </DynamicPagesContainer>
  );
};

export default SwapExplanationSection;
