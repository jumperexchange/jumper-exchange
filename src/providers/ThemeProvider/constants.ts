/**
 * Shared localStorage keys for color scheme.
 * Must be used by InitColorSchemeScript, MUIThemeProvider, and WalletManagementThemeProvider
 * so the whole app has a single source of truth and mode switches persist correctly.
 */
export const THEME_MODE_STORAGE_KEY = 'jumper-mode';
export const THEME_COLOR_SCHEME_STORAGE_KEY = 'jumper-color-scheme';
