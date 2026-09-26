import React from 'react';
import styles from './SkeletonLoader.module.css';

export default function SkeletonLoader() {
  return (
    <div className={styles.skeletonSection}>
      <div className="container">
        {/* Hero Skeleton */}
        <div className={styles.heroSkeleton}>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div className={`${styles.shimmerBox} ${styles.circle}`} style={{ width: '80px', height: '80px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
              <div className={styles.shimmerBox} style={{ width: '140px', height: '18px' }} />
              <div className={styles.shimmerBox} style={{ width: '280px', height: '32px' }} />
            </div>
          </div>
          <div className={styles.shimmerBox} style={{ width: '100%', height: '14px', borderRadius: '9999px' }} />
          <div style={{ display: 'flex', gap: '14px' }}>
            <div className={styles.shimmerBox} style={{ flex: 1, height: '60px' }} />
            <div className={styles.shimmerBox} style={{ flex: 1, height: '60px' }} />
            <div className={styles.shimmerBox} style={{ flex: 1, height: '60px' }} />
          </div>
        </div>

        {/* Card Grid Skeletons */}
        <div className={styles.gridSkeleton}>
          {[1, 2, 3].map((n) => (
            <div key={n} className={styles.cardSkeleton}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className={`${styles.shimmerBox} ${styles.circle}`} style={{ width: '42px', height: '42px' }} />
                <div className={styles.shimmerBox} style={{ width: '80px', height: '24px' }} />
              </div>
              <div className={styles.shimmerBox} style={{ width: '70%', height: '22px' }} />
              <div className={styles.shimmerBox} style={{ width: '90%', height: '16px' }} />
              <div className={styles.shimmerBox} style={{ width: '100%', height: '40px', marginTop: 'auto' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
