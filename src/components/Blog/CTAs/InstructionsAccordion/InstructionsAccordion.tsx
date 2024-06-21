import { InstructionsAccordionContainer, InstructionsAccordionItem } from '.';

interface InstructionsItemLink {
  label: string;
  url: string;
}
export interface InstructionItemProps {
  title: string;
  step?: string;
  link?: InstructionsItemLink;
  url?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
}

export const InstructionsAccordion = (data: InstructionsAccordionProps) => {
  if (!data) {
    return;
  }
  console.log(data);
  return (
    <InstructionsAccordionContainer>
      {data.data?.map((el, index) => (
        <InstructionsAccordionItem
          key={`instructions-accordion-item-${index}`}
          index={index}
          title={el.title}
          step={el.step}
          link={el.link}
          buttonText={el.buttonText}
          buttonLink={el.buttonLink}
        />
      ))}
    </InstructionsAccordionContainer>
  );
};
