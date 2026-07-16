import type { BrowserContext } from '@playwright/test';

// Only the Cloudflare-Access-gated Jumper hosts. Scoping by host keeps the
// service-token secret off every other domain the app calls (li.quest, RPCs,
// analytics) — sending it there would leak it into third-party request logs.
const GATED_HOST = /^https:\/\/(?:develop|staging)\.jumper\.(?:xyz|exchange)\//;

/**
 * Adds Cloudflare Access service-token headers to requests hitting the gated
 * develop/staging Jumper hosts. No-op when the token env vars are absent (local
 * dev server / CI-parity against localhost), so it stays inert unless a run
 * actually targets a gated deployment.
 */
export async function attachCloudflareAccessHeaders(
  context: BrowserContext,
): Promise<void> {
  const id = process.env.CF_ACCESS_CLIENT_ID;
  const secret = process.env.CF_ACCESS_CLIENT_SECRET;
  if (!id || !secret) {
    return;
  }

  await context.route(GATED_HOST, async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        'CF-Access-Client-Id': id,
        'CF-Access-Client-Secret': secret,
      },
    });
  });
}
