import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function LoadingSpinner({ size = 'md', label }: LoadingSpinnerProps) {
  return (
    <div className={styles.wrapper} role="status" aria-label={label ?? 'Loading'}>
      <span className={[styles.spinner, styles[size]].join(' ')} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
