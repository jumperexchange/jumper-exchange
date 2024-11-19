import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box, IconButton, Skeleton, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

import { useTranslation } from 'react-i18next';
import { getSiteUrl } from 'src/const/urls';
import { useMenuStore } from 'src/stores/menu';
import type { BerachainProtocolSocials } from '../../const/berachainExampleData';
import {
  BerachainActionProtocolBox,
  BerachainProtocolActionInfos,
  BerachainProtocolActionIntro,
} from './BerachainProtocolAction.style';

interface BerachainProtocolActionProps {
  image?: string;
  socials?: BerachainProtocolSocials;
  slug?: string;
  title?: string;
  description?: string;
}

export const BerachainProtocolAction = ({
  image,
  socials,
  slug,
  title,
  description,
}: BerachainProtocolActionProps) => {
  const { setSnackbarState } = useMenuStore((state) => state);
  const { t } = useTranslation();

  const handleCopyButton = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setSnackbarState(true, t('navbar.walletMenu.copiedMsg'), 'success');
  };

  return (
    <BerachainActionProtocolBox>
      <BerachainProtocolActionIntro>
        {image ? (
          <Image src={image} alt="Protocol image" width={192} height={192} />
        ) : (
          <Skeleton
            variant="circular"
            sx={{ width: '192px', height: '192px' }}
          />
        )}
        <BerachainProtocolActionInfos>
          {title ? (
            <Typography variant="titleSmall">What is {title}?</Typography>
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ height: '32px', width: '160px' }}
            />
          )}
          {description ? (
            <Typography variant="bodyMedium">{description}</Typography>
          ) : (
            <Skeleton
              variant="rectangular"
              sx={{ height: '72px', width: '100%' }}
            />
          )}
          {socials && (
            <Box sx={{ display: 'flex', gap: '12px' }}>
              {socials?.twitter && (
                <Link href={socials.twitter}>
                  <IconButton>
                    <XIcon />
                  </IconButton>
                </Link>
              )}
              {socials?.telegram && (
                <Link href={socials.telegram}>
                  <IconButton>
                    <TelegramIcon />
                  </IconButton>
                </Link>
              )}
              {socials?.website && (
                <Link href={socials.website}>
                  <IconButton>
                    <LanguageIcon />
                  </IconButton>
                </Link>
              )}
            </Box>
          )}
          <IconButton
            onClick={() =>
              handleCopyButton(`${getSiteUrl()}/berachain/explore/${slug}`)
            }
          >
            <ContentCopyIcon />
          </IconButton>
        </BerachainProtocolActionInfos>
      </BerachainProtocolActionIntro>
      <Box></Box>
      <Box></Box>
    </BerachainActionProtocolBox>
  );
};
