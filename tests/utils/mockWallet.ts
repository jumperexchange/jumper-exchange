/**
 * Mock Wallet Injection Utility
 *
 * This module provides functionality to inject a mock Ethereum wallet provider
 * into the browser environment for end-to-end testing. It simulates MetaMask(or any other supported wallet )
 * wallet behavior without requiring an actual browser extension.
 */

import dotenv from 'dotenv';
dotenv.config({ path: './tests/.env.test' });

/**
 * Generates JavaScript code that injects a mock Ethereum wallet provider into the browser.
 * 
 * This function creates a comprehensive mock wallet that simulates MetaMask functionality,
 * allowing tests to interact with Web3 applications without requiring an actual wallet
 * extension. The generated code supports both legacy and modern wallet discovery standards.
 * 
 * **Capabilities:**
 * 
 * - **Legacy Wallet Injection**: Injects a mock provider into `window.ethereum` for
 *   applications using the traditional MetaMask integration pattern
 * 
 * - **EIP-6963 Support**: Implements the EIP-6963 standard for wallet discovery, allowing
 *   modern dApps to discover and connect to the mock wallet through the standardized
 *   event-based protocol
 * 
 * - **Ethereum RPC Methods**: Handles common Ethereum JSON-RPC methods:
 *   - `eth_requestAccounts`: Initiates wallet connection and returns the mock address
 *   - `eth_accounts`: Returns connected accounts (empty array when disconnected)
 * 
 * - **Connection State Management**: Maintains connection state internally, allowing tests
 *   to simulate wallet connection and disconnection scenarios
 * 
 * - **Event Listeners**: Provides stub implementations for `on()` and `removeListener()`
 *   methods to prevent errors in applications that subscribe to wallet events
 * 
 * - **Legacy Enable Method**: Includes the deprecated `enable()` method for backward
 *   compatibility with older dApp implementations
 * 
 * **Usage:**
 * 
 * The returned string should be evaluated in the browser context (e.g., using Playwright's
 * `page.evaluate()` or `page.addInitScript()`). The mock wallet will be available immediately
 * after injection and will respond to connection requests from the application.
 * 
 * **Environment Requirements:**
 * 
 * Requires `MOCK_WALLET_ADDRESS` to be set in the `.env` file. This address will be used
 * as the mock wallet's Ethereum address for all operations.

 */
export const injectMockWallet = () => {
  const mockAddress = process.env.MOCK_WALLET_ADDRESS;
  return `
    const mockAddress = '${mockAddress}';
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
