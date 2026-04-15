import PortfolioEmptyIllustration from '@/components/illustrations/PortfolioEmptyIllustration';
import {
  CompactEarnCardContainer,
  EarnCardMissingPositionInteractiveContent,
  EarnCardMissingPositionButton,
  EarnCardMissingPositionContent,
  EarnCardMissingPositionDescription,
  CompactEarnCardBody,
} from '../EarnCard.styles';
import Typography from '@mui/material/Typography';
import { Link } from '@/components/Link/Link';
import { AppPaths } from '@/const/urls';
import { useTranslation } from 'react-i18next';

export const CompactEarnCardMissingPosition = () => {
  const { t } = useTranslation();
  return (
    <CompactEarnCardContainer>
      <CompactEarnCardBody>
        <EarnCardMissingPositionContent>
          <PortfolioEmptyIllustration
            viewBox="0 0 246 246"
            width={148}
            height={148}
          />
          <EarnCardMissingPositionInteractiveContent
            isCentered
            sx={(theme) => ({
              marginTop: theme.spacing(-7.25),
            })}
          >
            <EarnCardMissingPositionDescription isCentered>
              <Typography variant="titleXSmall">
                {t('earn.missingPosition.title')}
              </Typography>
              <Typography
                variant="bodySmall"
                color="textSecondary"
                sx={{
                  textAlign: 'center',
                }}
              >
                {t('earn.missingPosition.description')}
              </Typography>
            </EarnCardMissingPositionDescription>
            <EarnCardMissingPositionButton as={Link} href={AppPaths.Portfolio}>
              {t('earn.actions.goToPortfolio')}
            </EarnCardMissingPositionButton>
          </EarnCardMissingPositionInteractiveContent>
        </EarnCardMissingPositionContent>
      </CompactEarnCardBody>
    </CompactEarnCardContainer>
  );
};
