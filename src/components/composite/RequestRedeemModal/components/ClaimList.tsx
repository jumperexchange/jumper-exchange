import { type FC, useCallback } from 'react';
import type {
  FormattedClaim,
  FormattedClaims,
} from '../hooks/useFormatRedeemClaimData';
import { ProcessingTransactionCard } from '@/components/composite/cards/ProcessingTransactionCard/ProcessingTransactionCard';
import { type ProcessingTransactionCardStatus } from '@/components/composite/cards/ProcessingTransactionCard/types';
import { useWidgetNavigation } from '@/components/composite/JumperWidget/context';
import type { ExtendedToken } from '@/types/tokens';
import { RequestRedeemModalView } from '../types';

interface ClaimListProps {
  claims: FormattedClaims;
  setSelectedClaim: (claim: FormattedClaim | null) => void;
  fromToken: ExtendedToken;
  toToken: ExtendedToken;
}

export const ClaimList: FC<ClaimListProps> = ({
  claims,
  setSelectedClaim,
  toToken,
  fromToken,
}) => {
  const { goToView } = useWidgetNavigation();
  const handleClaimClick = useCallback(
    (claim: FormattedClaim) => {
      setSelectedClaim(claim);
      goToView(RequestRedeemModalView.CLAIM_REDEEM);
    },
    [setSelectedClaim, goToView],
  );
  return claims.map((formattedClaim) => (
    <ProcessingTransactionCard
      key={formattedClaim.id}
      status={formattedClaim.status as ProcessingTransactionCardStatus}
      fromToken={fromToken}
      toToken={toToken}
      title={formattedClaim.title}
      description={formattedClaim.description}
      onClick={
        formattedClaim.status === 'success'
          ? () => handleClaimClick(formattedClaim)
          : undefined
      }
    />
  ));
};
