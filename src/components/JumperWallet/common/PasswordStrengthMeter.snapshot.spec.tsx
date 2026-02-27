import { describe, expect, it } from 'vitest';
import { render } from '../../../../vitest.setup';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

describe('PasswordStrengthMeter snapshot', () => {
  it('renders with score 0 (very weak)', () => {
    const { container } = render(
      <PasswordStrengthMeter score={0} label="Very weak" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with score 1 (weak)', () => {
    const { container } = render(
      <PasswordStrengthMeter score={1} label="Weak" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with score 2 (fair)', () => {
    const { container } = render(
      <PasswordStrengthMeter score={2} label="Fair" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with score 3 (good)', () => {
    const { container } = render(
      <PasswordStrengthMeter score={3} label="Good" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders with score 4 (strong)', () => {
    const { container } = render(
      <PasswordStrengthMeter score={4} label="Strong" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('displays the label text', () => {
    const { container } = render(
      <PasswordStrengthMeter score={2} label="Custom label text" />,
    );
    expect(container).toMatchSnapshot();
  });
});
