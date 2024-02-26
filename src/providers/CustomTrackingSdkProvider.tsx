import type { TrackEventProps } from 'src/types';
import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

export const IDENTITY_KEY = 'tracking-identity';
export const SESSION_STORAGE_ID_KEY = 'tracking-session-id';

export type CustomEvent = TrackEventProps;

export class CustomTrackingSdkProvider {
  constructor(
    private serverUrl: string,
    private identityId: string,
    private sessionId: string,
  ) {}

  public static async init(
    serverUrl: string,
  ): Promise<CustomTrackingSdkProvider> {
    const identityId =
      await CustomTrackingSdkProvider._getIdentitityId(serverUrl);
    const sessionId = CustomTrackingSdkProvider._getSessionId(serverUrl);

    console.log('CustomTracking initialized');
    return new CustomTrackingSdkProvider(serverUrl, identityId, sessionId);
  }

  private static async _getIdentitityId(serverUrl: string) {
    const identityId =
      window.localStorage.getItem(IDENTITY_KEY) ||
      (await request<string>(serverUrl, 'auth/identify'));
    window.localStorage.setItem(IDENTITY_KEY, identityId);
    return identityId;
  }

  private static _getSessionId(identityId: string) {
    const existingSessionId = window.sessionStorage.getItem(
      SESSION_STORAGE_ID_KEY,
    );
    if (existingSessionId) {
      return existingSessionId;
    }

    const newSessionId = generateUniqueID(identityId);
    window.sessionStorage.setItem(SESSION_STORAGE_ID_KEY, newSessionId);
    return newSessionId;
  }

  public trackEvent(event: CustomEvent) {
    return request(this.serverUrl, 'event/track', {
      ...event,
      identityId: this.identityId,
      sessionId: this.sessionId,
    });
  }

  /**
   Alias method is used to combine accounts with incognito tracked solutions
   */
  public alias(accountId: string) {
    return request(this.serverUrl, 'auth/alias');
  }
}

export function generateUniqueID(identityId: string) {
  const timestamp = new Date().getTime();
  const randomPart = Math.random().toString(36).substring(2);

  return `${timestamp}-${identityId}-${randomPart}`;
}

export async function request(
  base: string,
  path: string,
  data?: unknown,
): Promise<any> {
  const response = await fetch(`${base}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    const text = await response.text(); // Parse it as text

    try {
      const data = JSON.parse(text);
      return data;
    } catch (e) {
      return text;
    }
  } else {
    throw new Error(`Cannot fetch ${base}${path} with code ${response.status}`);
  }
}

export const CustomTrackingProvider: FC<
  PropsWithChildren & { serverUrl: string }
> = ({ children, serverUrl }) => {
  const [trackingSdk, setSdk] = useState<
    CustomTrackingSdkProvider | undefined
  >();
  const initializedStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (initializedStartedRef.current) {
      return;
    }
    initializedStartedRef.current = true;

    CustomTrackingSdkProvider.init(serverUrl).then((sdk) => setSdk(sdk));
  }, [serverUrl]);

  return (
    <CustomTrackingContext.Provider value={trackingSdk}>
      ${children}
    </CustomTrackingContext.Provider>
  );
};

const CustomTrackingContext = createContext<
  CustomTrackingSdkProvider | undefined
>(undefined);

export const useCustomTracking = () => {
  const ctx = useContext(CustomTrackingContext);

  return ctx;
};
