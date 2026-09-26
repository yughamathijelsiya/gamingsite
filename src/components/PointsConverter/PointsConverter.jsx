import React, { useState } from 'react';
import {
  Repeat,
  Coins,
  Sparkles,
  Zap,
  Gift,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Crown
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import styles from './PointsConverter.module.css';

export default function PointsConverter() {
  const {
    gamePointsBalance,
    veCoinsBalance,
    convertPoints,
    redeemShopItem
  } = useRewards();

  const [pointsToExchange, setPointsToExchange] = useState(() => Math.min(500, gamePointsBalance));
  const [conversionSuccess, setConversionSuccess] = useState(null);
  const [redeemedItemId, setRedeemedItemId] = useState(null);

  // Compute live gains
  const coinsGained = Math.floor(pointsToExchange * 0.1);
  const xpGained = Math.floor(pointsToExchange * 0.25);

  const handleConvert = () => {
    if (pointsToExchange <= 0 || pointsToExchange > gamePointsBalance) return;
    const result = convertPoints(pointsToExchange);
    setConversionSuccess(result);
    setTimeout(() => setConversionSuccess(null), 4000);
    setPointsToExchange(0);
  };

  const handleRedeem = (id, title, cost) => {
    const success = redeemShopItem(id, title, cost);
    if (success) {
      setRedeemedItemId(id);
      setTimeout(() => setRedeemedItemId(null), 3000);
    }
  };

  const shopItems = [
    {
      id: 'shop_voucher_10',
      title: '$10.00 Digital Reward Card',
      desc: 'Instant redeemable credit code for online merchants.',
      cost: 500,
      icon: CreditCard
    },
    {
      id: 'shop_boost_24h',
      title: '24-Hour 1.5x Multiplier Boost',
      desc: 'Amplifies all task and game XP by 50% for 24 hours.',
      cost: 350,
      icon: Zap
    },
    {
      id: 'shop_fee_pass',
      title: 'Zero-Fee Transfer Pass',
      desc: 'Waives transaction settlement fees on your next 5 payouts.',
      cost: 200,
      icon: ShieldCheck
    },
    {
      id: 'shop_gold_badge',
      title: 'Founder Gold Insignia Crest',
      desc: 'Permanent golden profile frame and prestige badge.',
      cost: 800,
      icon: Crown
    }
  ];

  return (
    <section id="points-converter" className={styles.converterSection} aria-label="Points to Coins Converter">
      <div className="container">
        <div className={styles.converterCard}>
          <div className={styles.ambientGlow} aria-hidden="true" />

          {/* Section Header */}
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.subHeading}>Arcade Exchange Treasury</span>
              <h2 className={styles.mainHeading}>Points to Coins & XP Converter</h2>
              <p className={styles.sectionDesc}>
                Convert high-score points earned in <strong>Cyber Surfers</strong> and <strong>VE Coin Catch</strong> into spendable <strong>VE Coins</strong> and tier-advancing <strong>Level XP</strong>.
              </p>
            </div>

            {/* Balances Bar */}
            <div className={styles.balancesBar}>
              <div className={styles.balancePill}>
                <div className={styles.balanceIcon} style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
                  <Zap size={20} />
                </div>
                <div className={styles.balanceContent}>
                  <span className={styles.balanceLabel}>Unconverted Points</span>
                  <span className={styles.balanceValue} style={{ color: '#38bdf8' }}>
                    {gamePointsBalance.toLocaleString()} pts
                  </span>
                </div>
              </div>

              <div className={styles.balancePill}>
                <div className={styles.balanceIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                  <Coins size={20} />
                </div>
                <div className={styles.balanceContent}>
                  <span className={styles.balanceLabel}>VE Coins Wallet</span>
                  <span className={styles.balanceValue} style={{ color: '#fbbf24' }}>
                    {veCoinsBalance.toLocaleString()} Coins
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Machine Grid */}
          <div className={styles.machineGrid}>
            {/* Left: Exchange Machine */}
            <div className={styles.exchangeBox}>
              <h3 className={styles.boxTitle}>
                <Repeat size={18} color="#f59e0b" />
                <span>Exchange Machine</span>
              </h3>

              {/* Presets */}
              <div className={styles.presetGroup}>
                {[100, 250, 500, 1000].map((amt) => (
                  <button
                    key={amt}
                    className={`${styles.presetBtn} ${pointsToExchange === amt ? styles.activePreset : ''}`}
                    onClick={() => setPointsToExchange(Math.min(amt, gamePointsBalance))}
                    disabled={gamePointsBalance < amt}
                  >
                    {amt} pts
                  </button>
                ))}
                <button
                  className={`${styles.presetBtn} ${pointsToExchange === gamePointsBalance && gamePointsBalance > 0 ? styles.activePreset : ''}`}
                  onClick={() => setPointsToExchange(gamePointsBalance)}
                  disabled={gamePointsBalance === 0}
                >
                  All ({gamePointsBalance} pts)
                </button>
              </div>

              {/* Slider Input */}
              <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#cbd5e1' }}>
                  <span>Points to Convert</span>
                  <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{pointsToExchange} pts</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max={Math.max(100, gamePointsBalance)}
                  step="50"
                  value={pointsToExchange}
                  onChange={(e) => setPointsToExchange(Number(e.target.value))}
                  className={styles.sliderInput}
                />
              </div>

              {/* Live Output Card */}
              <div className={styles.exchangeOutputCard}>
                <div className={styles.outputItem}>
                  <span className={styles.outputLabel}>You Receive</span>
                  <span className={styles.outputValue} style={{ color: '#fbbf24' }}>
                    +{coinsGained} VE Coins
                  </span>
                </div>

                <div style={{ width: '1px', height: '36px', background: 'rgba(255, 255, 255, 0.1)' }} />

                <div className={styles.outputItem}>
                  <span className={styles.outputLabel}>Level Boost</span>
                  <span className={styles.outputValue} style={{ color: '#38bdf8' }}>
                    +{xpGained} XP
                  </span>
                </div>
              </div>

              {conversionSuccess && (
                <div style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.4)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#34d399',
                  fontSize: '0.82rem'
                }}>
                  <CheckCircle2 size={16} />
                  <span>
                    Successfully converted! Credited <strong>+{conversionSuccess.coinsGained} VE Coins</strong> and <strong>+{conversionSuccess.xpGained} XP</strong>.
                  </span>
                </div>
              )}

              {/* Action Button */}
              <button
                className={styles.convertActionBtn}
                onClick={handleConvert}
                disabled={pointsToExchange <= 0 || pointsToExchange > gamePointsBalance}
              >
                <Sparkles size={16} />
                <span>Exchange & Claim Coins + XP</span>
              </button>
            </div>

            {/* Right: VE Coins Rewards Shop */}
            <div className={styles.shopBox}>
              <h3 className={styles.boxTitle}>
                <Gift size={18} color="#38bdf8" />
                <span>VE Coins Rewards Shop</span>
              </h3>

              <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
                Redeem your verified VE Coins for tangible vouchers, multiplier boosts, and account passes.
              </p>

              <div className={styles.shopItemsList}>
                {shopItems.map((item) => {
                  const Icon = item.icon;
                  const canAfford = veCoinsBalance >= item.cost;
                  const isRedeemed = redeemedItemId === item.id;

                  return (
                    <div key={item.id} className={styles.shopItem}>
                      <div className={itemInfoStyles(styles)}>
                        <div className={styles.itemIcon}>
                          <Icon size={18} />
                        </div>
                        <div>
                          <h4 className={styles.itemTitle}>{item.title}</h4>
                          <span className={styles.itemCost}>🪙 {item.cost} Coins</span>
                        </div>
                      </div>

                      <button
                        className={styles.redeemBtn}
                        onClick={() => handleRedeem(item.id, item.title, item.cost)}
                        disabled={!canAfford}
                      >
                        {isRedeemed ? 'Redeemed!' : canAfford ? 'Redeem' : 'Need Coins'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function itemInfoStyles(styles) {
  return styles.itemInfo;
}
