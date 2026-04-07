/**
 * Removes SQL LIKE metacharacters from user input before it is sent to Strapi
 * `$containsi` filters, which are implemented with LIKE and treat `%` and `_` as
 * wildcards (and `\` as escape in many databases).
 */
export const sanitizeStrapiContainsSearchInput = (input: string): string =>
  input.replace(/[%_\\]/g, '');
