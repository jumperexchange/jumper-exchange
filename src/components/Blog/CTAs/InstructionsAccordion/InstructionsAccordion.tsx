import { ThemeModesSupported } from 'src/types/settings';
import { InstructionsAccordionContainer, InstructionsAccordionItem } from '.';

interface InstructionsItemLink {
  label: string;
  url: string;
}

interface ButtonInfoStruct {
  link: string;
  text: string;
}

export interface InstructionItemProps {
  title: string;
  step?: string;
  link?: InstructionsItemLink;
  url?: string;
  buttonTitles?: string[];
  buttonLinks?: string[];
  activeTheme?: ThemeModesSupported;
  variant?: string;
}

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
  activeTheme?: ThemeModesSupported;
  variant?: string;
}

export const InstructionsAccordion = ({
  data,
  activeTheme,
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
          activeTheme={activeTheme}
          variant={variant}
        />
      ))}
    </InstructionsAccordionContainer>
  );
};
