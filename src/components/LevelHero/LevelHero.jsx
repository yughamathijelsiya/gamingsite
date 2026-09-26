import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  Coins,
  Repeat,
  Info
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import Tooltip from '../Tooltip/Tooltip';
import crestImg from '../../assets/level-crest.jpg';
import styles from './LevelHero.module.css';

export default function LevelHero() {
  const {
    currentXp,
    veCoinsBalance,
    gamePointsBalance,
    currentLevel,
    nextLevel,
    progressPercent,
    remainingXp
  } = useRewards();

  // Subtle load animation for progress bar width
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
    }, 150);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Compute tier multiplier based on current level
  const tierMultiplier = (1 + (currentLevel.level - 1) * 0.05).toFixed(2);

  return (
    <section id="hero" className={styles.heroSection} aria-label="Level Overview">
      <div className="container">
        <div className={styles.heroCard}>
          <div className={styles.ambientBackdrop} aria-hidden="true" />

          <div className={styles.heroGrid}>
            {/* Level Crest Badge */}
            <div className={styles.crestContainer}>
              <div className={styles.crestGlowRing} aria-hidden="true" />
              <div className={styles.crestImageWrapper}>
                <img
                  src={crestImg}
                  alt={`Level ${currentLevel.level} Crest - ${currentLevel.name}`}
                  className={styles.crestImg}
                />
              </div>
              <span className={styles.tierPillBottom}>
                {currentLevel.tier} Member
              </span>
            </div>

            {/* Level & XP Progress Details */}
            <div className={styles.heroDetails}>
              {/* Badge row */}
              <div className={styles.badgeRow}>
                <span className={styles.statusIndicator}>
                  <span className={styles.pulseDot} />
                  Active Tier Status
                </span>
                <span className="badge-gold">
                  Prestige Level {currentLevel.level} of 10
                </span>
                <Tooltip text="Progress through 10 progressive tiers to unlock enhanced fee waivers, multi-currency yields, and luxury vouchers.">
                  <span style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                    <Info size={14} color="#94a3b8" />
                  </span>
                </Tooltip>
              </div>

              {/* Title & Level Name */}
              <div className={styles.levelTitleGroup}>
                <h1 className={styles.levelNumber}>
                  LEVEL {currentLevel.level}
                </h1>
                <span
                  className={`${styles.levelName} ${
                    currentLevel.tier === 'Gold' ? styles.goldTierHighlight : ''
                  }`}
                >
                  {currentLevel.name}
                </span>
              </div>

              <p className={styles.heroSubtitle}>
                Play skill-based arcade games like <strong>Cyber Surfers</strong> and <strong>VE Coin Catch</strong>, convert your game points into <strong>VE Coins & XP</strong>, and unlock tier privileges.
              </p>

              {/* Progress Bar Section */}
              <div className={styles.progressSection}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>
                    <Sparkles size={14} color="#fbbf24" />
                    <span>XP Progress</span>
                    <strong style={{ color: '#ffffff' }}>
                      ({progressPercent}%)
                    </strong>
                  </span>
                  <span className={styles.progressValues}>
                    <span>{currentXp.toLocaleString()}</span>
                    <span style={{ color: '#64748b' }}> / </span>
                    <span className={styles.targetTag}>
                      {nextLevel ? nextLevel.minXp.toLocaleString() : 'MAX'} XP
                    </span>
                  </span>
                </div>

                {/* Animated Track */}
                <div
                  className={styles.progressBarTrack}
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`XP progress towards Level ${nextLevel ? nextLevel.level : 'Max'}`}
                >
                  <div
                    className={styles.progressBarFill}
                    style={{ width: `${animatedProgress}%` }}
                  >
                    <div className={styles.progressGlowHead} />
                  </div>
                </div>

                <div className={styles.progressFooter}>
                  <span className={styles.remainingText}>
                    {nextLevel ? (
                      <>
                        <span className={styles.remainingHighlight}>
                          {remainingXp.toLocaleString()} XP
                        </span>{' '}
                        remaining to reach Level {nextLevel.level}
                      </>
                    ) : (
                      'Maximum Prestige Tier Reached'
                    )}
                  </span>

                  {nextLevel && (
                    <span className={styles.nextLevelCallout}>
                      <span>Next: {nextLevel.name}</span>
                      <ArrowRight size={13} />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className={styles.metricsGrid}>
            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <Sparkles size={18} />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Total XP Earned</span>
                <span className={styles.metricValue}>
                  {currentXp.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: '#fbbf24' }}>
                <Coins size={18} />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>VE Coins Wallet</span>
                <span className={styles.metricValue} style={{ color: '#fbbf24' }}>
                  {veCoinsBalance.toLocaleString()}
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon} style={{ color: '#38bdf8' }}>
                <Zap size={18} />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Arcade Points</span>
                <span className={styles.metricValue} style={{ color: '#38bdf8' }}>
                  {gamePointsBalance.toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className={styles.metricCard}>
              <div className={styles.metricIcon}>
                <TrendingUp size={18} />
              </div>
              <div className={styles.metricContent}>
                <span className={styles.metricLabel}>Tier Multiplier</span>
                <span className={styles.metricValue}>
                  {tierMultiplier}x Boost
                </span>
              </div>
            </div>
          </div>

          {/* Personalized Next Best Action recommendation banner */}
          <div className={styles.actionBanner}>
            <div className={styles.actionBannerText}>
              <Sparkles size={16} color="#38bdf8" />
              <span>
                <strong>Next Best Action:</strong> You have <strong>{gamePointsBalance} arcade points</strong> ready! Convert them in the <strong>Points Converter</strong> to claim <strong>+{Math.floor(gamePointsBalance * 0.1)} VE Coins</strong> and <strong>+{Math.floor(gamePointsBalance * 0.25)} XP</strong>.
              </span>
            </div>
            <a href="#points-converter" className={styles.actionBannerBtn}>
              Convert Points Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
