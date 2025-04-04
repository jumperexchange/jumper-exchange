import { useAccount } from '@lifi/wallet-management';
import { useVerifyTask } from '@/hooks/tasksVerification/useVerifyTask';
import type { Breakpoint } from '@mui/material';
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { TaskVerification } from '@/types/loyaltyPass';
import { type MouseEventHandler, useEffect, useState } from 'react';
import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useUserTracking } from '@/hooks/userTracking';
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
} from '../Blog/CTAs/InstructionsAccordion/InstructionsAccordionItem.style';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getContrastAlphaColor } from '@/utils/colors';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

function isVerified(isSuccess: boolean, isValid: boolean) {
  return isSuccess || isValid;
}

// TODO: Refactor this component to use Accordion component from mui (and refactor InstructionsAccordionItem.tsx)
function Task({
  task,
  questId,
  isValid = false,
  index,
}: {
  questId: string;
  task: TaskVerification;
  isValid?: boolean;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { account } = useAccount();
  const { trackEvent } = useUserTracking();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.up('sm' as Breakpoint));

  const handleOpen:
    | MouseEventHandler<HTMLDivElement | HTMLButtonElement>
    | undefined = (e) => {
    e.stopPropagation();
    task && setOpen((prev) => !prev);
  };
  const handleCTAClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickMissionCtaSteps,
      label: `click-mission-cta-steps`,
      data: {
        [TrackingEventParameter.MissionCtaStepsTitle]: task.name || '',
        [TrackingEventParameter.MissionCtaStepsLink]: task.CTALink || '',
        [TrackingEventParameter.MissionCtaStepsCTA]: task.CTAText || '',
      },
    });
  };
  const handleVerifyClick = () => {
    trackEvent({
      category: TrackingCategory.Quests,
      action: TrackingAction.ClickMissionCtaSteps,
      label: `click-mission-cta-steps-verify`,
      data: {
        [TrackingEventParameter.MissionCtaStepsTitle]: task.name || '',
        [TrackingEventParameter.MissionCtaStepsTaskStepId]: task.uuid || '',
      },
    });
  };

  const { mutate, isSuccess, isPending, isError, reset, ...props } =
    useVerifyTask();

  useEffect(() => {
    if (!isError) {
      return;
    }

    setTimeout(() => reset(), 5000);
  }, [isError]);

  return (
    <InstructionsAccordionItemContainer
      sx={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-start' }}
    >
      <InstructionsAccordionItemIndex>
        {index + 1}
      </InstructionsAccordionItemIndex>
      <Stack
        direction="column"
        justifyContent="space-between"
        sx={{ width: '100%' }}
      >
        <InstructionsAccordionItemMain
          onClick={(e) => handleOpen(e)}
          sx={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 'auto',
          }}
        >
          <InstructionsAccordionItemHeader>
            <InstructionsAccordionItemLabel>
              {task.name}
            </InstructionsAccordionItemLabel>
          </InstructionsAccordionItemHeader>
          {task &&
            (isTablet ? (
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
            ))}
        </InstructionsAccordionItemMain>
        {open && (
          <Stack direction="column" justifyContent="space-between">
            <InstructionsAccordionItemMore
              sx={{
                margin: theme.spacing(2, 0, 0, 3),
                [theme.breakpoints.up('sm' as Breakpoint)]: {
                  alignSelf: 'flex-start',
                  margin: theme.spacing(2, 0, 0, 3),
                },
              }}
            >
              <Typography>{task.description}</Typography>
              {task.CTALink && task.CTAText && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignContent: 'center',
                    justifyContent: 'flex-start',
                    mt: '8px',
                  }}
                >
                  <InstructionsAccordionButtonMainBox>
                    <a
                      href={task.CTALink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      onClick={() => handleCTAClick()}
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
                          {task.CTAText}
                        </Typography>
                        <ArrowForwardIcon
                          style={{
                            color: theme.palette.text.primary,
                          }}
                        />
                      </InstructionsAccordionLinkBox>
                    </a>
                  </InstructionsAccordionButtonMainBox>
                </Box>
              )}
            </InstructionsAccordionItemMore>
            <Stack flexDirection="row" justifyContent="center">
              {!account?.address ? (
                'Please connect your wallet to verify the task'
              ) : (
                <Button
                  variant="outlined"
                  // @ts-ignore
                  color={
                    isVerified(isSuccess, isValid)
                      ? 'success'
                      : isError
                        ? 'error'
                        : theme.palette.text.primary
                  }
                  loading={isPending}
                  disabled={isVerified(isSuccess, isValid) || isError}
                  endIcon={
                    isVerified(isSuccess, isValid) ? (
                      <CheckIcon />
                    ) : isError ? (
                      <CloseIcon />
                    ) : (
                      <RefreshIcon />
                    )
                  }
                  loadingIndicator={
                    <CircularProgress
                      sx={(theme) => ({ color: theme.palette.text.primary })}
                      size={16}
                    />
                  }
                  onClick={() => {
                    handleVerifyClick();
                    mutate({
                      questId,
                      stepId: task.uuid,
                      address: account?.address,
                    });
                  }}
                  sx={(theme) => ({
                    borderRadius: 1,
                    textAlign: 'center',
                    '&.MuiButton-outlinedSuccess': {
                      color: '#0AA65B!important',
                      border: '1px solid #0AA65B!important',
                    },
                    '&.MuiButton-outlinedError': {
                      color: '#E5452F!important',
                      border: '1px solid #E5452F!important',
                    },
                    '&.MuiButton-loading': {
                      border: `1px solid ${theme.palette.text.primary}!important`,
                    },
                  })}
                >
                  {isVerified(isValid, isSuccess)
                    ? 'Task already verified'
                    : 'Verify the task'}
                </Button>
              )}
            </Stack>
          </Stack>
        )}
      </Stack>
    </InstructionsAccordionItemContainer>
  );
}

export default Task;
