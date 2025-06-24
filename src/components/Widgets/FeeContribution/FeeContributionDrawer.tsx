import { useRef } from 'react';
import { ContributionTranslations } from './FeeContribution';
import { ContributionDrawer, DrawerWrapper } from './FeeContribution.style';
import { FeeContributionCard } from './FeeContributionCard';

export interface FeeContributionDrawerProps {
  translations: ContributionTranslations;
  isOpen: boolean;
  onClose: () => void;
  contributionOptions: number[];
  amount: string;
  inputAmount: string;
  contributed: boolean;
  isTransactionLoading: boolean;
  maxUsdAmount: number;
  isCustomAmountActive: boolean;
  setAmount: (amount: string) => void;
  setInputAmount: (inputAmount: string) => void;
  onConfirm: () => void;
}

export const FeeContributionDrawer: React.FC<FeeContributionDrawerProps> = ({
  translations,
  isOpen,
  onClose,
  contributionOptions,
  amount,
  inputAmount,
  contributed,
  isTransactionLoading,
  maxUsdAmount,
  isCustomAmountActive,
  setAmount,
  setInputAmount,
  onConfirm,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <DrawerWrapper ref={containerRef}>
      <ContributionDrawer
        open={isOpen}
        anchor="top"
        transitionDuration={300}
        hideBackdrop={true}
        container={() => containerRef.current}
        ModalProps={{
          disablePortal: true,
          disableEnforceFocus: true,
          disableAutoFocus: true,
        }}
      >
        <FeeContributionCard
          translations={translations}
          contributionOptions={contributionOptions}
          amount={amount}
          onClose={onClose}
          inputAmount={inputAmount}
          contributed={contributed}
          isTransactionLoading={isTransactionLoading}
          maxUsdAmount={maxUsdAmount}
          isCustomAmountActive={isCustomAmountActive}
          setAmount={setAmount}
          setInputAmount={setInputAmount}
          onConfirm={onConfirm}
        />
      </ContributionDrawer>
    </DrawerWrapper>
  );
};
