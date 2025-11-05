import { describe, expect, it } from 'vitest';

import { render } from '../../../../vitest.setup';

import { AvatarStack } from './AvatarStack';
import { baseAvatars, overflowAvatars } from './fixtures';

describe('AvatarStack snapshot', () => {
  it('matches snapshot', async () => {
    const { container } = render(<AvatarStack avatars={baseAvatars} />);
    expect(container).toMatchSnapshot();
  });
  it('matches snapshot with limit', async () => {
    const { container } = render(
      <AvatarStack avatars={overflowAvatars} limit={3} />,
    );
    expect(container).toMatchSnapshot();
  });
});
