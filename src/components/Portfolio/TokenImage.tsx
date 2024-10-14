import type { Token } from '@lifi/widget';
import { Box } from '@mui/material';
import Image from 'next/image';

function TokenImage({ token }: { token: Pick<Token, 'logoURI' | 'name'> }) {
  return (
    <>
      {!token?.logoURI ? (
        <Box
          sx={{
            backgroundColor: 'grey',
            borderRadisu: '50%',
            height: 40,
            width: 40,
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}
        >
          {token.name?.slice(0, 1) || '?'}
        </Box>
      ) : (
        <Image
          width={0}
          height={0}
          sizes="100vw"
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
          }} // optional
          src={token.logoURI}
          alt={token.name}
        />
      )}
    </>
  );
}

export default TokenImage;
