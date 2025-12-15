import PortfolioEmptyIllustration from '@/components/illustrations/PortfolioEmptyIllustration';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import {
  PortfolioEmptyListButton,
  PortfolioEmptyListContainer,
  PortfolioEmptyListContentContainer,
  PortfolioEmptyListDescriptionContainer,
} from './PortfolioEmptyList.style';

interface PortfolioEmptyListProps {
  title: string;
  description: string;
  buttonLabel: string;
  onClick: () => void;
}

export const PortfolioEmptyList: FC<PortfolioEmptyListProps> = ({
  title,
  description,
  buttonLabel,
  onClick,
}) => {
  return (
    <PortfolioEmptyListContainer>
      <PortfolioEmptyIllustration style={{ marginBottom: -48 }} />
      <PortfolioEmptyListContentContainer>
        <PortfolioEmptyListDescriptionContainer>
          <Typography variant="bodyLargeStrong">{title}</Typography>
          <Typography
            variant="bodyMedium"
            color="textSecondary"
            sx={{ textAlign: 'center' }}
          >
            {description}
          </Typography>
        </PortfolioEmptyListDescriptionContainer>
        <PortfolioEmptyListButton onClick={onClick}>
          {buttonLabel}
        </PortfolioEmptyListButton>
      </PortfolioEmptyListContentContainer>
    </PortfolioEmptyListContainer>
  );
};
