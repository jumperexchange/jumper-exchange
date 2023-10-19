import { UTM_SOURCE } from '@transferto/dapp/src/const';
import type { UtmProps } from '@transferto/dapp/src/types';

export function appendUTMParametersToLink(link: string, utm: UtmProps) {
  // Check if the link already has a query string
  const hasQueryString = link.includes('?');
  const source = { utm_source: UTM_SOURCE };
  // Build the UTM parameter string
  const utmParams = Object.entries({ ...source, ...utm })
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');

  // Determine the correct character to use for the query string separator
  const queryStringSeparator = hasQueryString ? '&' : '?';

  // Concatenate the UTM parameters to the link
  const linkWithUTM = `${link}${queryStringSeparator}${utmParams}`;

  return linkWithUTM;
}
