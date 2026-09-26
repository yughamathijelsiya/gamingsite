import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import DemoToolbar from '../components/DemoToolbar/DemoToolbar';
import LevelHero from '../components/LevelHero/LevelHero';
import NextRewardCard from '../components/NextRewardCard/NextRewardCard';
import LevelRoadmap from '../components/LevelRoadmap/LevelRoadmap';
import ArcadeHub from '../components/Game/ArcadeHub';
import PointsConverter from '../components/PointsConverter/PointsConverter';
import EarningHub from '../components/EarningHub/EarningHub';
import XPActivityFeed from '../components/XPActivityFeed/XPActivityFeed';
import LevelDetailModal from '../components/LevelDetailModal/LevelDetailModal';
import LevelUpModal from '../components/LevelUpModal/LevelUpModal';
import SkeletonLoader from '../components/SkeletonLoader/SkeletonLoader';
import ErrorState from '../components/ErrorState/ErrorState';
import { useRewards } from '../context/RewardsContext';
import styles from './LevelDashboard.module.css';

export default function LevelDashboard() {
  const { isLoadingSkeleton, hasSimulatedError } = useRewards();
  const [showDemoTools, setShowDemoTools] = useState(true);

  const scrollToConverter = () => {
    const el = document.getElementById('points-converter');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.ambientTopGlow} aria-hidden="true" />

      {/* Navigation Header */}
      <Navbar
        showDemoTools={showDemoTools}
        onToggleDemoTools={() => setShowDemoTools((prev) => !prev)}
      />

      {/* Floating Demo Testing Panel */}
      <DemoToolbar
        isOpen={showDemoTools}
        onClose={() => setShowDemoTools(false)}
      />

      {/* Main Page Body */}
      <main className={styles.mainContent}>
        {hasSimulatedError ? (
          <ErrorState />
        ) : isLoadingSkeleton ? (
          <SkeletonLoader />
        ) : (
          <>
            <LevelHero />
            <NextRewardCard />
            <LevelRoadmap />
            {/* Play & Earn Arcade: Cyber Surfers 3D Runner + VE Coin Catch */}
            <ArcadeHub onGoToConverter={scrollToConverter} />
            {/* Points to VE Coins & XP Converter & Rewards Vault */}
            <PointsConverter />
            <EarningHub />
            <XPActivityFeed />
          </>
        )}
      </main>

      {/* Modals */}
      <LevelDetailModal />
      <LevelUpModal />

      {/* Fintech Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContainer}>
            <div className={styles.footerLeft}>
              <span className={styles.footerBrand}>VELOOP Rewards & Arcade Ecosystem</span>
              <span>Sophisticated fintech tier incentives, 3D arcade games, and points conversion.</span>
            </div>

            <div className={styles.footerRight}>
              <a href="#hero" className={styles.footerLink}>Level Overview</a>
              <a href="#roadmap" className={styles.footerLink}>Tier Roadmap</a>
              <a href="#arcade-games" className={styles.footerLink}>Arcade Games</a>
              <a href="#points-converter" className={styles.footerLink}>Points Converter</a>
              <a href="#earning-hub" className={styles.footerLink}>Earning Hub</a>
              <a href="#activity-feed" className={styles.footerLink}>Activity Ledger</a>
            </div>
          </div>

          <div className={styles.disclaimerBanner}>
            *Disclaimer: All XP values, multiplier boosts, VE Coins, and reward vouchers displayed in this dashboard are part of the VELOOP Rewards simulation model. Cyber Surfers: Neon Run and VE Coin Catch are 100% skill-based frontend arcade games and contain zero gambling, betting, casino mechanics, or real cash wagering. VELOOP Inc. © 2026. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
