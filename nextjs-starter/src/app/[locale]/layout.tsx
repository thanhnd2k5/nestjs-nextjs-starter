import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getEnvConfig } from '@/config/env';
import { LocaleProviders } from '@/infrastructure/providers/locale-providers';
import { AuthHydrator } from '@/features/_optional/auth/auth-hydrator';
import { routing } from '@/infrastructure/i18n/routing';
import styles from './layout.module.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const env = getEnvConfig();
  return {
    title: env.APP_NAME,
    description: `${env.APP_NAME} — Next.js frontend starter`,
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body data-theme="dark">
        <LocaleProviders>
          <AuthHydrator>
            <div className={styles.shell}>{children}</div>
          </AuthHydrator>
        </LocaleProviders>
      </body>
    </html>
  );
}
