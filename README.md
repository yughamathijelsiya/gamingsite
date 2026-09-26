# VELOOP Rewards Level-Up Dashboard

A state-of-the-art, production-quality **Fintech Rewards & Level-Up Ecosystem** built with **React 19**, **Vite**, **Bootstrap Grid**, and **CSS Modules**. Designed with a deep navy palette (`#161827`), refined gold and silver reward accents, restrained animations, and a mandatory skill-based mini-game: **VE Coin Catch**.

---

## 🌟 Executive Overview

The **VELOOP Rewards Level-Up Dashboard** redefines tier progression for digital financial platforms. Unlike traditional gamified apps that lean on casino aesthetics or excessive flashing effects, VELOOP applies modern fintech sophistication:
- **Controlled Luxury Aesthetic**: Deep navy surfaces (`#1a1e32`, `#1f243d`), subtle ambient lighting, metallic tier badges, and high-fidelity reward voucher artwork.
- **Dynamic XP Calculations**: Real-time progress bar animations, tier thresholds, remaining XP meters, and active multiplier boosts.
- **Next-Level Incentive**: High-impact locked reward card showcasing the Level 5 **$25.00 Credit Voucher & 1.25x Multiplier** with unlock criteria and terms.
- **Interactive Roadmap**: 10-tier visual timeline spanning Bronze to Obsidian tiers with detailed privilege inspection modals.
- **VE Coin Catch Mini-Game**: Genuinely playable 60 FPS HTML5 canvas arcade game awarding skill-based XP directly into the live dashboard balance.
- **Earning Hub**: Seven interactive avenues to compound XP, including daily check-ins, a 7-day streak calendar, high-score challenges, educational watch modules, referral links, and bonus missions.
- **Level-Up Celebration**: Prestigious milestone celebration modal with restrained confetti bursts and audio fanfare.
- **Developer & Reviewer Suite**: Docked demo controls allowing instant +XP injection, level-up simulation, skeleton shimmer testing, error state recovery, and audio mute toggles.

---

## 💎 Level System & Tier Brackets

VELOOP features a 10-tier progression architecture where each tier unlocks tangible financial utility, fee waivers, multiplier boosts, and luxury rewards:

| Level | Title | Tier | Min XP | Max XP | Milestone Reward | Key Privileges |
|:---:|:---|:---:|:---:|:---:|:---|:---|
| **1** | **Bronze Initiate** | Bronze | 0 | 1,000 | $5.00 Welcome Voucher | 1.00x Base rate, standard support |
| **2** | **Bronze Specialist** | Bronze | 1,000 | 2,500 | +5% Daily XP Multiplier | 1.05x Multiplier, weekly bonus access |
| **3** | **Silver Explorer** | Silver | 2,500 | 4,500 | $10.00 Digital Voucher | 1.10x Multiplier, early game access |
| **4** | **Silver Vanguard** *(Current)* | Silver | 4,500 | 7,500 | Priority Payouts & Zero Fees | 1.15x Boost, zero transfer fees, bonus daily game |
| **5** | **Gold Ascendant** *(Next Target)* | Gold | 7,500 | 11,500 | $25.00 Voucher & 1.25x Boost | Sub-minute settlement, VIP seasonal drops |
| **6** | **Gold Strategist** | Gold | 11,500 | 16,500 | Custom Metal Debit Pass | 1.40x Boost, zero FX international markup |
| **7** | **Platinum Architect** | Platinum | 16,500 | 23,000 | $50.00 Digital Card & Lounge Pass | 1.60x Boost, Global Lounge Key pass |
| **8** | **Platinum Sovereign** | Platinum | 23,000 | 31,000 | 1.75x Boost & Wealth Advisor | Dedicated 1-on-1 portfolio manager |
| **9** | **Diamond Apex** | Diamond | 31,000 | 42,000 | $100.00 Sovereign Vault Grant | 1.90x Boost, global fintech retreats |
| **10** | **Obsidian Legend** | Obsidian | 42,000 | 60,000 | Lifetime 2.0x Boost & Founder Circle | Lifetime 2.0x boost, governance rights |

---

## ⚡ XP Engine & Mathematical Model

The user starts at **5,650 XP** in Level 4 (Silver Vanguard):
- **Current Tier Threshold**: 4,500 XP
- **Next Tier Threshold**: 7,500 XP
- **XP Span**: $7,500 - 4,500 = 3,000 \text{ XP}$
- **Current Progress in Tier**: $5,650 - 4,500 = 1,150 \text{ XP}$
- **Dynamic Percentage**: $\lfloor (1,150 / 3,000) \times 100 \rfloor = 38\%$
- **Remaining XP to Unlock Level 5**: $7,500 - 5,650 = 1,850 \text{ XP}$

Whenever new XP is earned from the **VE Coin Catch** mini-game or **Earning Hub**, the progress bar animates, metrics update reactively, and if the XP crosses 7,500 XP, the **Level-Up Celebration Modal** triggers immediately!

---

## 🎮 VE Coin Catch Mini-Game

**VE Coin Catch** is a custom 60 FPS HTML5 canvas arcade game built strictly on skill mechanics (no casino, betting, or RNG wagering).

### Game Rules & Mechanics
- **Objective**: Intercept falling digital assets with your obsidian collector dock before they fall off the screen.
- **Session Duration**: 30 seconds.
- **Controls**:
  - `←` / `→` arrow keys or `A` / `D` keys on desktop
  - Mouse / Cursor dragging over the canvas
  - Full touch drag and dedicated on-screen mobile buttons
  - `P` or `Esc` to pause/resume
- **Asset Types & Points**:
  - 🟡 **VE Gold Coin**: `+10 pts` (Standard asset)
  - 💎 **Sapphire Orb**: `+25 pts` (Rare asset with custom chime)
  - ⭐️ **Diamond Star**: `+50 pts` (Luxury asset with sparkling trail)
  - 🛑 **Hazard Glitch Node**: `-15 pts` (Breaks streak combo)
- **Streak Combo Multipliers**:
  - 3+ consecutive catches: `1.2x score multiplier`
  - 6+ consecutive catches: `1.5x score multiplier`
  - 10+ consecutive catches: `2.0x score multiplier`
- **Reward Tiers**:
  - `0 - 100 pts`: Bronze Tier (+50 XP)
  - `101 - 250 pts`: Silver Tier (+100 XP)
  - `251 - 400 pts`: Gold Tier (+175 XP)
  - `400+ pts`: Apex Tier (+250 XP)
- **Live XP Injection**: Clicking **"Claim & Add to Dashboard XP"** instantly deposits the points into the live state and appends a verified transaction to the XP Activity Ledger!

---

## 💼 Earning Hub: 7 Accelerators

1. **Daily Login Streak**: 7-day visual calendar tracker. Users can claim their active Day 4 bonus (`+100 XP`).
2. **Daily Member Check-In**: Quick 1-click active session confirmation (`+50 XP`).
3. **Play & Earn (VE Coin Catch)**: Direct link to launch gameplay sessions with 3 daily energy charges.
4. **Daily Challenge (Apex Catcher)**: Score 250+ points in a single session of VE Coin Catch to unlock an extra `+200 XP`.
5. **Watch & Earn**: Interactive 15-second animated fintech module exploring tier multipliers with claimable `+75 XP`.
6. **Refer & Earn**: Unique referral link generator (`VELOOP-VIP-7842`) with clipboard copy toast and milestone tracking (`+250 XP` per referral).
7. **Bonus Missions**: One-time KYC Identity Verification (Tier 1) and Biometric 2FA verification (`+550 XP` potential).

---

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/) (Configured at `/Lvl-Dashboard` with history fallbacks)
- **Styling**: Vanilla CSS Modules (`*.module.css`) + Bootstrap 5 Grid/utilities
- **Icons**: [Lucide React](https://lucide.dev/)
- **Audio**: Custom Synthesizer using the browser **Web Audio API** (Zero external MP3 dependencies, instant latency, global mute persistence)
- **Celebration Effects**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti) (Tuned to fintech palette: gold, silver, soft blue)
- **State Management**: React Context (`RewardsContext`) with `localStorage` persistence

---

## 📂 Project Architecture

```
gamingsite/
├── public/
│   ├── _redirects                     # Netlify SPA redirect
│   └── favicon.svg                    # Vector brand mark
├── src/
│   ├── assets/
│   │   ├── level-crest.jpg            # 3D Gold & Obsidian tier crest
│   │   ├── reward-card.jpg            # Luxury titanium membership card
│   │   └── ve-coin-catch-banner.jpg   # VE Coin Catch artwork banner
│   ├── components/
│   │   ├── DemoToolbar/               # Developer & Reviewer testing panel
│   │   ├── EarningHub/                # Daily tasks, streak, watch & refer modals
│   │   ├── ErrorState/                # Friendly network retry component
│   │   ├── Game/                      # VE Coin Catch 60fps canvas engine
│   │   ├── LevelDetailModal/          # Level inspection popup drawer
│   │   ├── LevelHero/                 # Level 4 Hero with animated XP track
│   │   ├── LevelRoadmap/              # 10-tier interactive progression scroller
│   │   ├── LevelUpModal/              # Milestone celebration dialog
│   │   ├── Navbar/                    # Sticky fintech header & mute toggle
│   │   ├── NextRewardCard/            # Level 5 VIP voucher showcase
│   │   ├── SkeletonLoader/            # Shimmer loading screens
│   │   ├── Tooltip/                   # Accessible helper tooltip
│   │   └── XPActivityFeed/            # Filterable transaction ledger
│   ├── context/
│   │   └── RewardsContext.jsx         # Unified application state
│   ├── data/
│   │   ├── earningActivities.js       # Config for tasks, streak & missions
│   │   ├── initialActivityLedger.js   # Seed ledger records
│   │   └── levelData.js               # 10 tiers, perks & math models
│   ├── pages/
│   │   ├── LevelDashboard.jsx         # Master dashboard page
│   │   └── LevelDashboard.module.css  # Layout & responsive styles
│   ├── utils/
│   │   └── audio.js                   # Web Audio API acoustic synthesizer
│   ├── App.jsx                        # React Router configuration
│   ├── index.css                      # Global tokens, resets & fonts
│   └── main.jsx                       # Application entry point
├── vercel.json                        # Vercel SPA routing rewrite
├── vite.config.js                     # Vite build configuration
├── package.json                       # Dependencies & scripts
└── README.md                          # Comprehensive documentation
```

---

## 🚀 Installation & Local Execution

### Prerequisites
- Node.js `v18.0.0` or higher
- npm `v9.0.0` or higher

### Steps
```bash
# 1. Clone or open the repository
cd gamingsite

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open `http://localhost:5173/Lvl-Dashboard` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

---

## 📱 Responsive Design Matrix

The dashboard is built mobile-first and intentionally styled for every viewport width:
- **Mobile (320px - 480px)**: Compact Level Hero, single-column metrics, touch-friendly on-screen game buttons, wrapped navigation actions, no horizontal scroll.
- **Tablet (768px - 1024px)**: 2-column metrics cards, 2-column Earning Hub grid, touch scrollable Roadmap timeline.
- **Laptop (1280px)**: 4-column metrics bar, 3-column Earning Hub, dual-column Next Reward card with perspective 3D tilt.
- **Desktop & Ultrawide (1440px - 1920px+)**: Centered container with max-width boundaries, high-fidelity ambient lighting effects, smooth 60 FPS canvas rendering.

---

## 🧪 Testing Checklist & Edge Case Verification

1. **XP Dynamic Engine**: Click `+250 XP` or `+750 XP` in the bottom-right Demo Toolbar to watch the progress bar animate and remaining XP recalculate.
2. **Level-Up Celebration**: Click `Trigger Level-Up` in the Demo Toolbar. Verify the fanfare sound plays, subtle gold/blue confetti bursts, and the Level 5 Gold Ascendant celebration modal opens.
3. **VE Coin Catch**: Scroll to the game section, click `Start 30s Session`, catch coins using arrow keys or mouse/touch, and click `Claim & Add to Dashboard XP` upon completion.
4. **Tier Roadmap Inspection**: Click any level node (Level 1 through Level 10) in the roadmap to view its detailed perks, milestone rewards, and unlock criteria.
5. **Loading Skeletons**: Click `Test Skeletons` in the Demo Toolbar to inspect all shimmer states.
6. **Error Recovery**: Click `Test Error State` in the Demo Toolbar, then click `Retry Connection` to confirm graceful recovery without raw errors.
7. **Audio FX**: Toggle the speaker icon in the Navbar to test synthesized coin chimes and mute state persistence across reloads.
8. **State Reset**: Click `Reset State` in the Demo Toolbar to return to the initial starting benchmark (Level 4, 5,650 XP).

---

## 🌐 Deployment to Vercel & Netlify

### Vercel Deployment
The repository includes `vercel.json` configured with:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
Direct access to `/Lvl-Dashboard` resolves cleanly without 404 errors.

### Netlify Deployment
The `public/_redirects` file contains:
```
/*    /index.html   200
```
This ensures standard HTML5 pushState routing for all URLs.

---

## 🛡️ Compliance & Disclaimer

*VELOOP Rewards is a simulated fintech gamification interface. All XP values, tier multipliers, credit vouchers, and rewards are demonstrative prototype values. The VE Coin Catch mini-game is 100% skill-based; it contains zero gambling, betting, wagering, casino mechanics, or real monetary payouts.*

---

**Author**: Antigravity AI Engineering Team  
**License**: MIT  
**Release**: VELOOP Rewards Dashboard v1.0.0 (Production Quality)
