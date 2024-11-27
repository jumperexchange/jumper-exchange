import { AccordionFAQ } from 'src/components/AccordionFAQ';
import { useBerachainFaq } from '../hooks/useBerachainFaq';

export const BerachainFAQ = () => {
  const faqItems = useBerachainFaq();
  return (
    <AccordionFAQ
      title="Frequently Asked Questions"
      content={faqItems}
      arrowSize={18}
      sx={{ marginTop: 10 }}
    />
  );
};
