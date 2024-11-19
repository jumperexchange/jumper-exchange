import { QAJsonSchema } from '@/components/JsonSchema';
import { type SxProps, type Theme } from '@mui/material';
import type { TypographyProps } from '@mui/material/Typography';
import Typography from '@mui/material/Typography';
import type { ReactElement } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionBox,
  AccordionDetails,
  AccordionHeader,
  AccordionIndex,
  AccordionItemWrapper,
  AccordionSummary,
  AccordionTitle,
  FaqShowMoreArrow,
  FaqShowMoreIconButton,
} from '.';

export interface FaqProps {
  Question: string;
  Answer: string;
}
interface AccordionFAQProps {
  title?: string;
  content: FaqProps[];
  sx?: SxProps<Theme>;
  accordionHeader?: ReactElement;
  showIndex?: boolean;
  questionTextTypography?: TypographyProps['variant'];
  answerTextTypography?: TypographyProps['variant'];
  arrowSize?: number;
}

export const AccordionFAQ = ({
  content,
  title,
  sx,
  accordionHeader,
  showIndex,
  questionTextTypography,
  answerTextTypography,
  arrowSize,
}: AccordionFAQProps) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  // const handleShowMore = () => {
  //   setShow(!show);
  // };

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
            <Accordion key={`faq-item-${index}`}>
              <AccordionSummary
                expandIcon={
                  <FaqShowMoreIconButton sx={{ color: 'text.primary' }}>
                    <FaqShowMoreArrow active={show} arrowSize={arrowSize} />
                  </FaqShowMoreIconButton>
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
              {/* <AccordionDivider /> */}
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
