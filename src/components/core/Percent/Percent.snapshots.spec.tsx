import { describe, expect, it } from 'vitest';
import { render } from '../../../../vitest.setup';
import { Percent } from './Percent';
import { PercentSize } from './Percent.types';
import { Avatar } from '@mui/material';

describe('Percent snapshot', () => {
  it('default percent matches snapshot', () => {
    const { container } = render(
      <Percent percent={32} size={PercentSize.XXL} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with text matches snapshot', () => {
    const { container } = render(
      <Percent percent={32} size={PercentSize.XXL}>
        +2
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with children matches snapshot', () => {
    const { container } = render(
      <Percent percent={75} size={PercentSize.XXL}>
        <Avatar
          src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
          sx={{ width: 51.2, height: 51.2 }}
        />
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with long text matches snapshot', () => {
    const { container } = render(
      <Percent percent={32} size={PercentSize.XXL}>
        1121111232
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with small size matches snapshot', () => {
    const { container } = render(
      <Percent percent={50} size={PercentSize.SM}>
        +1
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with medium size matches snapshot', () => {
    const { container } = render(
      <Percent percent={66} size={PercentSize.MD}>
        +3
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with large size matches snapshot', () => {
    const { container } = render(
      <Percent percent={88} size={PercentSize.LG}>
        +5
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent with extra large size matches snapshot', () => {
    const { container } = render(
      <Percent percent={90} size={PercentSize.XL}>
        +8
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent at 0% matches snapshot', () => {
    const { container } = render(
      <Percent percent={0} size={PercentSize.XXL}>
        0%
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });

  it('percent at 100% matches snapshot', () => {
    const { container } = render(
      <Percent percent={100} size={PercentSize.XXL}>
        100%
      </Percent>,
    );
    expect(container).toMatchSnapshot();
  });
});
