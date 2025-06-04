import {
  TrackingAction,
  TrackingCategory,
  TrackingEventParameter,
} from '@/const/trackingKeys';
import { useVerifyTask } from '@/hooks/tasksVerification/useVerifyTask';
import { useUserTracking } from '@/hooks/userTracking';
import type { TaskVerification } from '@/types/loyaltyPass';
import { useAccount } from '@lifi/wallet-management';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';
import type { Breakpoint } from '@mui/material';
import {
  alpha,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Link from 'next/link';
import { type MouseEventHandler, useEffect, useState } from 'react';
import { useMerklOpportunities } from 'src/hooks/useMerklOpportunities';
import {
  InstructionsAccordionItemContainer,
  InstructionsAccordionItemHeader,
  InstructionsAccordionItemIndex,
  InstructionsAccordionItemLabel,
  InstructionsAccordionItemMain,
  InstructionsAccordionItemMore,
  InstructionsAccordionLinkBox,
  InstructionsAccordionToggle,
} from '../Blog/CTAs/InstructionsAccordion/InstructionsAccordionItem.style';
import { APYIcon } from '../illustrations/APYIcon';
import { XPRewardsInfo } from '../ProfilePage/QuestCard/XPRewardsInfo';

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
  const { data } = useMerklOpportunities({ campaignId: task.CampaignId });

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
          }}
        >
          <InstructionsAccordionItemHeader sx={{ width: '100%' }}>
            <InstructionsAccordionItemLabel sx={{ width: '100%' }}>
              {task.name}
            </InstructionsAccordionItemLabel>
            {Array.isArray(data) && data.length === 1 && data[0].apy && (
              <XPRewardsInfo
                variant="apy"
                label={data[0].apy?.toFixed(1)} //Number(apy).toFixed(1)
              >
                <APYIcon size={20} />
              </XPRewardsInfo>
            )}
          </InstructionsAccordionItemHeader>
          {task &&
            (isTablet ? (
              <InstructionsAccordionToggle onClick={(e) => handleOpen(e)}>
                <ExpandMoreIcon
                  sx={[open && { transform: 'rotate(180deg)' }]}
                />
              </InstructionsAccordionToggle>
            ) : (
              <ExpandMoreIcon
                sx={[
                  {
                    color: alpha(theme.palette.white.main, 0.32),
                    ...theme.applyStyles('light', {
                      backgroundColor: alpha(theme.palette.black.main, 0.32),
                    }),
                  },
                  open && { transform: 'rotate(180deg)' },
                ]}
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
                <Link
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
                        color: (theme.vars || theme).palette.text.primary,
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
                  </InstructionsAccordionLinkBox>
                </Link>
              )}
            </InstructionsAccordionItemMore>
            <Stack flexDirection="row" justifyContent="center">
              {task.hasTask &&
                (!account?.address ? (
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
                        sx={(theme) => ({
                          color: (theme.vars || theme).palette.text.primary,
                        })}
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
                        border: `1px solid ${(theme.vars || theme).palette.text.primary}!important`,
                      },
                    })}
                  >
                    {isVerified(isValid, isSuccess)
                      ? 'Task already verified'
                      : 'Verify the task'}
                  </Button>
                ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </InstructionsAccordionItemContainer>
  );
}

export default Task;
