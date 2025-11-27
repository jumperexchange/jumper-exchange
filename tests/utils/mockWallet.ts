export const injectMockWallet = () => {
  return `
    const mockAddress = '0x0733C1795002b060C440231dd0FcF9E75C789a15';
    let isConnected = false;
    
    // Mock provider object
    const mockProvider = {
      isMetaMask: true,
      
      request: async function({ method }) {
        console.log('[MockWallet] Call:', method);

        switch (method) {
          case 'eth_requestAccounts':
            console.log('[MockWallet] Connection requested!');
            isConnected = true;
            return [mockAddress];
            
          case 'eth_accounts':
            return isConnected ? [mockAddress] : [];
            
          case 'eth_chainId':
            return '0x1';
            
          case 'net_version':
            return '1';

          default:
            console.warn('Unknown method called on mock wallet:', method);
            return null;
        }
      },
      
      on: function() {},
      removeListener: function() {},
      enable: async function() { return [mockAddress]; }
    };

    // Legacy support - inject into window.ethereum
    window.ethereum = mockProvider;

    // EIP-6963 Support
    const mockUuid = 'f5b0b1a0-1b0a-4b0a-8b0a-1b0a4b0a8b0a';
    const mockIcon = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTUuNSIgZmlsbD0iI0Y2ODUxQSIgc3Ryb2tlPSIjRjY4NTFBII+PC9jaXJjbGU+PC9zdmc+';
    
    const mockInfo = {
      uuid: mockUuid,
      name: 'MetaMask',
      icon: mockIcon,
      rdns: 'io.metamask'
    };

    // Create and dispatch announcement event
    const announceEvent = new CustomEvent('eip6963:announceProvider', {
      detail: {
        info: mockInfo,
        provider: mockProvider
      }
    });

    // Announce provider immediately
    window.dispatchEvent(announceEvent);

    // Listen for requests and announce again if needed
    window.addEventListener('eip6963:requestProvider', () => {
      console.log('[MockWallet] Provider requested, announcing...');
      window.dispatchEvent(announceEvent);
    });

    console.log('[MockWallet] EIP-6963 provider announced');
  `;
};
