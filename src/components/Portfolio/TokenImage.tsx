import type { Token } from '@lifi/widget';
import { NoTokenImageBox } from './Portfolio.styles';
import { Box } from '@mui/material';

function TokenImage({ token }: { token: Pick<Token, 'logoURI' | 'name'> }) {
  if (!token?.logoURI) {
    return <NoTokenImageBox>{token.name?.slice(0, 1) || '?'}</NoTokenImageBox>;
  }

  return (
    <Box
      component="img"
      width={0}
      height={0}
      style={{ width: '100%', height: '100%' }} // optional
      src={token.logoURI}
      alt={token.name}
    />
  );
}

export default TokenImage;
