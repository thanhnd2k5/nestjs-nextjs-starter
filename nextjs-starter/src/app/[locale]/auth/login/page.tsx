import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { Link, redirect } from '@/infrastructure/i18n/navigation';
import { LoginForm } from '@/features/_optional/auth/login-form';
import { ROUTES } from '@/common/constants/routes';
import { isAuthEnabled } from '@/config/features.config';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import styles from '../auth.module.css';

export default async function LoginPage({
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
        <LoginForm />
      </Suspense>
      <p className={styles.footer}>
        {t('noAccount')}{' '}
        <Link href={ROUTES.register}>{t('register')}</Link>
      </p>
    </main>
  );
}
