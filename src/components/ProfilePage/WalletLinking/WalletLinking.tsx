import { Backdrop } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import { useState } from 'react';
import { MenuPopper } from 'src/components/Menu/Menu.style';
import { WalletLinkingMenu } from '../WalletLinkingMenu/WalletLinkingMenu';
import { useWalletLinking } from './useWalletLinking';
import {
  WalletLinkingContainer,
  WalletLinkingPaper,
} from './WalletLinking.style';

export const WalletLinking = ({
  open,
  setOpen,
  anchorEl,
}: {
  open: boolean;
  setOpen: any;
  anchorEl: HTMLElement | null;
}) => {
  const [menuIndex, setMenuIndex] = useState(0);
  const data = useWalletLinking({ menuIndex, setMenuIndex, setOpen });
  return (
    <ClickAwayListener
      touchEvent={'onTouchStart'}
      mouseEvent={'onMouseDown'}
      onClickAway={(event) => {
        setTimeout(() => {
          event.stopPropagation();
          open && setOpen(false);
        }, 150);
      }}
    >
      <Backdrop
        sx={(theme) => ({
          color: '#fff',
          zIndex: theme.zIndex.drawer + 1,
          pointerEvents: 'none',
        })}
        open={open}
      >
        <MenuPopper open={open} transition>
          {({ TransitionProps }) => (
            <Fade
              {...TransitionProps}
              in={open}
              style={{
                transformOrigin: 'top',
              }}
            >
              <WalletLinkingPaper show={open}>
                <WalletLinkingContainer>
                  {data.data.map((item, index) => (
                    <WalletLinkingMenu
                      key={`wallet-linking-menu-${index}`}
                      title={item.title}
                      text={item.text}
                      buttonLabel={item.buttonLabel}
                      setOpen={setOpen}
                      content={item.content}
                      index={index}
                      showPrevButton={
                        index !== 0 && index !== data.maxSteps - 1
                      }
                      menuIndex={menuIndex}
                      setMenuIndex={setMenuIndex}
                      onClick={item.onClick}
                    />
                  ))}
                </WalletLinkingContainer>
              </WalletLinkingPaper>
            </Fade>
          )}
        </MenuPopper>
      </Backdrop>
    </ClickAwayListener>
  );
};
