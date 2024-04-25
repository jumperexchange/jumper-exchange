import { expect, test } from '@playwright/test';
import i18nConfig from '../i18nconfig';

const shouldRedirects = [
  '/active-transactions',
  '/bridges',
  '/exchanges',
  '/from-chain',
  '/from-token',
  '/languages',
  '/settings',
  '/routes',
  '/select-wallet',
  '/to-chain',
  '/to-token',
  '/to-token-native',
  '/transaction-details',
  '/transaction-execution',
  '/transaction-history',
  '/send-to-wallet',
  '/bookmarks',
  '/recent-wallets',
  '/connected-wallets',
  '/configured-wallets',
];
const invalidLocales = ['foo', 'lol'];

const baseUrl = 'http://localhost:3000/';
const statusCode = 308;

for (const locale of i18nConfig.locales) {
  test.describe(`Test redirects for locale ${locale}`, () => {
    for (const redirectUrl of shouldRedirects) {
      const url = `${baseUrl}${locale}${redirectUrl}`;
      test(`should navigate to the home page from ${url}`, async ({ page }) => {
        await page.goto(url);
        expect(page.url()).toEqual(baseUrl);
        const response = await page.request.fetch(url, { maxRedirects: 0 });
        expect(response.status()).toEqual(statusCode);
      });
      for (const invalidLocale of invalidLocales) {
        const failedUrl = `${baseUrl}${invalidLocale}${redirectUrl}`;
        test(`should not navigate to the home page but remove locale on ${failedUrl}`, async ({
          page,
        }) => {
          await page.goto(failedUrl);
          expect(page.url()).toEqual(`${failedUrl}/`);
        });
      }
    }
  });
}
