'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/infrastructure/i18n/navigation';
import { Button } from '@/components/ui/Button';
import { ROUTES } from '@/common/constants/routes';
import styles from './error.module.css';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const t = useTranslations('common');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.main}>
      <h1>{t('errorTitle')}</h1>
      <p className={styles.message}>{t('error')}</p>
      <div className={styles.actions}>
        <Button type="button" onClick={reset}>
          {t('tryAgain')}
        </Button>
        <Link href={ROUTES.home} className={styles.link}>
          {t('back')}
        </Link>
      </div>
    </main>
  );
}
