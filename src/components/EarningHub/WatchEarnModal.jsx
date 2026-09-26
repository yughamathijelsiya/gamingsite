import React, { useState, useEffect } from 'react';
import { X, Play, CheckCircle2, Sparkles, BookOpen, Clock } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from '../LevelDetailModal/LevelDetailModal.module.css';

export default function WatchEarnModal({ isOpen, onClose }) {
  const { watchAndEarn, claimWatchAndEarn } = useRewards();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (isPlaying && progress < 100) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 500); // 5 seconds demo playback for quick validation
    }
    return () => clearInterval(timer);
  }, [isPlaying, progress]);

  if (!isOpen) return null;

  const handleClaim = () => {
    claimWatchAndEarn();
    onClose();
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close module">
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.badgeShield} style={{ background: 'rgba(56, 189, 248, 0.2)', borderColor: 'rgba(56, 189, 248, 0.4)' }}>
            <BookOpen size={26} color="#38bdf8" />
          </div>
          <div className={styles.headerInfo}>
            <span className={styles.levelTag} style={{ color: '#38bdf8' }}>Educational Fintech Hub</span>
            <h2 className={styles.levelTitle}>{watchAndEarn.title}</h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span className="badge-blue">
                <Clock size={12} /> {watchAndEarn.duration}
              </span>
              <span className="badge-gold">
                <Sparkles size={12} /> +{watchAndEarn.xpReward} XP Reward
              </span>
            </div>
          </div>
        </div>

        {/* Video / Slide Simulation Player */}
        <div style={{
          background: '#0e111d',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '24px',
          textAlign: 'center',
          position: 'relative',
          marginBottom: '20px'
        }}>
          {!isPlaying && progress === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: 0 }}>
                {watchAndEarn.description}
              </p>
              <button
                onClick={() => setIsPlaying(true)}
                style={{
                  background: 'linear-gradient(135deg, #38bdf8, #2563eb)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  padding: '10px 22px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(56, 189, 248, 0.3)'
                }}
              >
                <Play size={16} fill="#ffffff" />
                <span>Start Learning Module</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                <span>Module Progress: {progress}%</span>
                <span>{progress === 100 ? 'Module Completed!' : 'Streaming Fintech Insights...'}</span>
              </div>
              <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(90deg, #38bdf8, #818cf8)', transition: 'width 0.3s' }} />
              </div>
              {progress === 100 && (
                <div style={{ color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>Module verified. You are eligible to claim +{watchAndEarn.xpReward} XP.</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={styles.footerActions}>
          <button className={styles.dismissBtn} onClick={onClose}>
            Close
          </button>
          <button
            onClick={handleClaim}
            disabled={progress < 100 || watchAndEarn.isClaimed}
            style={{
              background: progress === 100 && !watchAndEarn.isClaimed ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255, 255, 255, 0.1)',
              color: progress === 100 && !watchAndEarn.isClaimed ? '#0f172a' : '#64748b',
              fontWeight: 700,
              fontSize: '0.85rem',
              padding: '8px 20px',
              borderRadius: '8px',
              cursor: progress === 100 && !watchAndEarn.isClaimed ? 'pointer' : 'not-allowed'
            }}
          >
            {watchAndEarn.isClaimed ? 'XP Already Claimed' : 'Claim +75 XP'}
          </button>
        </div>
      </div>
    </div>
  );
}
