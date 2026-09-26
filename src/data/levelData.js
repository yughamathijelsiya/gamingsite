// Tier and Level Progression Definitions for VELOOP Rewards
// Separated data model easily replaceable by backend API

export const LEVEL_DATA = [
  {
    level: 1,
    name: 'Bronze Initiate',
    tier: 'Bronze',
    minXp: 0,
    maxXp: 1000,
    rewardTitle: '$5.00 Welcome Voucher',
    rewardValue: '$5.00',
    rewardType: 'voucher',
    perks: [
      'Standard earning rate (1.0x)',
      'Basic community support',
      'Daily check-in streak eligibility'
    ],
    badgeColor: '#cd7f32',
    iconType: 'Shield'
  },
  {
    level: 2,
    name: 'Bronze Specialist',
    tier: 'Bronze',
    minXp: 1000,
    maxXp: 2500,
    rewardTitle: '+5% Daily XP Multiplier',
    rewardValue: '1.05x Boost',
    rewardType: 'multiplier',
    perks: [
      '1.05x Multiplier on all game & task XP',
      'Access to weekly bonus missions',
      'Standard cash-out speed'
    ],
    badgeColor: '#b87333',
    iconType: 'ShieldAlert'
  },
  {
    level: 3,
    name: 'Silver Explorer',
    tier: 'Silver',
    minXp: 2500,
    maxXp: 4500,
    rewardTitle: '$10.00 VE Digital Voucher',
    rewardValue: '$10.00',
    rewardType: 'voucher',
    perks: [
      '1.10x Earning multiplier',
      'Early access to new mini-games',
      'Silver tier badge display on profile'
    ],
    badgeColor: '#94a3b8',
    iconType: 'Award'
  },
  {
    level: 4,
    name: 'Silver Vanguard',
    tier: 'Silver',
    minXp: 4500,
    maxXp: 7500,
    rewardTitle: 'Priority Payouts & Zero Fees',
    rewardValue: 'Zero Fee Pass',
    rewardType: 'benefit',
    perks: [
      '1.15x Earning multiplier',
      'Zero transfer fee waiver on first 5 monthly transactions',
      'Silver Vanguard community lounge access',
      'Bonus daily play in VE Coin Catch'
    ],
    badgeColor: '#cbd5e1',
    iconType: 'Crown'
  },
  {
    level: 5,
    name: 'Gold Ascendant',
    tier: 'Gold',
    minXp: 7500,
    maxXp: 11500,
    rewardTitle: '$25.00 VE Credit Voucher & 1.25x Multiplier',
    rewardValue: '$25.00 Voucher',
    rewardType: 'luxury_voucher',
    perks: [
      '1.25x Earning multiplier on all activities',
      '$25.00 VELOOP store & credit voucher',
      'Priority settlement queue (sub-minute processing)',
      'Gold status insignia across leaderboards',
      'VIP member-only seasonal drops'
    ],
    badgeColor: '#f59e0b',
    iconType: 'Zap'
  },
  {
    level: 6,
    name: 'Gold Strategist',
    tier: 'Gold',
    minXp: 11500,
    maxXp: 16500,
    rewardTitle: 'Custom Metal Debit Pass & 1.4x Multiplier',
    rewardValue: 'Metal Card Pass',
    rewardType: 'card',
    perks: [
      '1.40x Earning multiplier',
      'Custom laser-engraved metal card reservation',
      'Zero FX markup on international transactions',
      'Direct line to dedicated support agents'
    ],
    badgeColor: '#fbbf24',
    iconType: 'CreditCard'
  },
  {
    level: 7,
    name: 'Platinum Architect',
    tier: 'Platinum',
    minXp: 16500,
    maxXp: 23000,
    rewardTitle: '$50.00 Digital Reward Card & Airport Pass',
    rewardValue: '$50.00 Card',
    rewardType: 'luxury_voucher',
    perks: [
      '1.60x Earning multiplier',
      '$50.00 Credit Card balance injection',
      'Annual Global Lounge Key access pass',
      'Quarterly dividend bonus pool share'
    ],
    badgeColor: '#a78bfa',
    iconType: 'Compass'
  },
  {
    level: 8,
    name: 'Platinum Sovereign',
    tier: 'Platinum',
    minXp: 23000,
    maxXp: 31000,
    rewardTitle: '1.75x Multiplier & Dedicated Wealth Advisor',
    rewardValue: '1.75x Boost',
    rewardType: 'multiplier',
    perks: [
      '1.75x Earning multiplier',
      'Quarterly 1-on-1 portfolio consultation',
      'No cap on monthly referral bonus points',
      'Platinum verification crest'
    ],
    badgeColor: '#818cf8',
    iconType: 'Star'
  },
  {
    level: 9,
    name: 'Diamond Apex',
    tier: 'Diamond',
    minXp: 31000,
    maxXp: 42000,
    rewardTitle: '$100.00 VE Sovereign Vault Grant',
    rewardValue: '$100.00 Grant',
    rewardType: 'luxury_voucher',
    perks: [
      '1.90x Earning multiplier',
      '$100.00 Direct liquidity deposit',
      'Invitations to annual global fintech retreats',
      'Bespoke digital concierge service'
    ],
    badgeColor: '#38bdf8',
    iconType: 'Sparkles'
  },
  {
    level: 10,
    name: 'Obsidian Legend',
    tier: 'Obsidian',
    minXp: 42000,
    maxXp: 60000,
    rewardTitle: 'Lifetime 2.0x Boost & Founder Circle Access',
    rewardValue: 'Lifetime 2.0x',
    rewardType: 'founder',
    perks: [
      'Permanent 2.0x Earning multiplier for life',
      'Founder Circle voting rights on upcoming ecosystem features',
      'Custom hardware token device delivery',
      'Obsidian black titanium member status'
    ],
    badgeColor: '#6366f1',
    iconType: 'ShieldCheck'
  }
];

export const INITIAL_USER_XP = 5650; // Starting at Level 4 (Silver Vanguard, 4,500 - 7,500 XP)

export function getLevelForXp(xp) {
  for (let i = LEVEL_DATA.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_DATA[i].minXp) {
      return LEVEL_DATA[i];
    }
  }
  return LEVEL_DATA[0];
}

export function getNextLevel(currentLevel) {
  const nextIdx = LEVEL_DATA.findIndex(l => l.level === currentLevel.level) + 1;
  return nextIdx < LEVEL_DATA.length ? LEVEL_DATA[nextIdx] : null;
}

export function calculateProgress(xp, currentLevel, nextLevel) {
  if (!nextLevel) return 100;
  const range = nextLevel.minXp - currentLevel.minXp;
  if (range <= 0) return 100;
  const currentInRange = Math.max(0, xp - currentLevel.minXp);
  const percentage = Math.min(100, Math.floor((currentInRange / range) * 100));
  return percentage;
}

export function getRemainingXp(xp, nextLevel) {
  if (!nextLevel) return 0;
  return Math.max(0, nextLevel.minXp - xp);
}
