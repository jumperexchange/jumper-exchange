import { describe, expect, it } from 'vitest';

import { render } from '../../../../../vitest.setup';

import { Select } from './Select';
import { SelectOption, SelectVariant } from './Select.types';
import { Avatar } from '../../AvatarStack/AvatarStack.styles';
import { AvatarSkeleton } from '../../AvatarStack/AvatarStack.styles';
import { AvatarSize } from '../../AvatarStack/AvatarStack.types';

const AvatarRenderer = ({ src }: { src: string }) => {
  return (
    <Avatar
      size={AvatarSize.MD}
      src={src}
      alt={'Avatar for chain'}
      disableBorder={true}
      variant="circular"
    >
      <AvatarSkeleton size={AvatarSize.MD} variant="circular" />
    </Avatar>
  );
};

const basicOptions: SelectOption<string>[] = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'chain', label: 'Chain' },
  { value: 'protocol', label: 'Protocol' },
  { value: 'type', label: 'Type' },
  { value: 'asset', label: 'Asset' },
  { value: 'apy', label: 'APY' },
  { value: 'tvl', label: 'TVL' },
];

const chainOptions: SelectOption<string>[] = [
  {
    value: 'chain1',
    label: 'Chain 1',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png" />
    ),
  },
  {
    value: 'chain2',
    label: 'Chain 2',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png" />
    ),
  },
  {
    value: 'chain3',
    label: 'Chain 3',
    icon: (
      <AvatarRenderer src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png" />
    ),
  },
];

const typeOptions: SelectOption<string>[] = [
  { value: 'type1', label: 'Liquidity' },
  { value: 'type2', label: 'Farming' },
  { value: 'type3', label: 'Yield' },
  { value: 'type4', label: 'Staking' },
  { value: 'type5', label: 'Lending' },
  { value: 'type6', label: 'Structured' },
  { value: 'type7', label: 'Synthetic' },
];

describe('Select snapshot', () => {
  it('matches snapshot', async () => {
    const { container } = render(
      <Select
        options={typeOptions}
        label="Type"
        fullWidth={false}
        value={[]}
        variant={SelectVariant.Multi}
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with filter', async () => {
    const { container } = render(
      <Select
        options={chainOptions}
        label="Chain"
        fullWidth={false}
        value={[]}
        variant={SelectVariant.Multi}
        filterBy="chain"
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with icons', async () => {
    const { container } = render(
      <Select
        options={chainOptions}
        label="Chain"
        fullWidth={false}
        value={[]}
        variant={SelectVariant.Multi}
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with selected value', async () => {
    const { container } = render(
      <Select
        options={chainOptions}
        label="Chain"
        fullWidth={false}
        value={[chainOptions[0].value]}
        variant={SelectVariant.Multi}
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with single select', async () => {
    const { container } = render(
      <Select
        options={basicOptions}
        fullWidth={false}
        value={''}
        variant={SelectVariant.Single}
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('matches snapshot with slider select', async () => {
    const { container } = render(
      <Select
        label="APY"
        fullWidth={false}
        variant={SelectVariant.Slider}
        value={[]}
        options={[]}
        min={0}
        max={100}
        onChange={() => {}}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
