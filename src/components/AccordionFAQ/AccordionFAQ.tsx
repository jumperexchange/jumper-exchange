import { QAJsonSchema } from '@/components/JsonSchema';
import { type SxProps, type Theme } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccordionBox,
  AccordionHeader,
  AccordionItemWrapper,
  AccordionTitle,
} from '.';
import { AccordionFAQItem } from './AccordionFAQItem';

export interface FaqProps {
  Question: string;
  Answer: string;
}
interface AccordionFAQProps {
  title?: string;
  content: FaqProps[];
  sx?: SxProps<Theme>;
  itemSx?: SxProps<Theme>;
  itemAnswerSx?: SxProps<Theme>;
  accordionHeader?: ReactElement;
  showIndex?: boolean;
  questionTextTypography?: TypographyProps['variant'];
  answerTextTypography?: TypographyProps['variant'];
  arrowSize?: number;
  showDivider?: boolean;
  showAnswerDivider?: boolean;
}

export const AccordionFAQ = ({
  content,
  title,
  sx,
  itemSx = {},
  itemAnswerSx,
  accordionHeader,
  showIndex,
  questionTextTypography,
  answerTextTypography,
  arrowSize,
  showDivider,
  showAnswerDivider,
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
        <AccordionItemWrapper className="accordion-items">
          {content?.map((el: FaqProps, index: number) => (
            <AccordionFAQItem
              key={`faq-item-${index}`}
              showIndex={showIndex}
              arrowSize={arrowSize}
              index={index}
              itemAnswerSx={itemAnswerSx}
              questionTextTypography={questionTextTypography}
              showAnswerDivider={showAnswerDivider}
              answerTextTypography={answerTextTypography}
              showDivider={showDivider}
              question={el.Question}
              answer={el.Answer}
              itemSx={itemSx}
              lastItem={index !== content.length - 1}
            />
          ))}
        </AccordionItemWrapper>
      </AccordionBox>
      <QAJsonSchema data={content} />
    </>
  ) : null;
};
