import { type ThemeModesSupported } from 'src/types/settings';
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
  buttonTitles?: string[];
  buttonLinks?: string[];
  activeThemeMode?: ThemeModesSupported;
  variant?: string;
}

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
  activeThemeMode?: ThemeModesSupported;
  variant?: string;
}

export const InstructionsAccordion = ({
  data,
  activeThemeMode,
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
          activeThemeMode={activeThemeMode}
          variant={variant}
        />
      ))}
    </InstructionsAccordionContainer>
  );
};
