import PortfolioEmptyIllustration from '@/components/illustrations/PortfolioEmptyIllustration';
import Typography from '@mui/material/Typography';
import type { FC } from 'react';
import {
  PortfolioEmptyListPrimaryButton,
  PortfolioEmptyListContainer,
  PortfolioEmptyListContentContainer,
  PortfolioEmptyListDescriptionContainer,
  PortfolioEmptyListButtonsContainer,
  PortfolioEmptyListSecondaryButton,
} from './PortfolioEmptyList.style';
import useMediaQuery from '@mui/material/useMediaQuery';

interface PortfolioEmptyListBaseProps {
  title: string;
  description: string;
  primaryButtonLabel: string;
  onPrimaryButtonClick: () => void;
}

interface WithSecondaryButton {
  secondaryButtonLabel: string;
  onSecondaryButtonClick: () => void;
}

interface WithoutSecondaryButton {
  secondaryButtonLabel?: never;
  onSecondaryButtonClick?: never;
}

type PortfolioEmptyListProps = PortfolioEmptyListBaseProps &
  (WithSecondaryButton | WithoutSecondaryButton);

export const PortfolioEmptyList: FC<PortfolioEmptyListProps> = ({
  title,
  description,
  primaryButtonLabel,
  onPrimaryButtonClick,
  secondaryButtonLabel,
  onSecondaryButtonClick,
}) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  return (
    <PortfolioEmptyListContainer>
      <PortfolioEmptyIllustration style={{ marginBottom: -48 }} />
      <PortfolioEmptyListContentContainer>
        <PortfolioEmptyListDescriptionContainer>
          <Typography variant="bodyLargeStrong">{title}</Typography>
          <Typography
            variant="bodyMedium"
            color="textSecondary"
            sx={{ textAlign: 'center', whiteSpace: 'pre-line' }}
          >
            {description}
          </Typography>
        </PortfolioEmptyListDescriptionContainer>
        <PortfolioEmptyListButtonsContainer direction="row">
          <PortfolioEmptyListPrimaryButton
            onClick={onPrimaryButtonClick}
            fullWidth={isMobile}
          >
            {primaryButtonLabel}
          </PortfolioEmptyListPrimaryButton>
          {secondaryButtonLabel && (
            <PortfolioEmptyListSecondaryButton
              onClick={onSecondaryButtonClick}
              fullWidth={isMobile}
            >
              {secondaryButtonLabel}
            </PortfolioEmptyListSecondaryButton>
          )}
        </PortfolioEmptyListButtonsContainer>
      </PortfolioEmptyListContentContainer>
    </PortfolioEmptyListContainer>
  );
};
