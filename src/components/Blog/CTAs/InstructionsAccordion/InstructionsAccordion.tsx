import { Box } from '@mui/material';
import { InstructionsAccordionItem } from './InstructionsAccordionItem';

interface InstructionsItemLink {
  label: string;
  url: string;
}
export interface InstructionItemProps {
  title: string;
  step?: string;
  link?: InstructionsItemLink;
}

interface InstructionsAccordionProps {
  data: InstructionItemProps[];
}

export const InstructionsAccordion = (data: InstructionsAccordionProps) => {
  if (!data) {
    return;
  }
  return (
    <Box>
      {data.data?.map((el, index) => (
        <InstructionsAccordionItem
          index={index}
          title={el.title}
          step={el.step}
          link={el.link}
        />
      ))}
    </Box>
  );
};
