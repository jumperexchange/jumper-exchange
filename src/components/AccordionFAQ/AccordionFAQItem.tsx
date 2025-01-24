import type { SxProps, Theme } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import {
  Accordion,
  AccordionDetails,
  AccordionDivider,
  AccordionIndex,
  AccordionSummary,
  AccordionToggleButton,
  FaqShowMoreArrow,
} from '.';

interface AccordionFAQItemProps {
  question: string;
  answer: string;
  itemSx?: SxProps<Theme>;
  itemAnswerSx?: SxProps<Theme>;
  index: number;
  showIndex?: boolean;
  questionTextTypography?: TypographyProps['variant'];
  answerTextTypography?: TypographyProps['variant'];
  arrowSize?: number;
  showDivider?: boolean;
  showAnswerDivider?: boolean;
  lastItem: boolean;
}

export const AccordionFAQItem = ({
  showIndex,
  arrowSize,
  index,
  questionTextTypography,
  showAnswerDivider,
  answerTextTypography,
  showDivider,
  question,
  answer,
  itemSx,
  itemAnswerSx,
  lastItem,
}: AccordionFAQItemProps) => {
  return (
    <>
      <Accordion sx={itemSx} className="faq-item">
        <AccordionSummary
          expandIcon={
            <AccordionToggleButton sx={{ color: 'text.primary' }} as="div">
              <FaqShowMoreArrow arrowSize={arrowSize} />
            </AccordionToggleButton>
          }
          aria-controls={`panel${index}a-content`}
          id={`panel${index}a-header`}
        >
          {showIndex && <AccordionIndex>{index + 1}</AccordionIndex>}
          <Typography variant={questionTextTypography || 'urbanistBody2XLarge'}>
            {question}
          </Typography>
        </AccordionSummary>
        {showAnswerDivider && <AccordionDivider />}
        <AccordionDetails
          className="accordion-details"
          sx={{ '& > img': { width: '100%' } }}
        >
          <Typography
            variant={answerTextTypography || 'bodyMedium'}
            sx={itemAnswerSx}
          >
            {answer}
          </Typography>
          {/* <BlocksRenderer content={el.Answer} /> */}
        </AccordionDetails>
      </Accordion>
      {showDivider && lastItem && <AccordionDivider />}
    </>
  );
};
