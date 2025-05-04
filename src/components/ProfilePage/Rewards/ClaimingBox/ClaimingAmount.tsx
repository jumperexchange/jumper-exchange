import { useAccount } from '@lifi/wallet-management';
import { type Theme, Typography, useMediaQuery } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { FlexCenterRowBox } from 'src/components/Superfest/SuperfestPage/SuperfestMissionPage.style';

export const ClaimingAmount = ({
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
    <FlexCenterRowBox gap={1}>
      <AvatarBadge
        avatarSrc={tokenLogo}
        badgeSrc={chainLogo}
        avatarSize={40}
        badgeSize={20}
        badgeGap={4}
        badgeOffset={{ x: 8, y: 8 }}
        alt={'token-logo'}
        badgeAlt={'chain-logo'}
      />
      {/* <AmountInputBox> */}
      <Typography variant="titleSmall">
        {!account?.address || rewardAmount === 0 || !rewardAmount || isConfirmed
          ? '0'
          : rewardAmount
            ? t('format.decimal2Digit', { value: rewardAmount })
            : '...'}
      </Typography>
      {/* </AmountInputBox> */}
    </FlexCenterRowBox>
  );
};
