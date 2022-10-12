import React from 'react';
import { DashboardOld } from '@transferto/dashboard-vite';

const Dashboard = () => {
  return (
    <DashboardOld
      account={{
        address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
        chainId: 1,
        isActive: true,
      }}
    />
  );
};

export default Dashboard;
