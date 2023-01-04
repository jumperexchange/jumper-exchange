import { Box, Modal, useTheme } from '@mui/material';
import { useMenu } from '../../providers/MenuProvider';
import WidgetBot from '@widgetbot/react-embed';

export const SupportModal = () => {
  const menu = useMenu();
  const theme = useTheme();

  return (
    <Modal
      open={menu.openSupportModal}
      onClose={() => menu.toggleSupportModal(false)}
    >
      <Box
        sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '25%',
          [theme.breakpoints.down('sm')]: { width: '100%' },
          [theme.breakpoints.up('sm')]: { width: '50%' },
        }}
      >
        <WidgetBot
          server="849912621360218112" // LI.FI / TransferTo.xyz
          channel="1048071264352337951" // #🩹︱web-support
          shard="https://emerald.widgetbot.io"
          style={{ width: '100%', height: '500px' }}
        />
      </Box>
    </Modal>
  );
};
