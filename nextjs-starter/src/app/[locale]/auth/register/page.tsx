import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/infrastructure/i18n/navigation';
import { RegisterForm } from '@/features/_optional/auth/register-form';
import { ROUTES } from '@/common/constants/routes';
import { isAuthEnabled } from '@/config/features.config';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import styles from '../auth.module.css';

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAuthEnabled()) {
    redirect({ href: ROUTES.home, locale });
  }

  const t = await getTranslations('auth');

  return (
    <main className={styles.main}>
      <Suspense fallback={<LoadingSpinner size="lg" />}>
        <RegisterForm />
      </Suspense>
      <p className={styles.footer}>
        {t('hasAccount')}{' '}
        <Link href={ROUTES.login}>{t('login')}</Link>
      </p>
    </main>
  );
}
