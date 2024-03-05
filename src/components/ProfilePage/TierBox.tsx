import { ProgressionBar } from './ProgressionBar';
import { TierBadgeBox, TierInfoBox, TierMainBox } from './TierBox.style';
import { PointsBox } from './PointsBox';
import { ProfilePageTypography } from './ProfilePage.style';

interface TierBoxProps {
  tier?: string | null;
  points?: number | null;
}

export const TierBox = ({ points, tier }: TierBoxProps) => {
  return (
    <TierMainBox>
      <ProfilePageTypography fontSize={'18px'} lineHeight={'24px'}>
        Tier
      </ProfilePageTypography>
      <TierInfoBox>
        <PointsBox points={points} />
        {tier ? (
          <TierBadgeBox>
            <ProfilePageTypography fontSize={'24px'} lineHeight={'32px'}>
              {tier}
            </ProfilePageTypography>
          </TierBadgeBox>
        ) : null}
      </TierInfoBox>
      <ProgressionBar points={points} />
    </TierMainBox>
  );
};
