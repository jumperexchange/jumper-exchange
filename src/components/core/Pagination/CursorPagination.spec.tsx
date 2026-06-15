import { fireEvent, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { CursorPagination } from './CursorPagination';

const defaultProps = {
  hasPrevious: true,
  hasNext: true,
  onPrevious: vi.fn(),
  onNext: vi.fn(),
  previousLabel: 'Previous',
  nextLabel: 'Next',
};

describe('CursorPagination', () => {
  it('renders previous and next buttons with labels', () => {
    render(<CursorPagination {...defaultProps} />);

    expect(
      screen.getByRole('button', { name: 'Previous' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('disables previous when hasPrevious is false', () => {
    render(<CursorPagination {...defaultProps} hasPrevious={false} />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
  });

  it('disables next when hasNext is false', () => {
    render(<CursorPagination {...defaultProps} hasNext={false} />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('calls handlers on click', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <CursorPagination
        {...defaultProps}
        onPrevious={onPrevious}
        onNext={onNext}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPrevious).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('disables both buttons when disabled is true', () => {
    render(<CursorPagination {...defaultProps} disabled />);

    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('does not call handlers when disabled', () => {
    const onPrevious = vi.fn();
    const onNext = vi.fn();

    render(
      <CursorPagination
        {...defaultProps}
        onPrevious={onPrevious}
        onNext={onNext}
        disabled
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPrevious).not.toHaveBeenCalled();
    expect(onNext).not.toHaveBeenCalled();
  });
});
