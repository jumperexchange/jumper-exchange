import Typography from '@mui/material/Typography';
import { FC } from 'react';
import {
  StyledModalContentContainer,
  StyledModalSectionContainer,
  StyledTextSectionContainer,
  StyledTitleContainer,
} from '../../ClaimPerkModal.styles';
import { walletDigest } from 'src/utils/walletDigest';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';
import { Badge } from 'src/components/Badge/Badge';
import { useTranslation } from 'react-i18next';
import { RichBlocks } from 'src/components/RichBlocks/RichBlocks';
import { ClaimedProps } from '../../ClaimPerkModal.types';

interface ClaimedContentProps
  extends Pick<
    ClaimedProps,
    'nextStepsDescription' | 'howToUsePerkDescription'
  > {
  walletAddress: string;
}

export const ClaimedContent: FC<ClaimedContentProps> = ({
  walletAddress,
  nextStepsDescription,
  howToUsePerkDescription,
}) => {
  const { t } = useTranslation();
  return (
    <StyledModalSectionContainer>
      <StyledModalContentContainer>
        <StyledTitleContainer>
          <Typography variant="titleSmall">
            {t('modal.perks.claimedPerk.title')}
          </Typography>
        </StyledTitleContainer>
        <Typography variant="bodyMedium" color="textSecondary">
          {t('modal.perks.claimedPerk.description')}
        </Typography>
        <Badge
          variant={BadgeVariant.Success}
          size={BadgeSize.XL}
          label={walletDigest(walletAddress)}
          sx={{ width: '100%' }}
        />
      </StyledModalContentContainer>
      <StyledModalContentContainer>
        <StyledTextSectionContainer>
          <Typography variant="titleXSmall">
            {t('modal.perks.claimedPerk.nextSteps')}
          </Typography>
          <RichBlocks
            content={nextStepsDescription}
            blockSx={{
              paragraph: (theme) => ({
                ...theme.typography.bodyMedium,
                color: (theme.vars || theme).palette.text.secondary,
                '& a': {
                  margin: 0,
                },
              }),
            }}
          />
        </StyledTextSectionContainer>
        <StyledTextSectionContainer>
          <Typography variant="titleXSmall">
            {t('modal.perks.claimedPerk.howToUsePerk')}
          </Typography>
          <RichBlocks
            content={howToUsePerkDescription}
            blockSx={{
              paragraph: (theme) => ({
                ...theme.typography.bodyMedium,
                color: (theme.vars || theme).palette.text.secondary,
                '& a': {
                  margin: 0,
                },
              }),
            }}
          />
        </StyledTextSectionContainer>
      </StyledModalContentContainer>
    </StyledModalSectionContainer>
  );
};
