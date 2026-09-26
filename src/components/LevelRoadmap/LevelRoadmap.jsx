import React, { useRef } from 'react';
import {
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Gift,
  ArrowUpRight
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './LevelRoadmap.module.css';

export default function LevelRoadmap() {
  const { allLevels, currentLevel, nextLevel, openLevelModal } = useRewards();
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="roadmap" className={styles.roadmapSection} aria-label="Progression Roadmap">
      <div className="container">
        <div className={styles.sectionHeader}>
          <div className={styles.headerText}>
            <span className={styles.subHeading}>Ecosystem Progression</span>
            <h2 className={styles.mainHeading}>Level Roadmap & Perks</h2>
          </div>

          <div className={styles.headerControls}>
            <button
              className={styles.scrollBtn}
              onClick={() => handleScroll('left')}
              aria-label="Scroll left in roadmap"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className={styles.scrollBtn}
              onClick={() => handleScroll('right')}
              aria-label="Scroll right in roadmap"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Timeline Scroll Container */}
        <div className={styles.timelineScrollContainer} ref={scrollRef}>
          {allLevels.map((lvl) => {
            const isCompleted = lvl.level < currentLevel.level;
            const isCurrent = lvl.level === currentLevel.level;
            const isNext = nextLevel && lvl.level === nextLevel.level;
            const isFuture = lvl.level > (nextLevel ? nextLevel.level : currentLevel.level);

            return (
              <div
                key={lvl.level}
                className={`${styles.levelNode} ${
                  isCompleted
                    ? styles.completedNode
                    : isCurrent
                    ? styles.currentNode
                    : isNext
                    ? styles.nextNode
                    : styles.lockedNode
                }`}
                onClick={() => openLevelModal(lvl)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLevelModal(lvl);
                  }
                }}
                aria-label={`Level ${lvl.level} ${lvl.name}. ${
                  isCompleted ? 'Completed' : isCurrent ? 'Current' : 'Locked'
                }. Click to view details.`}
              >
                {/* Active Level Marker */}
                {isCurrent && (
                  <div className={styles.currentMarkerTag}>
                    Current Level
                  </div>
                )}

                {/* Node Header */}
                <div className={styles.nodeHeader}>
                  <span
                    className={`${styles.levelBadge} ${
                      isCompleted
                        ? styles.badgeCompleted
                        : isCurrent
                        ? styles.badgeCurrent
                        : isNext
                        ? styles.badgeNext
                        : styles.badgeLocked
                    }`}
                  >
                    Level {lvl.level}
                  </span>

                  <div className={styles.statusIcon}>
                    {isCompleted ? (
                      <CheckCircle2 size={18} color="#34d399" />
                    ) : isCurrent ? (
                      <Sparkles size={18} color="#f59e0b" />
                    ) : (
                      <Lock size={16} color="#64748b" />
                    )}
                  </div>
                </div>

                {/* Node Body */}
                <div className={styles.nodeBody}>
                  <span className={styles.tierLabel}>{lvl.tier} Tier</span>
                  <h3 className={styles.nodeTitle}>{lvl.name}</h3>
                  <span className={styles.xpRequired}>
                    {lvl.minXp.toLocaleString()} XP required
                  </span>
                </div>

                {/* Reward Preview Box */}
                <div className={styles.rewardBox}>
                  <span className={styles.rewardBoxLabel}>Milestone Reward</span>
                  <span className={styles.rewardBoxValue}>
                    {lvl.rewardValue}
                  </span>
                </div>

                <div className={styles.inspectHint}>
                  <span>Click to view all perks</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
