'use client';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

const WalletTesting = () => {
  const [userAgent, setUserAgent] = useState<string>();
  const [provider, setProvider] = useState<string>();
  const [mobile, setMobile] = useState<boolean>();

  useEffect(() => {
    typeof window !== 'undefined' && setUserAgent(window.navigator.userAgent);
    typeof window !== 'undefined' && setProvider((window as any)?.ethereum);
    typeof window !== 'undefined' &&
      setMobile((window as any)?.navigator.userAgentData.mobile);
  }, []);

  console.log(typeof window !== 'undefined' && (window as any)?.ethereum);

  return (
    <Box>
      {mobile && (
        <>
          <Typography variant="lifiHeaderMedium">Mobile?</Typography>
          <p>{mobile ? 'true' : 'false'}</p>
        </>
      )}
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
