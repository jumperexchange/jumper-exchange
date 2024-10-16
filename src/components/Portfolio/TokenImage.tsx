import type { Token } from '@lifi/widget';
import Image from 'next/image';
import { NoTokenImageBox } from './Portfolio.styles';

function TokenImage({ token }: { token: Pick<Token, 'logoURI' | 'name'> }) {
  if (!token?.logoURI) {
    return <NoTokenImageBox>{token.name?.slice(0, 1) || '?'}</NoTokenImageBox>;
  }

  return (
    <Image
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: '100%', height: '100%' }} // optional
      src={token.logoURI}
      alt={token.name}
    />
  );
}

export default TokenImage;
