import { describe, expect, it } from 'vitest';

import { render } from '../../../../vitest.setup';

import { ProtocolCard } from './ProtocolCard';
import { commonArgs } from './fixtures';
import { Badge } from 'src/components/Badge/Badge';
import { BadgeSize, BadgeVariant } from 'src/components/Badge/Badge.styles';

describe('ProtocolCard snapshot', () => {
  it('protocol card matches snapshot', async () => {
    const { container } = render(<ProtocolCard {...commonArgs} />);
    expect(container).toMatchSnapshot();
  });
  it('protocol card with loading matches snapshot', async () => {
    const { container } = render(<ProtocolCard {...commonArgs} isLoading />);
    expect(container).toMatchSnapshot();
  });
  it('protocol card with badge matches snapshot', async () => {
    const { container } = render(
      <ProtocolCard
        {...commonArgs}
        headerBadge={
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.LG}
            label="New"
          />
        }
      />,
    );
    expect(container).toMatchSnapshot();
  });
  it('protocol card with long title matches snapshot', async () => {
    const { container } = render(
      <ProtocolCard
        {...commonArgs}
        data={{
          ...commonArgs.data,
          protocol: {
            ...commonArgs.data.protocol,
            name: 'this is a very long protocol name that should be truncated',
          },
        }}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
