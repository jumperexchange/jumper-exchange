import { useCallback, useState } from 'react';

import {
  ModalMenuContainer,
  ModalMenuPaper,
} from 'src/components/ModalMenu/ModalMenu.style';
import { ModalMenuPage } from 'src/components/ModalMenu/ModalMenuPage/ModalMenuPage';
import { useWalletHacked } from '../useWalletHacked';

const WalletHackedMenu = () => {
  const [menuIndex, setMenuIndex] = useState(0);

  const {
    currentStep,
    sourceWallet,
    destinationWallet,
    getStepContent,
    getButtonLabel,
    getOnClick,
    sourceWalletVerified,
    sourceWalletSigned,
    destinationWalletVerified,
    destinationWalletSigned,
  } = useWalletHacked();

  const stepContent = getStepContent();
  const buttonLabel = getButtonLabel();

  // Memoize the click handler
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      const onClick = getOnClick();
      onClick(event);
    },
    [getOnClick],
  );

  const menuContent = stepContent.content ? (
    <>{stepContent.content}</>
  ) : (
    <div>
      {stepContent.showWalletAddress && stepContent.walletAddress && (
        <div>{stepContent.walletAddress}</div>
      )}
    </div>
  );

  return (
    <ModalMenuPaper show={true} sx={{ zIndex: 1200 }}>
      <ModalMenuContainer>
        <ModalMenuPage
          title={stepContent.title}
          text={stepContent.description}
          buttonLabel={buttonLabel}
          hideClose={true}
          content={menuContent}
          index={menuIndex}
          showPrevButton={menuIndex !== 0}
          menuIndex={menuIndex}
          setMenuIndex={setMenuIndex}
          onClick={handleClick}
        />
      </ModalMenuContainer>
    </ModalMenuPaper>
  );
};

export default WalletHackedMenu;
