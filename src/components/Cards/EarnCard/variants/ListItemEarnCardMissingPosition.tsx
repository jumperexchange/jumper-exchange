import Typography from '@mui/material/Typography';
import {
  EarnCardMissingPositionInteractiveContent,
  EarnCardMissingPositionButton,
  EarnCardMissingPositionDescription,
  ListItemEarnCardContainer,
  ListItemEarnCardBody,
} from '../EarnCard.styles';
import { Link } from '@/components/Link/Link';
import { AppPaths } from '@/const/urls';
import { useTranslation } from 'react-i18next';

export const ListItemEarnCardMissingPosition = () => {
  const { t } = useTranslation();
  return (
    <ListItemEarnCardContainer>
      <ListItemEarnCardBody>
        <EarnCardMissingPositionInteractiveContent direction="row">
          <EarnCardMissingPositionDescription sx={{ gap: 0.5 }}>
            <Typography variant="titleXSmall">
              {t('earn.missingPosition.title')}
            </Typography>
            <Typography variant="bodySmall" color="textSecondary">
              {t('earn.missingPosition.description')}
            </Typography>
          </EarnCardMissingPositionDescription>
          <EarnCardMissingPositionButton as={Link} href={AppPaths.Portfolio}>
            {t('earn.actions.goToPortfolio')}
          </EarnCardMissingPositionButton>
        </EarnCardMissingPositionInteractiveContent>
      </ListItemEarnCardBody>
    </ListItemEarnCardContainer>
  );
};
