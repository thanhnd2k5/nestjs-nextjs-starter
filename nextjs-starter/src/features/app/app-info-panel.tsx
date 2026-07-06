import { getEnvConfig } from '@/config/env';
import { getEnabledFeatures } from '@/config/features.config';
import styles from './app-info.module.css';

export function AppInfoPanel() {
  const env = getEnvConfig();
  const features = getEnabledFeatures();

  const featureEntries = Object.entries(features).filter(([, enabled]) => enabled);

  return (
    <section className={styles.panel}>
      <h1 className={styles.title}>{env.APP_NAME}</h1>
      <p className={styles.version}>v{env.APP_VERSION}</p>

      <div className={styles.section}>
        <h2 className={styles.heading}>Features</h2>
        {featureEntries.length > 0 ? (
          <ul className={styles.list}>
            {featureEntries.map(([name]) => (
              <li key={name}>
                <code>{name}</code>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.muted}>Core only — enable optional features via env.</p>
        )}
      </div>
    </section>
  );
}
