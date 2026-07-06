import { getTranslations } from 'next-intl/server';
import { Link } from '@/infrastructure/i18n/navigation';
import { ROUTES } from '@/common/constants/routes';
import styles from './not-found.module.css';

export default async function NotFoundPage() {
  const t = await getTranslations('common');

  return (
    <main className={styles.main}>
      <p className={styles.code}>404</p>
      <h1>{t('notFound')}</h1>
      <Link href={ROUTES.home} className={styles.link}>
        {t('back')}
      </Link>
    </main>
  );
}
