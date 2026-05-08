/**
 * Selectors for MetaMask extension elements
 */
export const metamaskLocators = {
  connection: {
    connectWalletButton: 'confirm-btn',
  },
  network: {
    addCustomNetworkButton: 'css=[class*="mm-button-secondary"]',
    addRpcDropdownButton: 'test-add-rpc-drop-down',
    addRpcUrlInModalButton: 'css=button:has-text("Add RPC URL")',
    addUrlButton: 'css=.mm-button-primary',

    networkForm: {
      blockExplorer: 'test-explorer-drop-down',
      chainId: 'network-form-chain-id',
      currencySymbol: 'network-form-ticker-input',
      networkName: 'network-form-network-name',
      notNowRedeemButton: 'css=button:has-text("Not now")',
      rpcUrl: 'rpc-url-input-test',
      saveButton: 'css=button.mm-button-primary:has-text("Save")',
    },
  },
  onboarding: {
    agreementCheckbox: 'onboarding-terms-checkbox',
    denyMetricsCheck: 'metametrics-checkbox',
    doneButton: 'onboarding-complete-done',
    importExistingButton: 'onboarding-import-wallet',
    proceedWithoutMetricsButton: 'metametrics-i-agree',
    useSeedPhraseButton: 'onboarding-import-with-srp-button',
  },
  password: {
    confirmInput: 'create-password-confirm-input',
    importButton: 'create-password-submit',
    newInput: 'create-password-new-input',
    termsCheckbox: 'create-password-terms',
    unlockPasswordInput: 'unlock-password',
    unlockSubmitButton: 'unlock-submit',
  },
  seedPhrase: {
    confirmButton: 'import-srp-confirm',
    dropdown: 'css=.dropdown__select',
    inputField: 'srp-input-import__srp-note',
    wordInputPrefix: 'import-srp__srp-word-',
  },
  transaction: {
    cancelTxn: 'confirm-footer-cancel-button',
    confirm: 'confirm-btn',
    confirmTxn: 'confirm-footer-button',
  },
  wallet: {
    networks: 'global-menu-networks',
    notifications: 'css=.notifications-tag-counter__unread-dot',
    settings: 'account-options-menu-button',
    toggle: 'global-menu-toggle-view',
  },
} as const;
