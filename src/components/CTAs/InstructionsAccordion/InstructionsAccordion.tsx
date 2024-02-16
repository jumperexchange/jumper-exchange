import { InstructionsAccordionContainer } from './InstructionsAccordion.style';
import { InstructionsAccordionItem } from './InstructionsAccordionItem';

export interface InstructionItemProps {
  title: string;
  step: string;
}

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
}

export const InstructionsAccordion = (data: InstructionsAccordionProps) => {
  if (!data) {
    return;
  }
  return (
    <InstructionsAccordionContainer>
      {data.data?.map((el, index) => (
        <InstructionsAccordionItem
          index={index}
          title={el.title}
          step={el.step}
        />
      ))}
    </InstructionsAccordionContainer>
  );
};
