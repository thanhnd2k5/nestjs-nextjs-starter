import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import styles from './loading.module.css';

export default function LoadingPage() {
  return (
    <div className={styles.wrapper}>
      <LoadingSpinner size="lg" />
    </div>
  );
}
