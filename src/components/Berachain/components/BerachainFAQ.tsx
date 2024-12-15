import {
  AccordionFAQ,
  AccordionHeader,
  AccordionTitle,
} from 'src/components/AccordionFAQ';
import { useBerachainFaq } from '../hooks/useBerachainFaq';

export const BerachainFAQ = () => {
  const faqItems = useBerachainFaq();
  return (
    <AccordionFAQ
      title="Frequently Asked Questions"
      itemSx={(theme) => ({
        typography: {
          xs: theme.typography.urbanistTitleMedium,
          sm: theme.typography.urbanistTitleLarge,
          md: theme.typography.urbanistTitleXLarge,
        },
      })}
      accordionHeader={
        <AccordionHeader>
          <AccordionTitle
            variant="urbanistTitleXLarge"
            sx={(theme) => ({
              letterSpacing: 0,
              typography: {
                xs: theme.typography.urbanistTitleMedium,
                sm: theme.typography.urbanistTitleLarge,
                md: theme.typography.urbanistTitleXLarge,
              },
            })}
          >
            Frequently Asked Questions
          </AccordionTitle>
        </AccordionHeader>
      }
      content={faqItems}
      arrowSize={18}
      sx={{ marginTop: 10 }}
    />
  );
};
