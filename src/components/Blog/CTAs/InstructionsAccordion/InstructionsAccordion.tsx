import { InstructionsAccordionContainer } from './InstructionsAccordion.style';
import {
  InstructionsAccordionItem,
  type InstructionItemProps,
} from './InstructionsAccordionItem';

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
  variant?: string;
}

export const InstructionsAccordion = ({
  data,
  variant,
}: InstructionsAccordionProps) => {
  if (!data) {
    return;
  }

  return (
    <InstructionsAccordionContainer>
      {data?.map((el, index) => (
        <InstructionsAccordionItem
          key={`instructions-accordion-item-${index}`}
          index={index}
          title={el.title}
          step={el.step}
          link={el.link}
          buttonTitles={el.buttonTitles}
          buttonLinks={el.buttonLinks}
          variant={variant}
        />
      ))}
    </InstructionsAccordionContainer>
  );
};
