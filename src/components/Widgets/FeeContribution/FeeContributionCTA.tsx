import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionButtonConfirm } from './FeeContribution.style';

interface FeeContributionCTAProps
  extends Pick<
    FeeContributionCardProps,
    'contributed' | 'isTransactionLoading' | 'onConfirm' | 'translationFn'
  > {}

export const FeeContributionCTA: React.FC<FeeContributionCTAProps> = ({
  translationFn,
  contributed,
  isTransactionLoading,
  onConfirm,
}) => {
  return (
    <ContributionButtonConfirm
      disabled={isTransactionLoading && !contributed}
      isTxConfirmed={contributed}
      onClick={onConfirm}
    >
      {contributed ? <CheckIcon /> : null}
      {isTransactionLoading ? (
        <CircularProgress size={20} color="inherit" />
      ) : contributed ? (
        translationFn('contribution.thankYou')
      ) : (
        translationFn('contribution.confirm')
      )}
    </ContributionButtonConfirm>
  );
};
