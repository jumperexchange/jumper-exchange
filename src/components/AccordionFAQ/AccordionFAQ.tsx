import { QAJsonSchema } from '@/components/JsonSchema';
import { type SxProps, type Theme } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionBox,
  AccordionDetails,
  AccordionDivider,
  AccordionHeader,
  AccordionIndex,
  AccordionItemWrapper,
  AccordionSummary,
  AccordionTitle,
  AccordionToggleButton,
  FaqShowMoreArrow,
} from '.';

export interface FaqProps {
  Question: string;
  Answer: string;
}
interface AccordionFAQProps {
  title?: string;
  content: FaqProps[];
  sx?: SxProps<Theme>;
  itemSx?: SxProps<Theme>;
  accordionHeader?: ReactElement;
  showIndex?: boolean;
  questionTextTypography?: TypographyProps['variant'];
  answerTextTypography?: TypographyProps['variant'];
  arrowSize?: number;
  showDivider?: boolean;
}

export const AccordionFAQ = ({
  content,
  title,
  sx,
  itemSx,
  accordionHeader,
  showIndex,
  questionTextTypography,
  answerTextTypography,
  arrowSize,
  showDivider,
}: AccordionFAQProps) => {
  const { t } = useTranslation();

  return !!content?.length ? (
    <>
      <AccordionBox sx={sx}>
        {accordionHeader ?? (
          <AccordionHeader>
            <AccordionTitle variant="urbanistTitleXLarge">
              {title || t('blog.faq')}
            </AccordionTitle>
          </AccordionHeader>
        )}
        <AccordionItemWrapper>
          {content?.map((el: FaqProps, index: number) => (
            <Accordion key={`faq-item-${index}`} sx={itemSx}>
              <AccordionSummary
                expandIcon={
                  <AccordionToggleButton sx={{ color: 'text.primary' }}>
                    <FaqShowMoreArrow arrowSize={arrowSize} />
                  </AccordionToggleButton>
                }
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                {showIndex && <AccordionIndex>{index + 1}</AccordionIndex>}
                <Typography
                  variant={questionTextTypography || 'urbanistBody2XLarge'}
                >
                  {el.Question}
                </Typography>
              </AccordionSummary>
              {showDivider && <AccordionDivider />}
              <AccordionDetails sx={{ '& > img': { width: '100%' } }}>
                <Typography variant={answerTextTypography || 'bodyMedium'}>
                  {el.Answer}
                </Typography>
                {/* <BlocksRenderer content={el.Answer} /> */}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionItemWrapper>
      </AccordionBox>
      <QAJsonSchema data={content} />
    </>
  ) : null;
};
