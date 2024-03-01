import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import {
  IconButtonTertiary,
  InstructionsAccordionItemContainer,
  InstructionsAccordionItemIndex,
  InstructionsAccordionItemLabel,
  InstructionsAccordionItemMain,
  InstructionsAccordionItemMore,
} from 'src/components';
import { getContrastAlphaColor } from 'src/utils';
import type { InstructionItemProps } from '.';

interface InstructionsAccordionItemProps extends InstructionItemProps {
  index: number;
}

// Function to parse links within the title
const parseTitle = (title: string, link: { label: string; url: string }) => {
  // Replace <LINK> with anchor tag
  console.log('title', title);
  return title.replace(
    '<LINK>',
    `<a href="${link.url}" target="${link.url.includes(window.location.host) || link.url[0] === '/' ? '_self' : '_blank'}">${link.label}</a>`,
  );
};

export const InstructionsAccordionItem = ({
  title,
  step,
  link,
  index,
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
          isTablet ? (
            <IconButtonTertiary
              onClick={(e) => handleOpen(e)}
              sx={{ width: '40px', height: '40px' }}
            >
              <ExpandMoreIcon
                sx={{
                  ...(open && { transform: 'rotate(180deg)' }),
                }}
              />
            </IconButtonTertiary>
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
