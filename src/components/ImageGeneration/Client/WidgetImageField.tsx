/* eslint-disable @next/next/no-img-element */
'use client';

import type { ChainId, Token } from '@lifi/sdk';
import { getToken } from '@lifi/sdk';
import type { SxProps, Theme } from '@mui/material';
import { Box, Typography, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import AvatarBadge from 'src/components/AvatarBadge/AvatarBadge';
import { useChains } from 'src/hooks/useChains';

export const WidgetField = ({
  sx,
  token,
  chainId,
  type,
  amount = 0,
  amountUSD,
  highlighted,
  fullWidth,
}: {
  sx?: SxProps<Theme>;
  token?: string | null;
  chainId?: ChainId | null;
  type: 'amount' | 'token';
  amount?: number | null;
  amountUSD?: number | null;
  highlighted?: boolean | null;
  fullWidth?: boolean;
}) => {
  const theme = useTheme();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  useEffect(() => {
    // Define the async function inside useEffect
    if (!token || !chainId) {
      return;
    }
    const fetchToken = async () => {
      const fetchedToken = await getToken(chainId, token as string);
      setSelectedToken(fetchedToken);
    };

    // Call the async function
    fetchToken().catch((error) => {
      console.error('Error fetching token:', error);
    });
  }, []);

  const { chains } = useChains();
  const activeChain = useMemo(
    () => chains?.find((chainEl) => chainEl.id === chainId),
    [chainId, chains],
  );

  return (
    <Box
      sx={{
        display: 'flex',
        height: '104px',
        borderRadius: '10px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: '#E5E1EB',
        ...(highlighted && {
          boxShadow: `inset 0 0 0 2px ${theme.palette.primary.main}`,
        }),
        ...(fullWidth
          ? {
              padding: '46px 16px 16px',
              width: '368px',
            }
          : { padding: '46px 16px 16px', width: '189px' }),
        ...sx,
      }}
    >
      <AvatarBadge
        avatarAlt={`${selectedToken?.name} Avatar`}
        avatarSrc={selectedToken?.logoURI}
        badgeSrc={activeChain?.logoURI || ''}
        avatarSize={40}
        badgeSize={16}
        badgeOffset={{ x: 2, y: 2 }}
        badgeGap={5}
        badgeAlt={`${activeChain?.name} Avatar`}
      />
      {type === 'token' ? (
        <Box sx={{ marginLeft: '16px', marginTop: '2px' }}>
          <Typography
            sx={{
              fontSize: 18,
              lineHeight: 1,
              fontWeight: 700,
              letterSpacing: 'normal',
            }}
          >
            {selectedToken?.symbol}
          </Typography>
          <Typography
            sx={{
              fontSize: 12,
              lineHeight: 1,
              fontWeight: 500,
              color: '#747474',
              marginTop: '6px',
              letterSpacing: 'normal',
            }}
          >
            {activeChain?.name}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ marginLeft: '16px' }}>
          <Typography sx={{ fontSize: 24, lineHeight: 1, fontWeight: 700 }}>
            {amount}
          </Typography>
          {selectedToken && (
            <Typography
              sx={{
                fontSize: 12,
                lineHeight: 1,
                fontWeight: 500,
                color: '#747474',
                marginTop: '6px',
              }}
            >
              $
              {(
                amountUSD ||
                amount ||
                1 * parseFloat(selectedToken.priceUSD)
              ).toFixed(2)}
            </Typography>
          )}
        </Box>
      )}
    </Box>
  );
};
