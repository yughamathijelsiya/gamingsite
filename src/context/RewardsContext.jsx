import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  LEVEL_DATA,
  INITIAL_USER_XP,
  getLevelForXp,
  getNextLevel,
  calculateProgress,
  getRemainingXp
} from '../data/levelData';
import {
  INITIAL_DAILY_TASKS,
  INITIAL_DAILY_CHALLENGE,
  INITIAL_STREAK_DATA,
  INITIAL_BONUS_MISSIONS,
  INITIAL_WATCH_AND_EARN
} from '../data/earningActivities';
import { INITIAL_ACTIVITY_LEDGER } from '../data/initialActivityLedger';
import { soundManager } from '../utils/audio';

const STORAGE_KEY = 'veloop_rewards_state_v1';

const RewardsContext = createContext(null);

export function RewardsProvider({ children }) {
  // Load saved state or default
  const [currentXp, setCurrentXp] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return typeof parsed.currentXp === 'number' ? parsed.currentXp : INITIAL_USER_XP;
      }
    } catch {
      // fallback
    }
    return INITIAL_USER_XP;
  });

  const [dailyTasks, setDailyTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyTasks) return parsed.dailyTasks;
      }
    } catch {}
    return INITIAL_DAILY_TASKS;
  });

  const [dailyChallenge, setDailyChallenge] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.dailyChallenge) return parsed.dailyChallenge;
      }
    } catch {}
    return INITIAL_DAILY_CHALLENGE;
  });

  const [streakData, setStreakData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.streakData) return parsed.streakData;
      }
    } catch {}
    return INITIAL_STREAK_DATA;
  });

  const [bonusMissions, setBonusMissions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.bonusMissions) return parsed.bonusMissions;
      }
    } catch {}
    return INITIAL_BONUS_MISSIONS;
  });

  const [watchAndEarn, setWatchAndEarn] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.watchAndEarn) return parsed.watchAndEarn;
      }
    } catch {}
    return INITIAL_WATCH_AND_EARN;
  });

  const [activityLedger, setActivityLedger] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.activityLedger) return parsed.activityLedger;
      }
    } catch {}
    return INITIAL_ACTIVITY_LEDGER;
  });

  const [gameStats, setGameStats] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.gameStats) return parsed.gameStats;
      }
    } catch {}
    return {
      dailyPlaysLeft: 3,
      highScore: 320,
      totalCoinsCaught: 84,
      lastPlayed: null
    };
  });

  // UI state
  const [isSoundMuted, setIsSoundMuted] = useState(() => soundManager.isMuted());
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(false);
  const [hasSimulatedError, setHasSimulatedError] = useState(false);
  const [selectedLevelForModal, setSelectedLevelForModal] = useState(null);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);
  const [levelUpDetails, setLevelUpDetails] = useState(null);

  // Derived level calculations
  const currentLevel = useMemo(() => getLevelForXp(currentXp), [currentXp]);
  const nextLevel = useMemo(() => getNextLevel(currentLevel), [currentLevel]);
  const progressPercent = useMemo(
    () => calculateProgress(currentXp, currentLevel, nextLevel),
    [currentXp, currentLevel, nextLevel]
  );
  const remainingXp = useMemo(
    () => getRemainingXp(currentXp, nextLevel),
    [currentXp, nextLevel]
  );

  // Save changes to localStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        currentXp,
        dailyTasks,
        dailyChallenge,
        streakData,
        bonusMissions,
        watchAndEarn,
        activityLedger,
        gameStats
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
  }, [
    currentXp,
    dailyTasks,
    dailyChallenge,
    streakData,
    bonusMissions,
    watchAndEarn,
    activityLedger,
    gameStats
  ]);

  // Audio mute sync
  const toggleSound = useCallback(() => {
    const newState = soundManager.toggleMute();
    setIsSoundMuted(newState);
  }, []);

  // Internal XP adder with level-up trigger
  const addXp = useCallback(
    (amount, title, category = 'Reward') => {
      soundManager.playClaimReward();

      setCurrentXp((prevXp) => {
        const oldLevel = getLevelForXp(prevXp);
        const newXp = prevXp + amount;
        const newLevel = getLevelForXp(newXp);

        // Check if level increased
        if (newLevel.level > oldLevel.level) {
          soundManager.playLevelUp();
          setLevelUpDetails({
            newLevel,
            oldLevel,
            reward: newLevel.rewardTitle,
            rewardValue: newLevel.rewardValue
          });
          setIsLevelUpModalOpen(true);
        }

        return newXp;
      });

      // Record activity in ledger
      const newEntry = {
        id: `act_${Date.now()}`,
        title,
        category,
        xpDelta: amount,
        timestamp: 'Just now',
        status: 'Verified',
        iconType: category === 'Game' ? 'Gamepad2' : category === 'Streak' ? 'Flame' : 'CheckCircle'
      };

      setActivityLedger((prev) => [newEntry, ...prev.slice(0, 19)]);
    },
    []
  );

  // Claim Daily Task
  const claimTask = useCallback(
    (taskId) => {
      const target = dailyTasks.find((t) => t.id === taskId);
      if (!target || target.isClaimed) return;

      setDailyTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, isCompleted: true, isClaimed: true } : t
        )
      );

      addXp(target.xpReward, target.title, 'Daily Task');
    },
    [dailyTasks, addXp]
  );

  // Claim Daily Challenge
  const claimDailyChallenge = useCallback(() => {
    if (dailyChallenge.isClaimed || !dailyChallenge.isUnlocked) return;

    setDailyChallenge((prev) => ({
      ...prev,
      isClaimed: true
    }));

    addXp(dailyChallenge.xpReward, dailyChallenge.title, 'Daily Challenge');
  }, [dailyChallenge, addXp]);

  // Claim Streak
  const claimTodayStreak = useCallback(() => {
    if (streakData.hasClaimedToday) return;

    const todayReward = streakData.days[streakData.todayDayIndex]?.xp || 100;

    setStreakData((prev) => {
      const updatedDays = prev.days.map((d, i) =>
        i === prev.todayDayIndex ? { ...d, status: 'completed' } : d
      );
      return {
        ...prev,
        hasClaimedToday: true,
        currentStreak: prev.currentStreak + 1,
        days: updatedDays
      };
    });

    addXp(todayReward, `Day ${streakData.currentStreak} Streak Bonus`, 'Streak');
  }, [streakData, addXp]);

  // Claim Watch & Earn
  const claimWatchAndEarn = useCallback(() => {
    if (watchAndEarn.isClaimed) return;

    setWatchAndEarn((prev) => ({
      ...prev,
      isCompleted: true,
      isClaimed: true
    }));

    addXp(watchAndEarn.xpReward, watchAndEarn.title, 'Education');
  }, [watchAndEarn, addXp]);

  // Claim Bonus Mission
  const claimBonusMission = useCallback(
    (missionId) => {
      const target = bonusMissions.find((m) => m.id === missionId);
      if (!target || target.status === 'Claimed') return;

      setBonusMissions((prev) =>
        prev.map((m) =>
          m.id === missionId ? { ...m, status: 'Claimed' } : m
        )
      );

      addXp(target.xpReward, target.title, 'Bonus Mission');
    },
    [bonusMissions, addXp]
  );

  // Record Mini-Game Result
  const recordGameResult = useCallback(
    (score, coinsCaught, xpEarned) => {
      setGameStats((prev) => ({
        ...prev,
        dailyPlaysLeft: Math.max(0, prev.dailyPlaysLeft - 1),
        highScore: Math.max(prev.highScore, score),
        totalCoinsCaught: prev.totalCoinsCaught + coinsCaught,
        lastPlayed: new Date().toISOString()
      }));

      // Check task 'task_play_minigame'
      setDailyTasks((prev) =>
        prev.map((t) =>
          t.id === 'task_play_minigame' ? { ...t, isCompleted: true } : t
        )
      );

      // Check high score challenge
      if (score >= dailyChallenge.targetScore && !dailyChallenge.isUnlocked) {
        setDailyChallenge((prev) => ({
          ...prev,
          isUnlocked: true
        }));
      }

      // Add earned game XP
      addXp(xpEarned, `VE Coin Catch (${score} pts)`, 'Game');
    },
    [dailyChallenge.targetScore, dailyChallenge.isUnlocked, addXp]
  );

  // Reset mini-game plays for testing
  const resetGamePlays = useCallback(() => {
    setGameStats((prev) => ({
      ...prev,
      dailyPlaysLeft: 3
    }));
  }, []);

  // Demo helpers
  const simulateLevelUp = useCallback(() => {
    const targetXp = nextLevel ? nextLevel.minXp : currentXp + 1000;
    const diff = targetXp - currentXp;
    addXp(Math.max(100, diff), 'Simulated Level Milestone', 'Milestone');
  }, [nextLevel, currentXp, addXp]);

  const resetDemoData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setCurrentXp(INITIAL_USER_XP);
    setDailyTasks(INITIAL_DAILY_TASKS);
    setDailyChallenge(INITIAL_DAILY_CHALLENGE);
    setStreakData(INITIAL_STREAK_DATA);
    setBonusMissions(INITIAL_BONUS_MISSIONS);
    setWatchAndEarn(INITIAL_WATCH_AND_EARN);
    setActivityLedger(INITIAL_ACTIVITY_LEDGER);
    setGameStats({
      dailyPlaysLeft: 3,
      highScore: 320,
      totalCoinsCaught: 84,
      lastPlayed: null
    });
    setHasSimulatedError(false);
    setIsLoadingSkeleton(false);
    soundManager.playClick();
  }, []);

  const openLevelModal = useCallback((level) => {
    setSelectedLevelForModal(level);
  }, []);

  const closeLevelModal = useCallback(() => {
    setSelectedLevelForModal(null);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setIsLevelUpModalOpen(false);
  }, []);

  const value = {
    // Progress
    currentXp,
    currentLevel,
    nextLevel,
    progressPercent,
    remainingXp,
    allLevels: LEVEL_DATA,
    addXp,

    // Tasks & Activities
    dailyTasks,
    claimTask,
    dailyChallenge,
    claimDailyChallenge,
    streakData,
    claimTodayStreak,
    bonusMissions,
    claimBonusMission,
    watchAndEarn,
    claimWatchAndEarn,

    // Mini-Game
    gameStats,
    recordGameResult,
    resetGamePlays,

    // Activity Feed
    activityLedger,

    // Modals
    selectedLevelForModal,
    openLevelModal,
    closeLevelModal,
    isLevelUpModalOpen,
    levelUpDetails,
    closeLevelUpModal,

    // Settings & Demo State
    isSoundMuted,
    toggleSound,
    isLoadingSkeleton,
    setIsLoadingSkeleton,
    hasSimulatedError,
    setHasSimulatedError,
    simulateLevelUp,
    resetDemoData
  };

  return (
    <RewardsContext.Provider value={value}>
      {children}
    </RewardsContext.Provider>
  );
}

export function useRewards() {
  const context = useContext(RewardsContext);
  if (!context) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}
