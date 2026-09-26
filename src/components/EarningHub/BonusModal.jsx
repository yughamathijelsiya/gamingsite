import React from 'react';
import { X, ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from '../LevelDetailModal/LevelDetailModal.module.css';

export default function BonusModal({ isOpen, onClose }) {
  const { bonusMissions, claimBonusMission } = useRewards();

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close bonus missions modal">
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.badgeShield} style={{ background: 'rgba(52, 211, 153, 0.2)', borderColor: 'rgba(52, 211, 153, 0.4)' }}>
            <ShieldCheck size={26} color="#34d399" />
          </div>
          <div className={styles.headerInfo}>
            <span className={styles.levelTag} style={{ color: '#34d399' }}>Account Verification & Security</span>
            <h2 className={styles.levelTitle}>Bonus Missions</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
              Complete one-time regulatory and security milestones to claim substantial XP injections.
            </p>
          </div>
        </div>

        {/* Missions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {bonusMissions.map((mission) => {
            const isClaimed = mission.status === 'Claimed';
            const isSupported = mission.supported;

            return (
              <div
                key={mission.id}
                style={{
                  background: 'rgba(15, 18, 32, 0.65)',
                  border: isClaimed ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>
                      {mission.title}
                    </span>
                    <span className="badge-gold" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>
                    {mission.description}
                  </p>
                </div>

                <div>
                  {isClaimed ? (
                    <span style={{ color: '#34d399', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Check size={14} /> Completed
                    </span>
                  ) : isSupported ? (
                    <button
                      onClick={() => claimBonusMission(mission.id)}
                      style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#0f172a',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Verify & Claim
                    </button>
                  ) : (
                    <span style={{ color: '#64748b', fontSize: '0.78rem', fontWeight: 600 }}>
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footerActions}>
          <button className={styles.dismissBtn} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
