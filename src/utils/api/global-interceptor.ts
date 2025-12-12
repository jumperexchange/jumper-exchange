import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { GLOBAL_HEADERS } from '@/const/headers';
import envConfig from '@/config/env-config';

const interceptor = new FetchInterceptor();
interceptor.apply();

interceptor.on('request', ({ request }) => {
  if (
    (envConfig.NEXT_PUBLIC_BACKEND_URL &&
      request.url.startsWith(envConfig.NEXT_PUBLIC_BACKEND_URL)) ||
    (envConfig.NEXT_PUBLIC_LIFI_BACKEND_URL &&
      request.url.startsWith(envConfig.NEXT_PUBLIC_LIFI_BACKEND_URL)) ||
    request.url.startsWith(`https://li.quest`)
  ) {
    for (const [key, value] of Object.entries(GLOBAL_HEADERS)) {
      if (!key || !value) {
        continue;
      }
      request.headers.set(key, value);
    }
    console.log('Headers modified by global interceptor');
  }
});

export const globalInterceptor = interceptor;
