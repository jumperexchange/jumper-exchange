import PortfolioEmptyIllustration from '@/components/illustrations/PortfolioEmptyIllustration';
import {
  PortfolioEmptyContainer,
  PortfolioEmptyContentButton,
  PortfolioEmptyContentContainer,
  PortfolioEmptyContentDescriptionContainer,
} from './PortfolioPage.styles';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface PortfolioEmptyListProps {
  onClearFilters: () => void;
}

export const PortfolioEmptyList: FC<PortfolioEmptyListProps> = ({
  onClearFilters,
}) => {
  const { t } = useTranslation();
  return (
    <PortfolioEmptyContainer>
      <PortfolioEmptyIllustration style={{ marginBottom: -48 }} />
      <PortfolioEmptyContentContainer>
        <PortfolioEmptyContentDescriptionContainer>
          <Typography variant="bodyLargeStrong">
            {t('portfolio.emptyList.title')}
          </Typography>
          <Typography variant="bodyMedium" color="textSecondary">
            {t('portfolio.emptyList.description')}
          </Typography>
        </PortfolioEmptyContentDescriptionContainer>
        <PortfolioEmptyContentButton onClick={onClearFilters}>
          {t('portfolio.emptyList.clearFilters')}
        </PortfolioEmptyContentButton>
      </PortfolioEmptyContentContainer>
    </PortfolioEmptyContainer>
  );
};
