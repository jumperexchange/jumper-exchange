import { FC, useCallback, useMemo, useState } from 'react';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { PerksCard as PerksCardComponent } from 'src/components/Cards/PerksCard/PerksCard';
import { useFormatDisplayPerkData } from 'src/hooks/perks/useFormatDisplayPerkData';
import { PerksDataAttributes } from 'src/types/strapi';
import { useActiveAccountByChainType } from 'src/hooks/useActiveAccountByChainType';
import { useLoyaltyPass } from 'src/hooks/useLoyaltyPass';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { ClaimPerkModal } from '../ClaimPerkModal/ClaimPerkModal';
import { useGetClaimedPerks } from 'src/hooks/perks/useGetClaimedPerks';

interface PerksCardProps {
  perk: PerksDataAttributes;
}

export const PerksCard: FC<PerksCardProps> = ({ perk }) => {
  const {
    id,
    title,
    description,
    imageUrl,
    unlockLevel,
    perkItems,
    claimableSteps,
    claimableStepProps,
    howToUsePerkDescription,
    nextStepsDescription,
  } = useFormatDisplayPerkData(perk);
  const activeAccount = useActiveAccountByChainType();
  const activeAccountAddress = activeAccount?.address;
  const { t } = useTranslation();
  const { level, isLoading } = useLoyaltyPass(activeAccountAddress);
  const { data: claimedPerks, isLoading: isClaimedLoading } =
    useGetClaimedPerks(activeAccountAddress);
  const [isOpen, setIsOpen] = useState(false);
  const [levelBadgeElement, setLevelBadgeElement] =
    useState<HTMLSpanElement | null>(null);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const isClaimed = useMemo(() => {
    return (
      claimedPerks?.some(
        (claimedPerk) => claimedPerk.perkId === id.toString(),
      ) ?? false
    );
  }, [claimedPerks, id]);

  const isLocked = useMemo(() => {
    const currentLevel = Number(level ?? 0);
    return unlockLevel > currentLevel;
  }, [unlockLevel, level]);

  const isDisabled = useMemo(() => {
    return isLocked || isClaimedLoading || isLoading || !activeAccountAddress;
  }, [isLocked, isClaimedLoading, isLoading, activeAccountAddress]);

  const levelBadgeProps = useMemo(() => {
    if (isLocked) {
      return {
        startIcon: <LockIcon />,
        label: t('profile_page.levelWithValue', { level: unlockLevel }),
        variant: BadgeVariant.Alpha,
      };
    }

    return {
      startIcon: <LockOpenIcon />,
      label: t('profile_page.unlocked'),
      variant: BadgeVariant.Success,
    };
  }, [unlockLevel, isLocked, t]);

  const perksBadge = useMemo(() => {
    return perkItems.map((perkItem, index) => (
      <Badge
        key={`${perkItem}-${index}`}
        label={
          <Typography component="span" variant="bodySmallStrong">
            {perkItem}
          </Typography>
        }
        variant={BadgeVariant.Alpha}
        size={BadgeSize.LG}
      />
    ));
  }, [perkItems]);

  const perkCard = (
    <PerksCardComponent
      title={title}
      description={description}
      imageUrl={imageUrl}
      levelBadge={
        <span ref={setLevelBadgeElement}>
          <Badge
            startIcon={levelBadgeProps.startIcon}
            label={levelBadgeProps.label}
            variant={levelBadgeProps.variant}
            size={BadgeSize.LG}
          />
        </span>
      }
      perksBadge={perksBadge}
      fullWidth
      isDisabled={isDisabled}
      onClick={isDisabled ? undefined : handleOpenModal}
    />
  );

  if (!isLocked) {
    return (
      <>
        {perkCard}
        <ClaimPerkModal
          perkId={id}
          isClaimed={isClaimed}
          isOpen={isOpen}
          onClose={handleCloseModal}
          walletAddress={activeAccount?.address}
          stepProps={claimableStepProps}
          permittedSteps={claimableSteps}
          nextStepsDescription={nextStepsDescription}
          howToUsePerkDescription={howToUsePerkDescription}
        />
      </>
    );
  }

  // @Note if it's a recurring use case of having the tooltip on disabled state, we can move it to the PerksCard component
  return (
    <Tooltip
      title={t('profile_page.tooltips.unlockAtLevel', {
        level: unlockLevel,
      })}
      arrow
      placement="top"
      enterDelay={100}
      disableTouchListener={false}
      enterTouchDelay={0}
      leaveTouchDelay={2000}
      slotProps={{
        popper: {
          anchorEl: levelBadgeElement,
          sx: {
            marginBottom: '-11px !important',
          },
        },
        tooltip: {
          sx: {
            color: (theme) => (theme.vars || theme).palette.textPrimaryInverted,
            backgroundColor: (theme) => (theme.vars || theme).palette.grey[900],
            '& .MuiTooltip-arrow': {
              color: (theme) => (theme.vars || theme).palette.grey[900],
            },
          },
        },
      }}
    >
      <span>{perkCard}</span>
    </Tooltip>
  );
};
