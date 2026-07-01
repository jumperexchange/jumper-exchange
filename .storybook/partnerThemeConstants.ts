export const NO_PARTNER_THEME_UID = 'none';

export const isNoPartnerThemeUid = (uid?: string): boolean =>
  !uid || uid === NO_PARTNER_THEME_UID;
