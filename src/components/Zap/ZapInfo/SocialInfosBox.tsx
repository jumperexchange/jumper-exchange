'use client';

import LanguageIcon from '@mui/icons-material/Language';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import { Box } from '@mui/material';
import type { CustomInformation, Quest } from 'src/types/loyaltyPass';
import {
  ZapActionProtocolShare,
  ZapActionProtocolShareLink,
} from './ZapInfo.style';

interface ZapPageProps {
  detailInformation?: CustomInformation;
}

export const SocialInfosBox = ({ detailInformation }: ZapPageProps) => {
  return (
    <Box sx={{ display: 'flex', gap: '12px' }}>
      {detailInformation?.socials && (
        <>
          {detailInformation?.socials?.twitter && (
            <ZapActionProtocolShareLink
              href={detailInformation?.socials?.twitter}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <ZapActionProtocolShare>
                <XIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </ZapActionProtocolShareLink>
          )}
          {detailInformation?.socials?.telegram && (
            <ZapActionProtocolShareLink
              href={detailInformation?.socials?.telegram}
            >
              <ZapActionProtocolShare>
                <TelegramIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </ZapActionProtocolShareLink>
          )}
          {detailInformation?.socials?.website && (
            <ZapActionProtocolShareLink
              href={detailInformation?.socials?.website}
            >
              <ZapActionProtocolShare>
                <LanguageIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </ZapActionProtocolShareLink>
          )}
        </>
      )}
    </Box>
  );
};
