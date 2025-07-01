import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { ContributionButtonCTA } from './FeeContribution.style';

interface FeeContributionCTAProps {
  translationFn: TFunction;
  contributed: boolean;
  isTransactionLoading: boolean;
  handleClick: () => void;
}

export const FeeContributionCTA: React.FC<FeeContributionCTAProps> = ({
  handleClick,
  translationFn,
  contributed,
  isTransactionLoading,
}) => {
  const content = useMemo(() => {
    if (isTransactionLoading) {
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
  }, [isTransactionLoading, contributed, translationFn]);

  return (
    <ContributionButtonCTA
      disabled={isTransactionLoading}
      isTxConfirmed={contributed}
      onClick={handleClick}
    >
      {content}
    </ContributionButtonCTA>
  );
};
