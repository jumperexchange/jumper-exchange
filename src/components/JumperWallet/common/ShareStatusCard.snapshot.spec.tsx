import { describe, expect, it, vi } from 'vitest';
import { render } from '../../../../vitest.setup';
import { ShareStatusCard } from './ShareStatusCard';

describe('ShareStatusCard snapshot', () => {
  describe('statuses', () => {
    it('renders pending status', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="idle"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders storing status', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="working"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders stored status with green indicator', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="done"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders failed status with retry button', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="failed"
          onRetry={vi.fn()}
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders failed status without retry button when onRetry is not provided', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="failed"
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  describe('storage type icons', () => {
    it('renders localStorage icon', () => {
      const { container } = render(
        <ShareStatusCard
          type="localStorage"
          label="Local Storage"
          status="done"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders email icon', () => {
      const { container } = render(
        <ShareStatusCard type="email" label="Email Backup" status="done" />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders googleDrive icon', () => {
      const { container } = render(
        <ShareStatusCard
          type="googleDrive"
          label="Google Drive"
          status="done"
        />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders recoveryCode icon', () => {
      const { container } = render(
        <ShareStatusCard
          type="recoveryCode"
          label="Recovery Code"
          status="done"
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });
});
