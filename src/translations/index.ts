import 'intl-pluralrules';

import type { Language } from '@/hooks/language/schema';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import zh from './zh-CN.json';
import en from './en-EN.json';
import fr from './fr-FR.json';

export const defaultNS = 'myreactnativetemplate';

export const resources = {
  'zh-CN': zh,
  'en-EN': en,
  'fr-FR': fr,
} as const satisfies Record<Language, unknown>;

i18n.use(initReactI18next).init({
  defaultNS,
  fallbackLng: 'zh-CN',
  lng: 'zh-CN',
  resources,
});

// add capitalization formatter
i18n.services.formatter?.add(
  'capitalize',
  (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1).toLowerCase(),
);

export { default } from 'i18next';
