import 'i18next';
import type auth from 'public/locales/en/auth.json';
import type common from 'public/locales/en/common.json';

interface I18nNamespaces {
  common: typeof common;
  auth: typeof auth;
}

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
