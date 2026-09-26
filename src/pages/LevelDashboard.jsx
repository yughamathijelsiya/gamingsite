import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import DemoToolbar from '../components/DemoToolbar/DemoToolbar';
import LevelHero from '../components/LevelHero/LevelHero';
import NextRewardCard from '../components/NextRewardCard/NextRewardCard';
import LevelRoadmap from '../components/LevelRoadmap/LevelRoadmap';
import VECoinCatch from '../components/Game/VECoinCatch';
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
            <VECoinCatch />
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
              <span className={styles.footerBrand}>VELOOP Rewards & Ecosystem</span>
              <span>Sophisticated fintech tier incentives with skill gamification.</span>
            </div>

            <div className={styles.footerRight}>
              <a href="#hero" className={styles.footerLink}>Level Overview</a>
              <a href="#roadmap" className={styles.footerLink}>Tier Roadmap</a>
              <a href="#play-earn" className={styles.footerLink}>VE Coin Catch</a>
              <a href="#earning-hub" className={styles.footerLink}>Earning Hub</a>
              <a href="#activity-feed" className={styles.footerLink}>Activity Ledger</a>
            </div>
          </div>

          <div className={styles.disclaimerBanner}>
            *Disclaimer: All XP values, multiplier boosts, and reward vouchers displayed in this dashboard are part of the VELOOP Rewards simulation model. VE Coin Catch is a purely skill-based frontend mini-game and contains zero gambling, betting, casino mechanics, or real cash wagering. VELOOP Inc. © 2026. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
