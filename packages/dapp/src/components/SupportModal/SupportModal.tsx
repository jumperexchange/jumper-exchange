import { Breakpoint, Modal, useTheme } from '@mui/material';
import WidgetBot from '@widgetbot/react-embed';
import { useMenu } from '../../providers/MenuProvider';
import { SupportModalContainer } from './SupportModal.style';

export const SupportModal = () => {
  const menu = useMenu();
  const theme = useTheme();

  return (
    <Modal
      open={menu.openSupportModal}
      onClose={() => menu.toggleSupportModal(false)}
    >
      <SupportModalContainer>
        <WidgetBot
          server="849912621360218112" // LI.FI / TransferTo.xyz
          channel="1048071264352337951" // #🩹︱web-support
          shard="https://emerald.widgetbot.io"
          style={{
            width: '100%',
            height: 'calc( 100vh - 64px )',
            [theme.breakpoints.up('sm' as Breakpoint)]: {
              height: 'calc( 100vh - 72px )',
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
