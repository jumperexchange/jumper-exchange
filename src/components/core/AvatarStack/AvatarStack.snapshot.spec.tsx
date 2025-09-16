import { describe, expect, it } from 'vitest';

import { render } from '../../../../vitest.setup';

import { AvatarStack } from './AvatarStack';

describe('AvatarStack snapshot', () => {
  it('matches snapshot', async () => {
    const { container } = render(
      <AvatarStack
        avatars={[
          {
            id: '1',
            src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
            alt: 'Avatar 1',
          },
          {
            id: '2',
            src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png',
            alt: 'Avatar 2',
          },
          {
            id: '3',
            src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png',
            alt: 'Avatar 3',
          },
        ]}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
