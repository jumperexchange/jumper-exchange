import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Typography } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import {
  IconButtonSecondary,
  InstructionsAccordionItemContainer,
  InstructionsAccordionItemIndex,
  InstructionsAccordionItemLabel,
  InstructionsAccordionItemMain,
  InstructionsAccordionItemMore,
} from 'src/components';
import type { InstructionItemProps } from '.';

interface InstructionsAccordionItemProps extends InstructionItemProps {
  index: number;
}

// Function to parse links within the title
const parseTitle = (title: string, link: { label: string; url: string }) => {
  // Replace <LINK> with anchor tag
  return title.replace('<LINK>', `<a href="${link.url}">${link.label}</a>`);
};

export const InstructionsAccordionItem = ({
  title,
  step,
  link,
  index,
}: InstructionsAccordionItemProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen:
    | MouseEventHandler<HTMLDivElement | HTMLButtonElement>
    | undefined = (e) => {
    e.stopPropagation();
    step && setOpen((prev) => !prev);
  };
  return (
    <InstructionsAccordionItemContainer>
      <InstructionsAccordionItemMain onClick={(e) => handleOpen(e)}>
        <Box sx={{ display: 'flex' }}>
          <InstructionsAccordionItemIndex>
            {index + 1}
          </InstructionsAccordionItemIndex>
          {link ? (
            <InstructionsAccordionItemLabel
              dangerouslySetInnerHTML={{ __html: parseTitle(title, link) }}
            />
          ) : (
            <InstructionsAccordionItemLabel>
              {title}
            </InstructionsAccordionItemLabel>
          )}
        </Box>
        {step ? (
          <IconButtonSecondary
            onClick={(e) => handleOpen(e)}
            sx={{ width: '40px', height: '40px' }}
          >
            <ExpandMoreIcon
              sx={{ ...(open && { transform: 'rotate(180deg)' }) }}
            />
          </IconButtonSecondary>
        ) : null}
      </InstructionsAccordionItemMain>

      {open ? (
        <InstructionsAccordionItemMore>
          <Typography>{step}</Typography>
        </InstructionsAccordionItemMore>
      ) : null}
    </InstructionsAccordionItemContainer>
  );
};
