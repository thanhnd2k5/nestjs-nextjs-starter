import { getTranslations } from 'next-intl/server';
import { AuthGuard } from '@/features/_optional/auth/auth-guard';
import { isAuthEnabled } from '@/config/features.config';
import styles from './settings.module.css';

export default async function SettingsPage() {
  const t = await getTranslations('settings');

  const content = (
    <main className={styles.main}>
      <h1>{t('title')}</h1>
      <p className={styles.placeholder}>{t('placeholder')}</p>
    </main>
  );

  if (isAuthEnabled()) {
    return <AuthGuard>{content}</AuthGuard>;
  }

  return content;
}
