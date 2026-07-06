import { getTranslations } from 'next-intl/server';
import { Link } from '@/infrastructure/i18n/navigation';
import { AppInfoPanel } from '@/features/app/app-info-panel';
import { ApiHealthStatus } from '@/features/app/api-health-status';
import { ROUTES } from '@/common/constants/routes';
import { isAuthEnabled } from '@/config/features.config';
import styles from './page.module.css';

export default async function HomePage() {
  const t = await getTranslations('app');

  return (
    <main className={styles.main}>
      <AppInfoPanel />

      <section className={styles.section}>
        <h2>{t('apiHealth')}</h2>
        <ApiHealthStatus />
      </section>

      <p className={styles.subtitle}>{t('subtitle')}</p>

      {isAuthEnabled() ? (
        <nav className={styles.nav}>
          <Link href={ROUTES.login} className={styles.link}>
            {t('goToLogin')}
          </Link>
          <Link href={ROUTES.dashboard} className={styles.linkSecondary}>
            {t('dashboard')}
          </Link>
        </nav>
      ) : null}
    </main>
  );
}
