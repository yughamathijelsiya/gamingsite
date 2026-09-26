import React, { useState } from 'react';
import { X, Copy, Check, Users, Sparkles, Share2 } from 'lucide-react';
import styles from '../LevelDetailModal/LevelDetailModal.module.css';

export default function ReferModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const referralCode = 'VELOOP-VIP-7842';
  const referralLink = `https://veloop.io/rewards/join?ref=${referralCode}`;

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={styles.modalBackdrop} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close referral modal">
          <X size={18} />
        </button>

        <div className={styles.modalHeader}>
          <div className={styles.badgeShield} style={{ background: 'rgba(129, 140, 248, 0.2)', borderColor: 'rgba(129, 140, 248, 0.4)' }}>
            <Users size={26} color="#818cf8" />
          </div>
          <div className={styles.headerInfo}>
            <span className={styles.levelTag} style={{ color: '#818cf8' }}>Member Referral Network</span>
            <h2 className={styles.levelTitle}>Refer & Earn +250 XP</h2>
            <p style={{ color: '#94a3b8', fontSize: '0.84rem', margin: 0 }}>
              Invite colleagues and fellow investors. When they reach Level 2, both of you receive +250 XP.
            </p>
          </div>
        </div>

        {/* Referral Link Copy Field */}
        <div style={{
          background: '#0e111d',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginBottom: '20px'
        }}>
          <label style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
            Your Unique Invite Link
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={referralLink}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#ffffff',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
            <button
              onClick={handleCopy}
              style={{
                background: copied ? '#34d399' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: copied ? '#064e3b' : '#0f172a',
                fontWeight: 700,
                fontSize: '0.82rem',
                padding: '8px 14px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Invited Friends Progress */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
            <span style={{ color: '#cbd5e1' }}>Tier 1 Referral Milestone (2 / 5 Claimed)</span>
            <span style={{ color: '#fbbf24', fontWeight: 700 }}>500 XP Earned</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: '40%', height: '100%', background: 'var(--gold-gradient)' }} />
          </div>
        </div>

        <div className={styles.footerActions}>
          <button className={styles.dismissBtn} onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
