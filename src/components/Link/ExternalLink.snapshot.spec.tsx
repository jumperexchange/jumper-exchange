import { describe, expect, it } from 'vitest';

import { render } from '../../../vitest.setup';

import { ExternalLink } from './ExternalLink';

describe('ExternalLink snapshot', () => {
  it('external link matches snapshot', () => {
    const { container } = render(
      <ExternalLink href="https://example.com">Goes outside...</ExternalLink>,
    );
    expect(container).toMatchSnapshot();
  });
});
