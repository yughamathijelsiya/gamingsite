import React, { useState } from 'react';
import {
  CalendarCheck,
  Gamepad2,
  Trophy,
  PlaySquare,
  Users,
  ShieldCheck,
  Flame,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import WatchEarnModal from './WatchEarnModal';
import ReferModal from './ReferModal';
import BonusModal from './BonusModal';
import styles from './EarningHub.module.css';

export default function EarningHub() {
  const {
    dailyTasks,
    claimTask,
    dailyChallenge,
    claimDailyChallenge,
    streakData,
    claimTodayStreak,
    gameStats,
    watchAndEarn
  } = useRewards();

  const [activeCategory, setActiveCategory] = useState('all');
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);

  return (
    <section id="earning-hub" className={styles.earningSection} aria-label="Earning Hub Section">
      <div className="container">
        {/* Section Header */}
        <div className={styles.sectionHeader}>
          <span className={styles.subHeading}>Accelerate Progression</span>
          <h2 className={styles.mainHeading}>Earn More XP & Rewards</h2>
          <p className={styles.sectionDesc}>
            Complete daily fintech rituals, achieve high scores in skill mini-games, and verify account security milestones to claim XP boosts toward your next tier unlock.
          </p>

          {/* Filter Tabs */}
          <div className={styles.filterTabs} role="tablist">
            {['all', 'daily', 'games', 'community', 'security'].map((cat) => (
              <button
                key={cat}
                className={`${styles.tabBtn} ${activeCategory === cat ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(cat)}
                role="tab"
                aria-selected={activeCategory === cat}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Earning Cards Grid */}
        <div className={styles.hubGrid}>
          {/* CARD 1: 7-Day Streak XP */}
          {(activeCategory === 'all' || activeCategory === 'daily') && (
            <div className={`${styles.card} ${styles.featuredCard}`}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#f59e0b' }}>
                  <Flame size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>+{streakData.days[streakData.todayDayIndex]?.xp || 100} XP Today</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Daily Login Streak</h3>
                <p className={styles.cardDesc}>
                  You are on a <strong>{streakData.currentStreak}-Day Streak</strong>! Check in every consecutive day to multiply your weekly payout.
                </p>

                {/* 7-Day Calendar Strip */}
                <div className={styles.streakCalendar}>
                  {streakData.days.map((day, idx) => {
                    const isDone = day.status === 'completed';
                    const isToday = idx === streakData.todayDayIndex;

                    return (
                      <div
                        key={idx}
                        className={`${styles.streakDay} ${
                          isDone
                            ? styles.streakDayCompleted
                            : isToday && !streakData.hasClaimedToday
                            ? styles.streakDayAvailable
                            : ''
                        }`}
                      >
                        <span className={styles.dayLabel}>{day.day}</span>
                        <span className={styles.dayXp}>+{day.xp}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className={styles.cardBottom}>
                <button
                  className={`${styles.ctaBtn} ${
                    streakData.hasClaimedToday ? styles.ctaClaimed : styles.ctaPrimary
                  }`}
                  onClick={claimTodayStreak}
                  disabled={streakData.hasClaimedToday}
                >
                  {streakData.hasClaimedToday ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Day 4 Streak Claimed</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      <span>Claim Day 4 Bonus (+100 XP)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* CARD 2: Daily Member Check-In Task */}
          {(activeCategory === 'all' || activeCategory === 'daily') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#38bdf8' }}>
                  <CalendarCheck size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>+50 XP</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Daily Account Check-In</h3>
                <p className={styles.cardDesc}>
                  Confirm your active session and view market rate movements to claim your baseline daily member XP.
                </p>
              </div>

              <div className={styles.cardBottom}>
                {dailyTasks.find((t) => t.id === 'task_daily_login')?.isClaimed ? (
                  <button className={`${styles.ctaBtn} ${styles.ctaClaimed}`} disabled>
                    <CheckCircle2 size={16} />
                    <span>Completed Today</span>
                  </button>
                ) : (
                  <button
                    className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
                    onClick={() => claimTask('task_daily_login')}
                  >
                    <span>Claim Check-In (+50 XP)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CARD 3: Play & Earn (VE Coin Catch) */}
          {(activeCategory === 'all' || activeCategory === 'games') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#818cf8' }}>
                  <Gamepad2 size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>Up to +250 XP</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Play & Earn: VE Coin Catch</h3>
                <p className={styles.cardDesc}>
                  Engage in a 30-second skill test. Intercept coins, sapphire orbs, and diamond stars with zero gambling.
                </p>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '12px' }}>
                  <span>Plays: <strong>{gameStats.dailyPlaysLeft}/3 left</strong></span>
                  <span>Best: <strong>{gameStats.highScore} pts</strong></span>
                </div>
              </div>

              <div className={styles.cardBottom}>
                <a href="#play-earn" className={styles.ctaBtn}>
                  <span>Play Mini-Game</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          )}

          {/* CARD 4: Daily Challenge (High Score) */}
          {(activeCategory === 'all' || activeCategory === 'games') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#fbbf24' }}>
                  <Trophy size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>+{dailyChallenge.xpReward} XP</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{dailyChallenge.title}</h3>
                <p className={styles.cardDesc}>
                  {dailyChallenge.description} Target: <strong>250+ points</strong>.
                </p>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} />
                  <span>Expires in {dailyChallenge.expiresInHours} hours</span>
                </div>
              </div>

              <div className={styles.cardBottom}>
                {dailyChallenge.isClaimed ? (
                  <button className={`${styles.ctaBtn} ${styles.ctaClaimed}`} disabled>
                    <CheckCircle2 size={16} />
                    <span>Challenge Claimed</span>
                  </button>
                ) : dailyChallenge.isUnlocked ? (
                  <button
                    className={`${styles.ctaBtn} ${styles.ctaPrimary}`}
                    onClick={claimDailyChallenge}
                  >
                    <span>Claim +{dailyChallenge.xpReward} XP</span>
                  </button>
                ) : (
                  <a href="#play-earn" className={styles.ctaBtn}>
                    <span>Complete in Mini-Game</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* CARD 5: Watch & Earn */}
          {(activeCategory === 'all' || activeCategory === 'daily') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#38bdf8' }}>
                  <PlaySquare size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>+{watchAndEarn.xpReward} XP</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Watch & Earn</h3>
                <p className={styles.cardDesc}>
                  Watch a 15-second visual interactive fintech primer on how multipliers compound your monthly payouts.
                </p>
              </div>

              <div className={styles.cardBottom}>
                {watchAndEarn.isClaimed ? (
                  <button className={`${styles.ctaBtn} ${styles.ctaClaimed}`} disabled>
                    <CheckCircle2 size={16} />
                    <span>Watched & Claimed</span>
                  </button>
                ) : (
                  <button
                    className={styles.ctaBtn}
                    onClick={() => setIsWatchModalOpen(true)}
                  >
                    <span>Open Module</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* CARD 6: Refer & Earn */}
          {(activeCategory === 'all' || activeCategory === 'community') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#a78bfa' }}>
                  <Users size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>+250 XP / Invite</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Refer & Earn</h3>
                <p className={styles.cardDesc}>
                  Share your private invite link with peers. Earn +250 XP each time an invitee activates Level 2.
                </p>
              </div>

              <div className={styles.cardBottom}>
                <button
                  className={styles.ctaBtn}
                  onClick={() => setIsReferModalOpen(true)}
                >
                  <span>Share Invite Link</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* CARD 7: Bonus Missions (KYC & 2FA) */}
          {(activeCategory === 'all' || activeCategory === 'security') && (
            <div className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox} style={{ color: '#34d399' }}>
                  <ShieldCheck size={24} />
                </div>
                <div className={styles.rewardBadge}>
                  <Sparkles size={13} />
                  <span>Up to +550 XP</span>
                </div>
              </div>

              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>Bonus Missions</h3>
                <p className={styles.cardDesc}>
                  Complete KYC identity verification and security audit checks to earn substantial one-time bonuses.
                </p>
              </div>

              <div className={styles.cardBottom}>
                <button
                  className={styles.ctaBtn}
                  onClick={() => setIsBonusModalOpen(true)}
                >
                  <span>Inspect Missions</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <WatchEarnModal
          isOpen={isWatchModalOpen}
          onClose={() => setIsWatchModalOpen(false)}
        />
        <ReferModal
          isOpen={isReferModalOpen}
          onClose={() => setIsReferModalOpen(false)}
        />
        <BonusModal
          isOpen={isBonusModalOpen}
          onClose={() => setIsBonusModalOpen(false)}
        />
      </div>
    </section>
  );
}
