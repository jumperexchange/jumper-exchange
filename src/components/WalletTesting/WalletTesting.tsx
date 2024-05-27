'use client';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const WalletTesting = () => {
  const [userAgent, setUserAgent] = useState<string>();
  const [provider, setProvider] = useState<string>();

  useEffect(() => {
    setUserAgent(window.navigator.userAgent);
    setProvider((window as any)?.ethereum);
  }, []);

  console.log((window as any)?.ethereum);

  return (
    <Box>
      {userAgent && (
        <>
          <Typography variant="lifiHeaderMedium">UserAgent</Typography>
          <p>{userAgent}</p>
        </>
      )}
      {provider && (
        <>
          <Typography variant="lifiHeaderMedium">Provider</Typography>
          <ul>
            {Object.keys(provider).map((el) => (
              <li>{el}</li>
            ))}
          </ul>
        </>
      )}
      {!userAgent && !provider && (
        <Typography variant="lifiHeaderMedium">Loading...</Typography>
      )}
    </Box>
  );
};

export default WalletTesting;
