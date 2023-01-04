/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_ANALYTICS_TRACKING_ID: string;
  readonly VITE_HOTJAR_ID: string;
  readonly VITE_HOTJAR_SNIPPET_VERSION: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
