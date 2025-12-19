import PortfolioEmptyIllustration from '@/components/illustrations/PortfolioEmptyIllustration';
import {
  CompactEarnCardContainer,
  EarnCardMissingPositionInteractiveContent,
  EarnCardMissingPositionButton,
  EarnCardMissingPositionContent,
  EarnCardMissingPositionDescription,
} from '../EarnCard.styles';
import Typography from '@mui/material/Typography';
import { Link } from '@/components/Link';
import { AppPaths } from '@/const/urls';
import { useTranslation } from 'react-i18next';

export const CompactEarnCardMissingPosition = () => {
  const { t } = useTranslation();
  return (
    <CompactEarnCardContainer>
      <EarnCardMissingPositionContent>
        <PortfolioEmptyIllustration
          viewBox="0 0 246 246"
          width={148}
          height={148}
        />
        <EarnCardMissingPositionInteractiveContent isCentered>
          <EarnCardMissingPositionDescription isCentered>
            <Typography variant="titleXSmall">
              {t('earn.missingPosition.title')}
            </Typography>
            <Typography
              variant="bodySmall"
              color="textSecondary"
              textAlign="center"
            >
              {t('earn.missingPosition.description')}
            </Typography>
          </EarnCardMissingPositionDescription>
          <EarnCardMissingPositionButton as={Link} href={AppPaths.Portfolio}>
            {t('earn.actions.goToPortfolio')}
          </EarnCardMissingPositionButton>
        </EarnCardMissingPositionInteractiveContent>
      </EarnCardMissingPositionContent>
    </CompactEarnCardContainer>
  );
};
