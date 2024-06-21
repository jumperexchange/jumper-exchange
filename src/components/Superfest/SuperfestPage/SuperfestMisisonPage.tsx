import { useAccounts } from '@/hooks/useAccounts';
import { useLoyaltyPass } from '@/hooks/useLoyaltyPass';
import { useOngoingQuests } from '@/hooks/useOngoingQuests';
import { Box, Breakpoint, Stack, Typography, useTheme } from '@mui/material';
import { SuperfestContainer } from '../Superfest.style';
import { ButtonSecondary } from 'src/components/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { sequel85, sora } from 'src/fonts/fonts';
import { CustomRichBlocks } from 'src/components/Blog';
// import { SuperfestPresentedByBox } from './SuperfestPresentedBy/SuperfestPresentedByBox';

export const SuperfestMissionPage = () => {
  const { account } = useAccounts();
  const theme = useTheme();

  return (
    <SuperfestContainer className="superfest">
      <Box>
        <ButtonSecondary onClick={() => {}}>
          <ArrowBackIcon sx={{ color: '#FFFFFF' }} />
          <Typography
            variant={'lifiBodyMediumStrong'}
            component={'span'}
            ml={'9.5px'}
            mr={'9.5px'}
            sx={{
              color: theme.palette.white.main,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 208,
              [theme.breakpoints.up('sm' as Breakpoint)]: {
                maxWidth: 168,
              },
            }}
          >
            {'Back to Superfest'}
          </Typography>
        </ButtonSecondary>
      </Box>
      <Stack
        direction={'column'}
        spacing={{ xs: 2, sm: 4 }}
        sx={{ width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center',
            textAlign: 'front',
          }}
        >
          <Typography sx={{ fontFamily: sequel85.style.fontFamily }}>
            big title in the right font
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: sora.style.fontFamily }}>
          description in the other font
        </Typography>
        <Box>
          {/* <CustomRichBlocks
            id={2}
            baseUrl={''}
            content={`<INSTRUCTIONS [{"title": "Head to<LINK>", "link": {"label": "jumper.exchange", "url": "https://jumper.exchange/exchange"}}, {"title": "Connect your wallet", "step": "In the top right corner of your screen, click on 'connect' and select the wallet provider for which you have installed a browser extension and on which you want to bridge."}, {"title": "Select source chain and token", "step": "Clicking in the 'From' field you can now first select the chain from which you want to bridge and then the asset which you want to bridge. In this case you would select Ethereum as the chain."}, {"title": "Select destination chain and token", "step": "Clicking in the 'To' field you can select the chain to which you want to bridge to. In his case you would select Avalanche as the destination chain. Note, you can also select a differnt token to swap into."}, {"title": "Enter desired amount to bridge."}, {"title": "Select desired route", "step": "On the right side, you can now select the route via which you would like to bridge. You can chose between different bridges as well as the fastest and the cheapest option."}, {"title": "Hit 'Review bridge' and confirm the transaction."}, {"title": "After a few minutes, you have successfully bridged to Avalanche."}] />` as RootNode[]}
            activeTheme={undefined}
          /> */}
          <Typography>steps to be added with the button of the logo</Typography>
        </Box>
      </Stack>
    </SuperfestContainer>
  );
};
