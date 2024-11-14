import { QAJsonSchema } from '@/components/JsonSchema';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionContainer,
  AccordionDetails,
  AccordionHeader,
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
}

export const AccordionFAQ = ({ content, title }: AccordionFAQProps) => {
  const [show, setShow] = useState(false);
  const { t } = useTranslation();
  // const handleShowMore = () => {
  //   setShow(!show);
  // };

  return !!content?.length ? (
    <>
      <AccordionContainer>
        <AccordionHeader onClick={() => setShow(!show)}>
          <AccordionTitle variant="urbanistTitleXLarge">
            {title || t('blog.faq')}
          </AccordionTitle>

          {/* <AccordionToggleButton aria-label="Show more" onClick={handleShowMore}>
          <ExpandMoreIcon sx={{ width: 24, height: 24 }} />
        </AccordionToggleButton> */}
        </AccordionHeader>
        <AccordionItemWrapper>
          {content?.map((el: FaqProps, index: number) => (
            <Accordion key={`faq-item-${index}`}>
              <AccordionSummary
                expandIcon={
                  <FaqShowMoreIconButton sx={{ color: 'text.primary' }}>
                    <FaqShowMoreArrow active={show} />
                  </FaqShowMoreIconButton>
                }
                aria-controls={`panel${index}a-content`}
                id={`panel${index}a-header`}
              >
                <Typography variant="urbanistBody2XLarge">
                  {el.Question}
                </Typography>
              </AccordionSummary>
              {/* <AccordionDivider /> */}
              <AccordionDetails sx={{ '& > img': { width: '100%' } }}>
                <Typography variant="bodyMedium">{el.Answer}</Typography>
                {/* <BlocksRenderer content={el.Answer} /> */}
              </AccordionDetails>
            </Accordion>
          ))}
        </AccordionItemWrapper>
      </AccordionContainer>
      <QAJsonSchema data={content} />
    </>
  ) : null;
};
