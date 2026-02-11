import { describe, expect, it } from 'vitest';

import { render } from '../../../../../vitest.setup';
import { MultiViewCard } from './MultiViewCard';
import {
  commonArgs,
  withContentArgs,
  withHeaderArgs,
  withHeaderContentArgs,
} from './fixtures';

describe('MultiViewCard snapshot', () => {
  it('matches snapshot', async () => {
    const { container } = render(<MultiViewCard {...commonArgs} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with content', async () => {
    const { container } = render(<MultiViewCard {...withContentArgs} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with header', async () => {
    const { container } = render(<MultiViewCard {...withHeaderArgs} />);
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with header and content', async () => {
    const { container } = render(<MultiViewCard {...withHeaderContentArgs} />);
    expect(container).toMatchSnapshot();
  });
});
