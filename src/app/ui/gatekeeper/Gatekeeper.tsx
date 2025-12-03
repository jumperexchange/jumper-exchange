'use client';

import { GatekeeperStatus, useGatekeeperStatus } from './useGatekeeperStatus';

interface GatekeeperProps extends React.PropsWithChildren {
  flag: 'hasEarn'; // Only one hardcoded flag for now
}

export const Gatekeeper: React.FC<GatekeeperProps> = ({ children, flag }) => {
  const { status, error } = useGatekeeperStatus(flag);

  if (status === GatekeeperStatus.LOADING) {
    return <div>Loading...</div>;
  }

  if (status === GatekeeperStatus.REQUIRES_CONNECT) {
    return <div>Requires connect</div>;
  }

  if (status === GatekeeperStatus.LOADING_NFT) {
    return <div>Loading NFT</div>;
  }

  if (status === GatekeeperStatus.ERROR) {
    return (
      <div>
        <pre>Error: {error?.toString()}</pre>
      </div>
    );
  }

  if (status === GatekeeperStatus.NOT_ALLOWED) {
    return <div>Not allowed</div>;
  }

  return <>{children}</>;
};
