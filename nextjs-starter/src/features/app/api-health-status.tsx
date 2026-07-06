'use client';

import { useTranslations } from 'next-intl';
import { useApiHealth } from '@/hooks/use-api-health';
import { clientEnv } from '@/config/env.client';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import styles from './api-health.module.css';

export function ApiHealthStatus() {
  const t = useTranslations('app');
  const { data, isLoading, isError } = useApiHealth();

  if (!clientEnv.apiUrl && !clientEnv.featureApiProxy) {
    return (
      <p className={styles.muted}>
        Set <code>NEXT_PUBLIC_API_URL</code> to check API health.
      </p>
    );
  }

  if (isLoading) {
    return <LoadingSpinner size="sm" label={t('apiHealth')} />;
  }

  if (isError || !data) {
    return <p className={styles.error}>{t('apiUnreachable')}</p>;
  }

  return (
    <div className={styles.ok}>
      <span className={styles.dot} aria-hidden />
      <span>
        {t('apiHealthy')}: <strong>{data.name}</strong> v{data.version}
      </span>
    </div>
  );
}
