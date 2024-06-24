import { getContrastAlphaColor } from '@/utils/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import type { InstructionItemProps } from '.';
import {
  InstructionsAccordionItemContainer,
  InstructionsAccordionItemHeader,
  InstructionsAccordionItemIndex,
  InstructionsAccordionItemLabel,
  InstructionsAccordionItemMain,
  InstructionsAccordionItemMore,
  InstructionsAccordionToggle,
} from '.';

interface InstructionsAccordionItemProps extends InstructionItemProps {
  index: number;
}

// Function to parse links within the title
const parseTitle = (title: string, link: { label: string; url: string }) => {
  // Replace <LINK> with anchor tag
  const rawText = title.split('<LINK>');
  let cleanText = '';
  rawText.map((el, index) => {
    if (el !== '') {
      cleanText += `<p>${el}</p>`;
      if (index < rawText.length - 1) {
        cleanText += `<a href="${link.url}" target="${!link.url.includes('jumper.exchange') || link.url[0] === '/' ? '_self' : '_blank'}">${link.label}</a>`;
      }
    }
    return undefined;
  });
  return cleanText;
};

export const InstructionsAccordionItem = ({
  title,
  step,
  link,
  index,
  url,
}: InstructionsAccordionItemProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));
  const handleOpen:
    | MouseEventHandler<HTMLDivElement | HTMLButtonElement>
    | undefined = (e) => {
    e.stopPropagation();
    step && setOpen((prev) => !prev);
  };
  return (
    <InstructionsAccordionItemContainer>
      <InstructionsAccordionItemMain onClick={(e) => handleOpen(e)}>
        <InstructionsAccordionItemHeader>
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
        </InstructionsAccordionItemHeader>
        {step ? (
          isTablet ? (
            <InstructionsAccordionToggle onClick={(e) => handleOpen(e)}>
              <ExpandMoreIcon
                sx={{
                  ...(open && { transform: 'rotate(180deg)' }),
                }}
              />
            </InstructionsAccordionToggle>
          ) : (
            <ExpandMoreIcon
              sx={{
                color: getContrastAlphaColor(theme, 0.32),
                ...(open && { transform: 'rotate(180deg)' }),
              }}
            />
          )
        ) : null}
      </InstructionsAccordionItemMain>

      {open ? (
        <InstructionsAccordionItemMore>{step}</InstructionsAccordionItemMore>
      ) : null}
    </InstructionsAccordionItemContainer>
  );
};
