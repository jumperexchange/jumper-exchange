import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { alpha, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useState } from 'react';
import { ButtonSecondary } from 'src/components/Button';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { useUserTracking } from 'src/hooks/userTracking';
import type { InstructionItemProps } from '.';
import {
  InstructionsAccordionButtonMainBox,
  InstructionsAccordionItemContainer,
  InstructionsAccordionItemHeader,
  InstructionsAccordionItemIndex,
  InstructionsAccordionItemLabel,
  InstructionsAccordionItemMain,
  InstructionsAccordionItemMore,
  InstructionsAccordionLink,
  InstructionsAccordionLinkLabel,
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

// TODO: Refactor this component to use Accordion component from mui
export const InstructionsAccordionItem = ({
  title,
  step,
  link,
  index,
  url,
  buttonTitles,
  buttonLinks,
  variant,
}: InstructionsAccordionItemProps) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const { trackEvent } = useUserTracking();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));
  const handleOpen:
    | MouseEventHandler<HTMLDivElement | HTMLButtonElement>
    | undefined = (e) => {
    e.stopPropagation();
    step && setOpen((prev) => !prev);
  };

  const handleClick = (i: number) => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickMissionCtaSteps,
      label: `click-mission-cta-steps`,
      data: {
        [TrackingEventParameter.MissionCtaStepsTitle]: title || '',
        [TrackingEventParameter.MissionCtaStepsLink]: buttonLinks?.[i] || '',
        [TrackingEventParameter.MissionCtaStepsCTA]: buttonTitles?.[i] || '',
        [TrackingEventParameter.MissionCtaStepsIndex]: index || -1,
      },
    });
  };

  return (
    <InstructionsAccordionItemContainer
      sx={[
        {
          typograpy: null,
        },
        {
          borderColor: null,
        },
      ]}
    >
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
              <ExpandMoreIcon sx={[open && { transform: 'rotate(180deg)' }]} />
            </InstructionsAccordionToggle>
          ) : (
            <ExpandMoreIcon
              sx={[
                {
                  color: alpha(theme.palette.white.main, 0.32),
                  ...theme.applyStyles('light', {
                    color: alpha(theme.palette.black.main, 0.32),
                  }),
                },
                open && { transform: 'rotate(180deg)' },
              ]}
            />
          )
        ) : null}
      </InstructionsAccordionItemMain>
      {open ? (
        <InstructionsAccordionItemMore>
          <>
            <Typography>{step}</Typography>
            {buttonLinks && buttonTitles && buttonTitles.length > 0 ? (
              <InstructionsAccordionButtonMainBox>
                {buttonTitles.map((_, i: number) => {
                  return (
                    <InstructionsAccordionLink
                      href={buttonLinks[i]}
                      as={ButtonSecondary}
                      size="small"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => handleClick(i)}
                    >
                      <InstructionsAccordionLinkLabel
                        variant={'bodyMediumStrong'}
                        as={'span'}
                      >
                        {buttonTitles[i]}
                      </InstructionsAccordionLinkLabel>
                      <ArrowForwardIcon />
                    </InstructionsAccordionLink>
                  );
                })}
              </InstructionsAccordionButtonMainBox>
            ) : null}
          </>
        </InstructionsAccordionItemMore>
      ) : null}
    </InstructionsAccordionItemContainer>
  );
};
