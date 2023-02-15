// @mui

export const cookiesExpires = 3;

export const localStorageKey = {
  activeWalletName: 'activeWalletName',
  themeMode: 'themeMode',
  languageMode: 'languageMode',
};

// MULTI LANGUAGES
// Please remove `localStorage` when you change settings.
// ----------------------------------------------------------------------

export const defaultLang = 'en'; // English

const setLanguage = () => {
  if (!!localStorage.getItem(localStorageKey.languageMode)) {
    return localStorage.getItem(localStorageKey.languageMode);
  } else {
    return '';
  }
};
export const defaultSettings: any = {
  activeTab: 0,
  themeMode: !!localStorage.getItem(localStorageKey.themeMode)
    ? localStorage.getItem(localStorageKey.themeMode)
    : 'auto',
  languageMode: setLanguage(),
  activeWalletName: !!localStorage.getItem(localStorageKey.activeWalletName)
    ? localStorage.getItem(localStorageKey.activeWalletName)
    : false,
};

export const defaultMenu: any = {
  copiedToClipboard: false,
  openMainNavbarMenu: false,
  openNavbarWalletMenu: false,
  openNavbarConnectedMenu: false,
  openNavbarSubMenu: 'none',
  openSupportModal: false,
};
