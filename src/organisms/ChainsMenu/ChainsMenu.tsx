import CheckIcon from '@mui/icons-material/Check';
import { Box } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { PopperItem, PopperMenu } from 'src/components';
import { useChainsContent } from 'src/const';
import { useWallet } from 'src/providers';
import { useMenuStore } from 'src/stores';

interface PopperMenuProps {
  handleClose: (event: MouseEvent | TouchEvent) => void;
  open?: boolean;
}

export const ChainsMenu = ({ handleClose, open }: PopperMenuProps) => {
  const { t } = useTranslation();
  const chains = useChainsContent();
  const theme = useTheme();
  const { account } = useWallet();
  const [openChainsPopper, onOpenChainsPopper] = useMenuStore((state) => [
    state.openChainsPopper,
    state.onOpenChainsPopper,
  ]);

  return openChainsPopper ? (
    <PopperMenu
      handleClose={handleClose}
      label={t('navbar.walletMenu.chains')}
      transformOrigin={'top'}
      open
      setOpen={onOpenChainsPopper}
    >
      {chains.length ? (
        chains.map((el, index) => (
          <PopperItem
            key={`${el.label}-${index}`}
            label={el.label}
            showButton={el.showButton ? el.showButton : false}
            showMoreIcon={false}
            suffixIcon={
              el.chainId && el.chainId === account.chainId ? (
                <CheckIcon />
              ) : undefined
            }
            prefixIcon={el.prefixIcon}
            onClick={el.onClick}
            open={openChainsPopper}
          />
        ))
      ) : (
        <Box textAlign={'center'} mt={theme.spacing(1)}>
          <CircularProgress />
        </Box>
      )}
    </PopperMenu>
  ) : null;
};
