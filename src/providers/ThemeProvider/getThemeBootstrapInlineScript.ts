import {
  PARTNER_COLOR_MODE_STORAGE_KEY,
  THEME_COLOR_SCHEME_STORAGE_KEY,
  THEME_MODE_STORAGE_KEY,
} from './constants';

export const getThemeBootstrapInlineScript = () =>
  `
(function() {
  try {
    var partnerMode = localStorage.getItem('${PARTNER_COLOR_MODE_STORAGE_KEY}');
    var mode = (partnerMode === 'light' || partnerMode === 'dark')
      ? partnerMode
      : (localStorage.getItem('${THEME_MODE_STORAGE_KEY}') || 'system');
    var dark = localStorage.getItem('${THEME_COLOR_SCHEME_STORAGE_KEY}-dark') || 'dark';
    var light = localStorage.getItem('${THEME_COLOR_SCHEME_STORAGE_KEY}-light') || 'light';
    var colorScheme = '';
    if (mode === 'system') {
      colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? dark : light;
    } else {
      colorScheme = (mode === 'dark') ? dark : light;
    }
    if (colorScheme) {
      var d = document.documentElement;
      d.classList.remove('light', 'dark', light, dark);
      d.classList.add(colorScheme);
      d.setAttribute('data-mui-color-scheme', colorScheme);
      d.style.colorScheme = (colorScheme === dark) ? 'dark' : 'light';
    }
  } catch (e) {}
})();
`.trim();
