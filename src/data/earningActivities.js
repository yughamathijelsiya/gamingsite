// Earning Hub Activities Configuration
// Structured so it can easily synchronize with a backend endpoint

export const INITIAL_DAILY_TASKS = [
  {
    id: 'task_daily_login',
    title: 'Daily Member Check-In',
    description: 'Log in to your VELOOP dashboard and maintain active account standing.',
    xpReward: 50,
    category: 'Daily',
    isCompleted: false,
    isClaimed: false,
    icon: 'CalendarCheck',
    actionText: 'Claim Daily XP',
    supported: true
  },
  {
    id: 'task_play_minigame',
    title: 'Play VE Coin Catch',
    description: 'Participate in at least 1 session of the VE Coin Catch skill mini-game.',
    xpReward: 100,
    category: 'Gaming',
    isCompleted: false,
    isClaimed: false,
    icon: 'Gamepad2',
    actionText: 'Play Now',
    supported: true
  },
  {
    id: 'task_security_review',
    title: 'Security & 2FA Health Check',
    description: 'Verify your session encryption and biometric two-factor authentication.',
    xpReward: 120,
    category: 'Security',
    isCompleted: false,
    isClaimed: false,
    icon: 'ShieldCheck',
    actionText: 'Verify Security',
    supported: true
  },
  {
    id: 'task_weekly_briefing',
    title: 'Fintech Macro Briefing',
    description: 'Read the 2-minute market intelligence report on digital yield assets.',
    xpReward: 40,
    category: 'Education',
    isCompleted: false,
    isClaimed: false,
    icon: 'BookOpen',
    actionText: 'Read Briefing',
    supported: true
  }
];

export const INITIAL_DAILY_CHALLENGE = {
  id: 'challenge_high_score',
  title: 'Apex Catcher Challenge',
  description: 'Score 250+ points in a single session of VE Coin Catch.',
  targetScore: 250,
  xpReward: 200,
  isUnlocked: false,
  isClaimed: false,
  expiresInHours: 9,
  icon: 'Trophy'
};

export const INITIAL_STREAK_DATA = {
  currentStreak: 4,
  bestStreak: 12,
  hasClaimedToday: false,
  todayDayIndex: 3, // 0-indexed (Day 4)
  days: [
    { day: 'Day 1', xp: 25, status: 'completed' },
    { day: 'Day 2', xp: 40, status: 'completed' },
    { day: 'Day 3', xp: 60, status: 'completed' },
    { day: 'Day 4', xp: 100, status: 'available' }, // today
    { day: 'Day 5', xp: 125, status: 'locked' },
    { day: 'Day 6', xp: 160, status: 'locked' },
    { day: 'Day 7', xp: 250, status: 'locked', bonus: '2.0x Boost Day' }
  ]
};

export const INITIAL_BONUS_MISSIONS = [
  {
    id: 'mission_kyc',
    title: 'Identity Verification (Tier 1)',
    description: 'Submit proof of residence and identity document for fast-track compliance.',
    xpReward: 300,
    status: 'Ready',
    actionText: 'Complete Verification',
    supported: true
  },
  {
    id: 'mission_card_link',
    title: 'Link Primary Settlement Account',
    description: 'Connect your verified bank account or card for instant rewards redemption.',
    xpReward: 250,
    status: 'Ready',
    actionText: 'Link Account',
    supported: true
  },
  {
    id: 'mission_smart_vault',
    title: 'Smart Vault Yield Staking',
    description: 'Deposit digital collateral into audited smart vault smart contracts.',
    xpReward: 500,
    status: 'Coming Soon',
    actionText: 'Coming Soon',
    supported: false
  }
];

export const INITIAL_WATCH_AND_EARN = {
  id: 'watch_yield_video',
  title: 'Fintech Masterclass: Compounding Rewards',
  duration: '15s Interactive Module',
  xpReward: 75,
  isCompleted: false,
  isClaimed: false,
  description: 'Understand how VELOOP tier multipliers multiply your passive earnings and monthly vouchers.'
};
