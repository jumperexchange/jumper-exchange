import { ResourceKey as I18nResourceKey } from 'i18next';

interface ExtendedResourceKey {
  i18n: I18nResourceKey;
  // Add your additional properties here
  navbar: {
    welcome: {
      title: string;
      subtitle: string;
      cta: string;
    };
    links: {
      [key: string]: string;
    };
    statsCards: {
      [key: string]: string;
    };
    connectWallet: string;
    chooseWallet: string;
    navbarMenu: {
      [key: string]: string;
    };
    walletMenu: {
      [key: string]: string;
    };
    language: {
      key: string;
      value: string;
    };
    themes: {
      [key: string]: string;
    };
    developers: {
      [key: string]: string;
    };
    showcases: {
      [key: string]: string;
    };
  };
  alert: {
    info: string;
    testnet: string;
    switchToMainnet: string;
  };
  button: {
    okay: string;
  };
  multisig: {
    connected: {
      title: string;
      description: string;
    };
    transactionInitiated: {
      title: string;
      description: string;
    };
    alert: {
      title: string;
      description: string;
    };
  };}

  export type ResourceKey = I18nResourceKey & ExtendedResourceKey;

