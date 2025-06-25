import CheckIcon from '@mui/icons-material/Check';
import CircularProgress from '@mui/material/CircularProgress';
import { FeeContributionCardProps } from './FeeContribution';
import { ContributionButtonConfirm } from './FeeContribution.style';

interface FeeContributionCTAProps
  extends Pick<
    FeeContributionCardProps,
    'translations' | 'contributed' | 'isTransactionLoading' | 'onConfirm'
  > {}

export const FeeContributionCTA: React.FC<FeeContributionCTAProps> = ({
  translations,
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
        translations.thankYou
      ) : (
        translations.confirm
      )}
    </ContributionButtonConfirm>
  );
};
