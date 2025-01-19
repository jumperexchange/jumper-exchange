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
            <a
              href={detailInformation?.socials?.twitter}
              target="_blank"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
              rel="noreferrer"
            >
              <ZapActionProtocolShare>
                <XIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </a>
          )}
          {detailInformation?.socials?.telegram && (
            <a
              href={detailInformation?.socials?.telegram}
              target="_blank"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
              rel="noreferrer"
            >
              <ZapActionProtocolShare>
                <TelegramIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </a>
          )}
          {detailInformation?.socials?.website && (
            <a
              href={detailInformation?.socials?.website}
              target="_blank"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
              rel="noreferrer"
            >
              <ZapActionProtocolShare>
                <LanguageIcon sx={{ width: '16px', height: '16px' }} />
              </ZapActionProtocolShare>
            </a>
          )}
        </>
      )}
    </Box>
  );
};
