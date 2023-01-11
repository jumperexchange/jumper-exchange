import { Box, Modal, useTheme } from '@mui/material';
import WidgetBot from '@widgetbot/react-embed';
import { useMenu } from '../../providers/MenuProvider';

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
          top: '72px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '25%',
          [theme.breakpoints.down('sm')]: { top: '64px' },
          [theme.breakpoints.down('md')]: { width: '100%' },
          [theme.breakpoints.up('md')]: {
            width: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <WidgetBot
          server="849912621360218112" // LI.FI / TransferTo.xyz
          channel="1048071264352337951" // #🩹︱web-support
          shard="https://emerald.widgetbot.io"
          style={{
            width: '100%',
            height: 'calc( 100vh - 64px )',
            [theme.breakpoints.down('md')]: { height: 'calc( 100vh - 64px )' },
            [theme.breakpoints.up('md')]: {
              height: '500px',
            },
          }}
        />
      </Box>
    </Modal>
  );
};
