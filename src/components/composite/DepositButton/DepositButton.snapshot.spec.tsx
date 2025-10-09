import { describe, expect, it } from 'vitest';

import { render } from '../../../../vitest.setup';

import { DepositButton } from './DepositButton';
import { DepositButtonDisplayMode } from './DepositButton.types';

const commonProps = {
  label: 'Quick deposit',
  onClick: () => {
    console.log('clicked');
  },
};

describe('DepositButton snapshot', () => {
  it('icon and label matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconAndLabel}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('icon only mode matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconOnly}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('label only mode matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.LabelOnly}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('icon and label with large size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconAndLabel}
        size="large"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('icon only with large size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconOnly}
        size="large"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('label only with large size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.LabelOnly}
        size="large"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('icon and label with small size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconAndLabel}
        size="small"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('icon only with small size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconOnly}
        size="small"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('label only with small size matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.LabelOnly}
        size="small"
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('disabled state matches snapshot', async () => {
    const { container } = render(
      <DepositButton
        {...commonProps}
        displayMode={DepositButtonDisplayMode.IconAndLabel}
        disabled
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
