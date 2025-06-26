import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { TFunction } from 'i18next';
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
  return (
    <ContributionButtonCTA
      disabled={isTransactionLoading && !contributed}
      isTxConfirmed={contributed}
      onClick={handleClick}
    >
      {contributed ? <CheckIcon /> : null}
      {isTransactionLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : contributed ? (
        translationFn('contribution.thankYou')
      ) : (
        translationFn('contribution.confirm')
      )}
    </ContributionButtonCTA>
  );
};
