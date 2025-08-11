/// <reference types="astro/client" />

interface ImportMetaEnv {}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    enableAnalytics?: () => Promise<void> | void;
    disableAnalytics?: () => void;
  }
}

export {};

