import { getContrastAlphaColor } from '@/utils/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { Breakpoint } from '@mui/material';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import type { MouseEventHandler } from 'react';
import { useEffect, useState } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from 'src/const/trackingKeys';
import { sora } from 'src/fonts/fonts';
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
  InstructionsAccordionLinkBox,
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
  buttonTitles,
  buttonLinks,
  activeThemeMode,
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

  const isSuperfest = variant === 'superfest';

  useEffect(() => {
    if (variant === 'superfest') {
      setOpen(true);
    }
  }, []);

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
      sx={{
        typograpy: isSuperfest ? sora.style.fontFamily : undefined,
        borderColor: isSuperfest ? theme.palette.black.main : undefined,
      }}
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
        <InstructionsAccordionItemMore>
          <>
            <Typography>{step}</Typography>
            {buttonLinks && buttonTitles && buttonTitles.length > 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignContent: 'center',
                  justifyContent: 'flex-start',
                  mt: '8px',
                }}
              >
                {buttonTitles.map((_, i: number) => {
                  return (
                    <InstructionsAccordionButtonMainBox
                      typography={
                        variant === 'superfest'
                          ? sora.style.fontFamily
                          : undefined
                      }
                      key={`external-link-${i}`}
                    >
                      <a
                        href={buttonLinks[i]}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none', color: 'inherit' }}
                        onClick={() => handleClick(i)}
                      >
                        <InstructionsAccordionLinkBox>
                          <Typography
                            variant={'bodyMediumStrong'}
                            component={'span'}
                            mr={'8px'}
                            sx={(theme) => ({
                              color: theme.palette.text.primary,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              maxWidth: 208,
                              [theme.breakpoints.up('sm' as Breakpoint)]: {
                                maxWidth: 168,
                              },
                            })}
                          >
                            {buttonTitles[i]}
                          </Typography>
                          <ArrowForwardIcon
                            style={{
                              color: theme.palette.text.primary,
                            }}
                          />
                        </InstructionsAccordionLinkBox>
                      </a>
                    </InstructionsAccordionButtonMainBox>
                  );
                })}
              </Box>
            ) : null}
          </>
        </InstructionsAccordionItemMore>
      ) : null}
    </InstructionsAccordionItemContainer>
  );
};
