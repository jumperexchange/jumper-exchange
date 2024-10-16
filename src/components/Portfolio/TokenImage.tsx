import type { Token } from '@lifi/widget';
import { Box } from '@mui/system';

function TokenImage({ token }: { token: Pick<Token, 'logoURI' | 'name'> }) {
  if (!token?.logoURI) {
    return token.name?.slice(0, 1) || '?';
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
