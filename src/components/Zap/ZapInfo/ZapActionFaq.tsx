import { Typography } from '@mui/material';
import { AccordionFAQ, AccordionHeader } from 'src/components/AccordionFAQ';
import { ZapActionProtocolCard } from './ZapInfo.style';
import type { CustomInformation } from 'src/types/loyaltyPass';

interface ZapActionFaqProps {
  detailInformation?: CustomInformation;
}

const ZapActionFaqAccordionHeader = () => {
  return (
    <AccordionHeader sx={{ margin: 0, marginBottom: '4px', marginLeft: '8px' }}>
      <Typography variant="title2XSmall">How to participate</Typography>
    </AccordionHeader>
  );
};

export const ZapActionFaq = ({ detailInformation }: ZapActionFaqProps) => {
  return (
    <ZapActionProtocolCard sx={{ padding: '20px 12px' }}>
      <AccordionFAQ
        showIndex={true}
        showDivider={true}
        showAnswerDivider={true}
        sx={{
          padding: 0,
          '& .faq-item': {
            padding: '0px 8px',
            backgroundColor: 'transparent',
            '.MuiAccordionSummary-root': {
              padding: 0,
            },
            '.accordion-items': {
              gap: '4px',
            },
            '.MuiAccordionDetails-root': {
              padding: '20px 16px 16px',
            },
          },
        }}
        content={detailInformation?.faqItems}
        accordionHeader={<ZapActionFaqAccordionHeader />}
        questionTextTypography="bodyLarge"
        answerTextTypography="bodyMedium"
        arrowSize={12}
      />
    </ZapActionProtocolCard>
  );
};
