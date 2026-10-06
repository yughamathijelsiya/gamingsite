import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Coins,
  CheckCircle2,
  Info,
  Gift,
  Award,
  Crown,
  ChevronRight,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import Tooltip from '../Tooltip/Tooltip';
import crest3dImg from '../../assets/tier-crest-3d.jpg';
import styles from './LevelHero.module.css';

export default function LevelHero() {
  const {
    currentXp,
    veCoinsBalance,
    gamePointsBalance,
    currentLevel,
    nextLevel,
    progressPercent,
    remainingXp,
    openLevelModal
  } = useRewards();

  // Subtle load animation for progress bar width
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progressPercent);
    }, 120);
    return () => clearTimeout(timer);
  }, [progressPercent]);

  // Compute tier multiplier based on current level
  const tierMultiplier = (1 + (currentLevel.level - 1) * 0.05).toFixed(2);
  const potentialCoins = Math.floor(gamePointsBalance * 0.1);
  const potentialXp = Math.floor(gamePointsBalance * 0.25);

  const scrollToRoadmap = () => {
    const el = document.getElementById('roadmap');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Milestone points along level progress
  const midpointXp = nextLevel ? Math.round((currentLevel.minXp + nextLevel.minXp) / 2) : 0;
  const isMidpointReached = currentXp >= midpointXp;

  return (
    <section id="hero" className={styles.levelSection} aria-label="Level Overview">
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionTopHeader}>
          <div className={styles.sectionHeaderLeft}>
            <div className={styles.sectionTag}>
              <Award size={14} className={styles.sectionTagIcon} />
              <span>TIER PROGRESSION COCKPIT</span>
            </div>
            <h2 className={styles.sectionMainTitle}>
              Level Status & Prestige Progress
            </h2>
            <p className={styles.sectionDesc}>
              Track your tier advancement, live multiplier boosts, and unlock high-yield fintech vouchers as you level up.
            </p>
          </div>

          <div className={styles.sectionHeaderRight}>
            <button
              onClick={scrollToRoadmap}
              className={styles.viewRoadmapBtn}
            >
              <span>View All 10 Tiers & Perks</span>
              <ArrowUpRight size={15} />
            </button>
          </div>
        </div>

        {/* Master Level Progression Card */}
        <div className={styles.masterCard}>
          <div className={styles.ambientAura} aria-hidden="true" />
          <div className={styles.ambientGlowSecondary} aria-hidden="true" />

          {/* Top Grid: Tier Identity & Progress Hub */}
          <div className={styles.masterGrid}>
            {/* Left Column: 3D Crest & Identity Showcase */}
            <div className={styles.crestShowcaseCol}>
              <div className={styles.crestWrapper}>
                <div className={styles.crestOrbitalRing} aria-hidden="true" />
                <div className={styles.crestOrbitalGlow} aria-hidden="true" />
                <div className={styles.crestImgContainer}>
                  <img
                    src={crest3dImg}
                    alt={`Level ${currentLevel.level} Insignia - ${currentLevel.name}`}
                    className={styles.crest3dImg}
                  />
                </div>
                <div className={styles.levelBadgeRibbon}>
                  <Crown size={12} className={styles.crownIcon} />
                  <span>LEVEL {currentLevel.level}</span>
                </div>
              </div>

              {/* Tier Details Under Crest */}
              <div className={styles.tierIdentityGroup}>
                <div className={styles.tierTagRow}>
                  <span className={styles.tierPill}>
                    {currentLevel.tier} Member
                  </span>
                  <span className={styles.verifiedTag}>
                    <CheckCircle2 size={12} /> Verified
                  </span>
                </div>

                <h3 className={styles.tierNameDisplay}>
                  {currentLevel.name}
                </h3>

                <div className={styles.activeBoostBadge}>
                  <Zap size={14} color="#38bdf8" />
                  <span>
                    <strong>{tierMultiplier}x Boost</strong> Active
                  </span>
                </div>

                {/* Unlocked Perks Chips */}
                <div className={styles.perksChipList}>
                  {currentLevel.perks.slice(0, 2).map((perk, i) => (
                    <div key={i} className={styles.perkChip}>
                      <span className={styles.perkChipDot} />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => openLevelModal(currentLevel)}
                  className={styles.inspectPerksBtn}
                >
                  <Gift size={14} />
                  <span>Inspect Current Perks</span>
                </button>
              </div>
            </div>

            {/* Right Column: Advanced Progress Cockpit */}
            <div className={styles.progressCockpitCol}>
              {/* Cockpit Status Header */}
              <div className={styles.cockpitStatusRow}>
                <div className={styles.statusIndicatorWrapper}>
                  <span className={styles.pulseDotGreen} />
                  <span className={styles.statusText}>Active Tier Progression</span>
                </div>

                <div className={styles.progressPercentPill}>
                  <Sparkles size={14} color="#fbbf24" />
                  <span>{progressPercent}% Completed</span>
                </div>

                <Tooltip text="Earn Level XP by playing arcade games and converting points. Advancing tiers multiplies your rewards and fee waivers.">
                  <span className={styles.tooltipIcon}>
                    <Info size={15} />
                  </span>
                </Tooltip>
              </div>

              {/* Big XP Display */}
              <div className={styles.xpBigHeader}>
                <div className={styles.xpCountBlock}>
                  <span className={styles.xpCurrentNumber}>
                    {currentXp.toLocaleString()}
                  </span>
                  <span className={styles.xpDivider}>/</span>
                  <span className={styles.xpTargetNumber}>
                    {nextLevel ? nextLevel.minXp.toLocaleString() : 'MAX'} XP
                  </span>
                </div>

                <div className={styles.remainingXpTag}>
                  {nextLevel ? (
                    <>
                      <Flame size={14} color="#f59e0b" />
                      <span>
                        <strong>{remainingXp.toLocaleString()} XP</strong> to unlock Level {nextLevel.level}
                      </span>
                    </>
                  ) : (
                    <span>Prestige Ceiling Reached</span>
                  )}
                </div>
              </div>

              {/* Progress Track with Milestone Checkpoints */}
              <div className={styles.progressTrackWrapper}>
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
                    <div className={styles.progressShimmerLight} />
                  </div>
                </div>

                {/* Milestone Checkpoints Along the Track */}
                <div className={styles.milestoneNodesRow}>
                  {/* Start Node */}
                  <div className={`${styles.milestoneNode} ${styles.milestoneCompleted}`}>
                    <div className={styles.nodeCircle}>
                      <CheckCircle2 size={12} />
                    </div>
                    <div className={styles.nodeInfo}>
                      <span className={styles.nodeLevel}>Lvl {currentLevel.level}</span>
                      <span className={styles.nodeXp}>{currentLevel.minXp.toLocaleString()} XP</span>
                    </div>
                  </div>

                  {/* Midpoint Node */}
                  {nextLevel && (
                    <div
                      className={`${styles.milestoneNode} ${
                        isMidpointReached ? styles.milestoneCompleted : styles.milestoneUpcoming
                      }`}
                      style={{ left: '50%', transform: 'translateX(-50%)', position: 'absolute' }}
                    >
                      <div className={styles.nodeCircle}>
                        {isMidpointReached ? <CheckCircle2 size={12} /> : <Zap size={10} />}
                      </div>
                      <div className={styles.nodeInfo}>
                        <span className={styles.nodeLevel}>Mid-Tier Perk</span>
                        <span className={styles.nodeXp}>+50 VE Coins Drop</span>
                      </div>
                    </div>
                  )}

                  {/* Target End Node */}
                  {nextLevel && (
                    <div className={`${styles.milestoneNode} ${styles.milestoneTarget}`}>
                      <div className={styles.nodeCircle}>
                        <Crown size={12} />
                      </div>
                      <div className={styles.nodeInfo}>
                        <span className={styles.nodeLevel}>Lvl {nextLevel.level}: {nextLevel.name}</span>
                        <span className={styles.nodeXp}>{nextLevel.minXp.toLocaleString()} XP</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Next Milestone Teaser Banner Card */}
              {nextLevel && (
                <div className={styles.nextTierTeaserCard}>
                  <div className={styles.teaserLeft}>
                    <div className={styles.teaserIconWrapper}>
                      <Gift size={20} color="#f59e0b" />
                    </div>
                    <div className={styles.teaserContent}>
                      <div className={styles.teaserTag}>
                        <span>UPCOMING MILESTONE REWARD</span>
                        <span className={styles.teaserLevelPill}>Level {nextLevel.level}</span>
                      </div>
                      <h4 className={styles.teaserTitle}>
                        {nextLevel.rewardTitle}
                      </h4>
                    </div>
                  </div>

                  <div className={styles.teaserRight}>
                    <button
                      onClick={() => openLevelModal(nextLevel)}
                      className={styles.teaserInspectBtn}
                    >
                      <span>Perks Preview</span>
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Redesigned 4-Card Metrics Grid */}
          <div className={styles.metricsGrid}>
            {/* Metric 1: Total XP */}
            <div className={`${styles.metricCard} ${styles.metricCardPurple}`}>
              <div className={styles.metricIconBox}>
                <Sparkles size={20} />
              </div>
              <div className={styles.metricDetails}>
                <span className={styles.metricLabel}>Total XP Earned</span>
                <span className={styles.metricValue}>
                  {currentXp.toLocaleString()}
                </span>
                <span className={styles.metricContext}>
                  Rank #{currentLevel.level} • Top 12% Platform
                </span>
              </div>
            </div>

            {/* Metric 2: Spendable VE Coins */}
            <div className={`${styles.metricCard} ${styles.metricCardGold}`}>
              <div className={styles.metricIconBox}>
                <Coins size={20} />
              </div>
              <div className={styles.metricDetails}>
                <span className={styles.metricLabel}>VE Coins Wallet</span>
                <span className={`${styles.metricValue} ${styles.goldVal}`}>
                  {veCoinsBalance.toLocaleString()} VE
                </span>
                <span className={styles.metricContext}>
                  ≈ ${(veCoinsBalance * 0.01).toFixed(2)} USD Spendable Value
                </span>
              </div>
            </div>

            {/* Metric 3: Arcade Points Vault */}
            <div className={`${styles.metricCard} ${styles.metricCardBlue}`}>
              <div className={styles.metricIconBox}>
                <Zap size={20} />
              </div>
              <div className={styles.metricDetails}>
                <span className={styles.metricLabel}>Arcade Points Vault</span>
                <span className={`${styles.metricValue} ${styles.blueVal}`}>
                  {gamePointsBalance.toLocaleString()} pts
                </span>
                <span className={styles.metricContext}>
                  Converts to +{potentialCoins} VE & +{potentialXp} XP
                </span>
              </div>
            </div>

            {/* Metric 4: Tier Multiplier */}
            <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
              <div className={styles.metricIconBox}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.metricDetails}>
                <span className={styles.metricLabel}>Tier Multiplier</span>
                <span className={`${styles.metricValue} ${styles.greenVal}`}>
                  {tierMultiplier}x Boost
                </span>
                <span className={styles.metricContext}>
                  +{Math.round((tierMultiplier - 1) * 100)}% Bonus on all activities
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
