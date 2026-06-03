import type { FC } from 'react';
import { useCallback } from 'react';
import { SectionCardContainer } from 'src/components/Cards/SectionCard/SectionCard.style';
import type { ModalContainerProps } from 'src/components/core/modals/ModalContainer/ModalContainer';
import { ModalContainer } from 'src/components/core/modals/ModalContainer/ModalContainer';
import type { BaseStepperProps, ClaimedProps } from './ClaimPerkModal.types';
import { AvailableSteps } from './ClaimPerkModal.types';
import { StepperContent } from './components/ModalContent/StepperContent';
import { ClaimedContent } from './components/ModalContent/ClaimedContent';
import { useClaimPerk } from 'src/hooks/perks/useClaimPerk';

interface ClaimPerkModalProps
  extends ModalContainerProps, Omit<BaseStepperProps, 'onClaim'>, ClaimedProps {
  perkId: string;
  perkPromoCode?: string;
  hasCustomPromoCodes: boolean;
  isClaimed: boolean;
}

export const ClaimPerkModal: FC<ClaimPerkModalProps> = ({
  perkId,
  perkPromoCode,
  isClaimed,
  isOpen,
  onClose,
  stepProps,
  permittedSteps,
  walletAddress,
  nextStepsDescription,
  howToUsePerkDescription,
  hasCustomPromoCodes,
}) => {
  const {
    mutate: claimPerk,
    data: claimedPerk,
    isPending: isClaimPerkPending,
  } = useClaimPerk(walletAddress, perkId);

  const handleVerifyPerk = useCallback(
    (values: Record<string, string>) => {
      claimPerk({
        perkId: perkId,
        signature: values.signature,
        address: values[AvailableSteps.Wallet],
        email: values[AvailableSteps.Email],
        username: values[AvailableSteps.Username],
        message: values.message,
        walletType: values.walletType,
      });
    },
    [claimPerk, perkId],
  );

  return (
    <ModalContainer isOpen={isOpen} onClose={onClose}>
      <SectionCardContainer
        sx={{
          width: '400px',
          maxWidth: 'calc(100vw - 32px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {isClaimed && walletAddress ? (
          <ClaimedContent
            walletAddress={walletAddress}
            nextStepsDescription={nextStepsDescription}
            howToUsePerkDescription={howToUsePerkDescription}
            promoCode={claimedPerk?.promoCode ?? perkPromoCode}
            isPromoCodeLoading={isClaimPerkPending}
            hasCustomPromoCodes={hasCustomPromoCodes}
          />
        ) : (
          <StepperContent
            perkId={perkId}
            permittedSteps={permittedSteps}
            stepProps={stepProps}
            onClaim={handleVerifyPerk}
          />
        )}
      </SectionCardContainer>
    </ModalContainer>
  );
};
