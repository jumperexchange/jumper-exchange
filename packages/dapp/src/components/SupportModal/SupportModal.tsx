import { Breakpoint, useTheme } from '@mui/material';
import WidgetBot from '@widgetbot/react-embed';
import { useMenuStore } from '../../stores/menu';
import { NavbarHeight } from '../Navbar/Navbar.style';
import { Modal, SupportModalContainer } from './SupportModal.style';

export const SupportModal = () => {
  const theme = useTheme();
  const [openSupportModal, onOpenSupportModal] = useMenuStore((state) => [
    state.openSupportModal,
    state.onOpenSupportModal,
  ]);

  return (
    <Modal open={openSupportModal} onClose={() => onOpenSupportModal(false)}>
      <SupportModalContainer>
        <WidgetBot
          server="849912621360218112" // LI.FI / TransferTo.xyz
          channel="1108568727148056646" // #🩹︱web-support
          shard="https://emerald.widgetbot.io"
          style={{
            width: '100%',
            height: '80vh',
            maxHeight: `calc( 100vh - ${NavbarHeight.XS} )`,
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              maxHeight: `calc( 100vh - ${NavbarHeight.SM} )`,
            },
            [theme.breakpoints.up('md' as Breakpoint)]: {
              height: '500px',
            },
          }}
        />
      </SupportModalContainer>
    </Modal>
  );
};
