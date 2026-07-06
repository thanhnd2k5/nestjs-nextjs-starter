'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/infrastructure/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/common/constants/routes';
import { useAuth } from '@/features/_optional/auth/use-auth';
import styles from './dashboard-content.module.css';

export function DashboardContent() {
  const t = useTranslations('dashboard');
  const tAuth = useTranslations('auth');
  const tCommon = useTranslations('common');
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <main className={styles.main}>
      <h1>{t('title')}</h1>
      {user ? <p>{t('welcome', { email: user.email })}</p> : null}
      <p className={styles.placeholder}>{t('placeholder')}</p>

      <nav className={styles.nav}>
        {isAuthenticated ? (
          <Button variant="secondary" onClick={() => void logout()}>
            {tAuth('logout')}
          </Button>
        ) : null}
        <Link href={ROUTES.settings} className={styles.link}>
          {t('settings')}
        </Link>
      </nav>

      <Link href={ROUTES.home} className={styles.back}>
        ← {tCommon('back')}
      </Link>
    </main>
  );
}
