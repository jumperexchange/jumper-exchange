import { type FC, useCallback } from 'react';
import { type useFormatRedeemClaimData } from '../hooks/useFormatRedeemClaimData';
import { ProcessingTransactionCard } from '@/components/composite/cards/ProcessingTransactionCard/ProcessingTransactionCard';
import { type ProcessingTransactionCardStatus } from '@/components/composite/cards/ProcessingTransactionCard/types';
import { useWidgetNavigation } from '@/components/composite/JumperWidget/context';
import type { ExtendedToken } from '@/types/tokens';
import { RequestRedeemModalView } from '../types';

interface ClaimListProps {
  claims: ReturnType<typeof useFormatRedeemClaimData>;
  setSelectedClaimId: (id: string | null) => void;
  fromToken: ExtendedToken;
  toToken: ExtendedToken;
}

export const ClaimList: FC<ClaimListProps> = ({
  claims,
  setSelectedClaimId,
  toToken,
  fromToken,
}) => {
  const { goToView } = useWidgetNavigation();
  const handleClaimClick = useCallback(
    (claimId: string) => {
      setSelectedClaimId(claimId);
      goToView(RequestRedeemModalView.CLAIM_REDEEM);
    },
    [setSelectedClaimId, goToView],
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
          ? () => handleClaimClick(formattedClaim.id)
          : undefined
      }
    />
  ));
};
