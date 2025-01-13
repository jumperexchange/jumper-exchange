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
      itemSx={(theme) => ({
        padding: theme.spacing(1.5),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(2, 3),
        },
        typography: {
          xs: theme.typography.urbanistTitleXSmall,
          sm: theme.typography.urbanistBody2XLarge,
          md: theme.typography.urbanistBody2XLarge,
        },
      })}
      itemAnswerSx={(theme) => ({
        fontSize: '100px',
        typography: {
          xs: theme.typography.bodySmall,
          sm: theme.typography.bodyMedium,
          md: theme.typography.bodyMedium,
        },
      })}
      questionTextTypography={'urbanistTitleXSmall'}
      accordionHeader={
        <AccordionHeader>
          <AccordionTitle
            variant="urbanistTitleXLarge"
            sx={(theme) => ({
              margin: theme.spacing(2, 0),
              letterSpacing: 0,
              textAlign: 'center',
              [theme.breakpoints.up('sm')]: {
                margin: theme.spacing(4, 'auto'),
              },
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
      sx={{ marginTop: 10, padding: 1 }}
    />
  );
};
