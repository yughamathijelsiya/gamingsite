import React, { useState } from 'react';
import { Gamepad2, Zap, PlaySquare } from 'lucide-react';
import SubwayRunner from './SubwayRunner';
import VECoinCatch from './VECoinCatch';
import styles from './ArcadeHub.module.css';

export default function ArcadeHub({ onGoToConverter }) {
  const [selectedGame, setSelectedGame] = useState('runner'); // 'runner' | 'catch'

  return (
    <section id="arcade-games" className={styles.arcadeSection} aria-label="Arcade Games Section">
      <div className="container">
        {/* Section Header with Game Selector */}
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.subHeading}>Play & Earn Arcade</span>
            <h2 className={styles.mainHeading}>VELOOP Gaming Arcade</h2>
            <p className={styles.sectionDesc}>
              Play skill-based mini-games to collect VE coins, set high scores, and accumulate points that can be exchanged for wallet coins and level progress.
            </p>
          </div>

          {/* Game Selection Switcher */}
          <div className={styles.gameTabs} role="tablist">
            <button
              className={`${styles.tabBtn} ${selectedGame === 'runner' ? styles.activeTab : ''}`}
              onClick={() => setSelectedGame('runner')}
              role="tab"
              aria-selected={selectedGame === 'runner'}
            >
              <Zap size={16} />
              <span>Cyber Surfers 3D</span>
            </button>

            <button
              className={`${styles.tabBtn} ${selectedGame === 'catch' ? styles.activeTabAlt : ''}`}
              onClick={() => setSelectedGame('catch')}
              role="tab"
              aria-selected={selectedGame === 'catch'}
            >
              <Gamepad2 size={16} />
              <span>VE Coin Catch</span>
            </button>
          </div>
        </div>

        {/* Selected Game Component */}
        <div className={styles.gameCardContainer}>
          {selectedGame === 'runner' ? (
            <SubwayRunner onGoToConverter={onGoToConverter} />
          ) : (
            <VECoinCatch onGoToConverter={onGoToConverter} />
          )}
        </div>
      </div>
    </section>
  );
}
