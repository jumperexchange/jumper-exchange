import { useRef } from 'react';
import { ContributionDrawer, DrawerWrapper } from './FeeContribution.style';

export interface FeeContributionDrawerProps extends React.PropsWithChildren {
  isOpen: boolean;
}

export const FeeContributionDrawer: React.FC<FeeContributionDrawerProps> = ({
  isOpen,
  children,
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
        {children}
      </ContributionDrawer>
    </DrawerWrapper>
  );
};
