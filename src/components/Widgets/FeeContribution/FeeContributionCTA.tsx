import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { ContributionButtonCTA } from './FeeContribution.style';

interface FeeContributionCTAProps {
  contributed: boolean;
  disabled: boolean;
  handleClick: () => void;
  isLoading: boolean;
  translationFn: TFunction;
}

export const FeeContributionCTA: React.FC<FeeContributionCTAProps> = ({
  translationFn,
  handleClick,
  contributed,
  disabled,
  isLoading,
}) => {
  const content = useMemo(() => {
    if (isLoading) {
      return <CircularProgress size={20} color="inherit" />;
    }

    if (contributed) {
      return (
        <>
          <CheckIcon />
          {translationFn('contribution.thankYou')}
        </>
      );
    }

    return translationFn('contribution.confirm');
  }, [contributed, isLoading, translationFn]);

  return (
    <ContributionButtonCTA
      disabled={disabled}
      isTxConfirmed={contributed}
      onClick={handleClick}
    >
      {content}
    </ContributionButtonCTA>
  );
};
