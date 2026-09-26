import React, { useState } from 'react';
import { Zap, Gamepad2, Sparkles, Network, Brain } from 'lucide-react';
import SubwayRunner from './SubwayRunner';
import CryptoCrush from './CryptoCrush';
import FintechConnections from './FintechConnections';
import NeuroBrainMatrix from './NeuroBrainMatrix';
import VECoinCatch from './VECoinCatch';
import styles from './ArcadeHub.module.css';

export default function ArcadeHub({ onGoToConverter }) {
  const [selectedGame, setSelectedGame] = useState('runner'); // 'runner' | 'crush' | 'connections' | 'brain' | 'catch'

  return (
    <section id="arcade-games" className={styles.arcadeSection} aria-label="Arcade Games Section">
      <div className="container">
        {/* Section Header with Game Selector */}
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.subHeading}>Play & Earn Arcade (5 Games)</span>
            <h2 className={styles.mainHeading}>VELOOP Gaming Arcade</h2>
            <p className={styles.sectionDesc}>
              Play skill-based arcade games, solve logic puzzles, and complete brain tests. All points scored accumulate into your Points Vault to be exchanged for spendable <strong>VE Coins</strong> and <strong>Level XP</strong>!
            </p>
          </div>

          {/* Game Selection Switcher Tabs */}
          <div className={styles.gameTabs} role="tablist">
            <button
              className={`${styles.tabBtn} ${selectedGame === 'runner' ? styles.activeGold : ''}`}
              onClick={() => setSelectedGame('runner')}
              role="tab"
              aria-selected={selectedGame === 'runner'}
            >
              <Zap size={15} />
              <span>Cyber Surfers</span>
            </button>

            <button
              className={`${styles.tabBtn} ${selectedGame === 'crush' ? styles.activeGold : ''}`}
              onClick={() => setSelectedGame('crush')}
              role="tab"
              aria-selected={selectedGame === 'crush'}
            >
              <Sparkles size={15} />
              <span>Crypto Crush</span>
            </button>

            <button
              className={`${styles.tabBtn} ${selectedGame === 'connections' ? styles.activeBlue : ''}`}
              onClick={() => setSelectedGame('connections')}
              role="tab"
              aria-selected={selectedGame === 'connections'}
            >
              <Network size={15} />
              <span>Connections</span>
            </button>

            <button
              className={`${styles.tabBtn} ${selectedGame === 'brain' ? styles.activePurple : ''}`}
              onClick={() => setSelectedGame('brain')}
              role="tab"
              aria-selected={selectedGame === 'brain'}
            >
              <Brain size={15} />
              <span>Brain Matrix</span>
            </button>

            <button
              className={`${styles.tabBtn} ${selectedGame === 'catch' ? styles.activeBlue : ''}`}
              onClick={() => setSelectedGame('catch')}
              role="tab"
              aria-selected={selectedGame === 'catch'}
            >
              <Gamepad2 size={15} />
              <span>Coin Catch</span>
            </button>
          </div>
        </div>

        {/* Selected Game Rendering */}
        <div className={styles.gameCardContainer}>
          {selectedGame === 'runner' && <SubwayRunner onGoToConverter={onGoToConverter} />}
          {selectedGame === 'crush' && <CryptoCrush onGoToConverter={onGoToConverter} />}
          {selectedGame === 'connections' && <FintechConnections onGoToConverter={onGoToConverter} />}
          {selectedGame === 'brain' && <NeuroBrainMatrix onGoToConverter={onGoToConverter} />}
          {selectedGame === 'catch' && <VECoinCatch onGoToConverter={onGoToConverter} />}
        </div>
      </div>
    </section>
  );
}
