import React from 'react';
import { Sparkles, Volume2, VolumeX, Shield, Wrench, Check, Coins, Repeat, Gamepad2 } from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import Tooltip from '../Tooltip/Tooltip';
import styles from './Navbar.module.css';

export default function Navbar({ onToggleDemoTools, showDemoTools }) {
  const { currentXp, veCoinsBalance, currentLevel, isSoundMuted, toggleSound } = useRewards();

  return (
    <header className={styles.navbar}>
      <div className="container">
        <div className={styles.navContainer}>
          {/* Logo & Brand */}
          <a href="#hero" className={styles.brandLink}>
            <div className={styles.logoIcon}>
              <span>V</span>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandName}>VELOOP</span>
              <span className={styles.brandTag}>Rewards & Arcade Hub</span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className={styles.navLinks} aria-label="Main Navigation">
            <a href="#hero" className={`${styles.navLink} ${styles.active}`}>Overview</a>
            <a href="#next-reward" className={styles.navLink}>Next Reward</a>
            <a href="#roadmap" className={styles.navLink}>Roadmap</a>
            <a href="#arcade-games" className={styles.navLink}>Arcade Games</a>
            <a href="#points-converter" className={styles.navLink}>Convert Points</a>
            <a href="#earning-hub" className={styles.navLink}>Earn XP</a>
            <a href="#activity-feed" className={styles.navLink}>Activity</a>
          </nav>

          {/* Right Actions */}
          <div className={styles.navActions}>
            {/* Live VE Coins Balance */}
            <a href="#points-converter" style={{ textDecoration: 'none' }}>
              <div
                className={styles.xpBadge}
                style={{ background: 'rgba(245, 158, 11, 0.12)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#fbbf24' }}
                title="VE Coins Balance (Click to open converter)"
              >
                <Coins size={14} />
                <span>{veCoinsBalance.toLocaleString()} Coins</span>
              </div>
            </a>

            {/* Live XP Badge */}
            <div className={styles.xpBadge} title="Current Total XP">
              <Sparkles size={14} />
              <span>{currentXp.toLocaleString()} XP</span>
            </div>

            {/* Level Pill */}
            <div className={styles.levelPill}>
              <span className={styles.levelTag}>Lvl {currentLevel.level}</span>
              <span>{currentLevel.name}</span>
            </div>

            {/* Audio Toggle */}
            <Tooltip text={isSoundMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}>
              <button
                className={styles.iconBtn}
                onClick={toggleSound}
                aria-label={isSoundMuted ? 'Unmute sound' : 'Mute sound'}
              >
                {isSoundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </Tooltip>

            {/* Demo Testing Controls Toggle */}
            <Tooltip text="Toggle Demo Controls & Edge States">
              <button
                className={`${styles.iconBtn} ${showDemoTools ? styles.active : ''}`}
                onClick={onToggleDemoTools}
                aria-label="Toggle Demo Controls"
                style={showDemoTools ? { background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.4)' } : {}}
              >
                <Wrench size={16} />
              </button>
            </Tooltip>

            {/* User Profile Avatar */}
            <div className={styles.profileAvatar} title="Verified Tier Member">
              <span>MC</span>
              <div className={styles.verifiedCheck}>
                <Check size={8} strokeWidth={3} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
