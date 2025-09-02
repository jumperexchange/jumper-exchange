import { FC } from 'react';
import generateKey from 'src/app/lib/generateKey';
import {
  InstructionsAccordion,
  type InstructionItemProps,
} from 'src/components/Blog/CTAs/InstructionsAccordion/InstructionsAccordion';

interface InstructionsRendererProps {
  text: string;
}

export const InstructionsRenderer: FC<InstructionsRendererProps> = ({
  text,
}) => {
  const instructions_array: InstructionItemProps[] = [];
  try {
    let jso = text.replace('<INSTRUCTIONS ', '').replace('/>', '');

    // Parse the JSON string and push each parsed object into the instructions_array
    JSON.parse(jso).forEach((obj: InstructionItemProps) => {
      instructions_array.push(obj);
    });
  } catch (error) {
    console.error('Error parsing instructions', error);
    return null;
  }

  return (
    <InstructionsAccordion
      data={instructions_array}
      key={generateKey('instructions')}
    />
  );
};
