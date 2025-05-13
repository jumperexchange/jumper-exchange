import { useAccount } from '@lifi/wallet-management';
import { type Theme, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';
import { ClaimingAmountLabel } from './ClaimingDetails.style';

export const ClaimingDetails = ({
  isConfirmed,
  rewardAmount,
  tokenLogo,
  chainLogo,
}: {
  isConfirmed: boolean;
  rewardAmount: number;
  tokenLogo: string;
  chainLogo: string;
}) => {
  //HOOKS
  const { account } = useAccount();
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );

  return (
    <FlexCenterRowBox gap={1.5}>
      <AvatarBadge
        avatarAlt={'token-logo'}
        avatarSize={40}
        avatarSrc={tokenLogo}
        badgeAlt={'chain-logo'}
        badgeGap={4}
        badgeOffset={{ x: 8, y: 8 }}
        badgeSize={20}
        badgeSrc={chainLogo}
      />
      {/* <AmountInputBox> */}
      <ClaimingAmountLabel variant="titleSmall">
        {!account?.address || rewardAmount === 0 || !rewardAmount || isConfirmed
          ? '0'
          : rewardAmount
            ? t('format.decimal2Digit', { value: rewardAmount })
            : '...'}
      </ClaimingAmountLabel>
      {/* </AmountInputBox> */}
    </FlexCenterRowBox>
  );
};
