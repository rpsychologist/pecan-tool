export const i18n = {
    defaultLocale: process.env.DEFAULT_LOCALE,
    locales: process.env.LOCALES.split(", "),
} as const;

export type Locale = typeof i18n['locales'][number];
