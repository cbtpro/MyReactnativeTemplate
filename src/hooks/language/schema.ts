import { z } from 'zod';

export const enum SupportedLanguages {
  ZH_CN = 'zh-CN',
  EN_EN = 'en-EN',
  FR_FR = 'fr-FR',
}

export const languageSchema = z.enum([
  SupportedLanguages.ZH_CN,
  SupportedLanguages.EN_EN,
  SupportedLanguages.FR_FR,
]);

export type Language = z.infer<typeof languageSchema>;
