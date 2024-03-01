import { ChainId } from '@lifi/types';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import { Slide, Typography, useTheme } from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  InfoMessageCardTitle,
  SolanaAlertContainer,
  SolanaMessageCard,
} from 'src/components';
import { useChainTokenSelectionStore } from 'src/stores';
import { getContrastAlphaColor } from 'src/utils';
import { IconButtonAlpha } from '../IconButton';

export const SolanaAlert = () => {
  const [closed, setClosed] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  const solanaSelected = useMemo(() => {
    const isSelected =
      sourceChainToken?.chainId === ChainId.SOL ||
      destinationChainToken?.chainId === ChainId.SOL;
    isSelected && setClosed(false);
    return isSelected;
  }, [destinationChainToken, sourceChainToken]);

  const handleClose = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.stopPropagation();
    setClosed(true);
  };

  return (
    <Slide
      direction="up"
      in={!closed && solanaSelected}
      unmountOnExit
      appear={!closed && solanaSelected}
      timeout={500}
      easing={'cubic-bezier(0.32, 0, 0.67, 0)'}
    >
      <SolanaAlertContainer>
        <SolanaMessageCard mt={theme.spacing(4)} mb={theme.spacing(4)}>
          <IconButtonAlpha
            sx={{
              position: 'absolute',
              right: theme.spacing(2),
              top: theme.spacing(2),
              backgroundColor: getContrastAlphaColor(theme, 0.04),
              width: 24,
              height: 24,
            }}
            onClick={(e) => handleClose(e)}
          >
            <CloseIcon
              sx={{
                width: 16,
                height: 16,
              }}
            />
          </IconButtonAlpha>
          <InfoMessageCardTitle
            display="flex"
            alignItems="center"
            px={2}
            pt={2}
          >
            <InfoIcon
              sx={{
                marginRight: 1,
              }}
            />
            <Typography variant={'lifiHeaderXSmall'}>
              {t('solanaAlert.title')}
            </Typography>
          </InfoMessageCardTitle>
          <Typography
            color={theme.palette.black.main}
            variant={'lifiBodySmall'}
            pt={theme.spacing(1.5)}
          >
            {t('solanaAlert.subtitle')}
          </Typography>
        </SolanaMessageCard>
      </SolanaAlertContainer>
    </Slide>
  );
};
