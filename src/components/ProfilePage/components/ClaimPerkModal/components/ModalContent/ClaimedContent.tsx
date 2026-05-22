import Typography from '@mui/material/Typography';
import { type FC } from 'react';
import type { Theme } from '@mui/material/styles';
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
import type { ClaimedProps } from '../../ClaimPerkModal.types';
import { PromoCodeRenderer } from 'src/components/RichBlocks/renderers/PromoCodeRenderer';

const paragraphSx = (theme: Theme) => ({
  ...theme.typography.bodyMedium,
  color: (theme.vars || theme).palette.text.secondary,
  '& a': { margin: 0 },
});

interface ClaimedContentProps extends Pick<
  ClaimedProps,
  'nextStepsDescription' | 'howToUsePerkDescription'
> {
  walletAddress: string;
  promoCode?: string;
  isPromoCodeLoading: boolean;
}

export const ClaimedContent: FC<ClaimedContentProps> = ({
  walletAddress,
  nextStepsDescription,
  howToUsePerkDescription,
  promoCode,
  isPromoCodeLoading,
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
            blockSx={{ paragraph: paragraphSx }}
            customRenderer={{
              paragraph: {
                validator: (text) =>
                  text.startsWith('<PROMO') || text.startsWith('Promo'),
                render: () => (
                  <PromoCodeRenderer
                    promoCode={promoCode}
                    isLoading={isPromoCodeLoading}
                  />
                ),
              },
            }}
          />
        </StyledTextSectionContainer>
        <StyledTextSectionContainer>
          <Typography variant="titleXSmall">
            {t('modal.perks.claimedPerk.howToUsePerk')}
          </Typography>
          <RichBlocks
            content={howToUsePerkDescription}
            blockSx={{ paragraph: paragraphSx }}
          />
        </StyledTextSectionContainer>
      </StyledModalContentContainer>
    </StyledModalSectionContainer>
  );
};
