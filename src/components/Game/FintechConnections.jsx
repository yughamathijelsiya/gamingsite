import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Play,
  Shuffle,
  CheckCircle2,
  AlertCircle,
  Repeat
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { soundManager } from '../../utils/audio';
import bannerImg from '../../assets/connections-banner.jpg';
import styles from './FintechConnections.module.css';

const CATEGORIES = [
  {
    id: 'tiers',
    title: 'VELOOP Member Tiers',
    colorClass: styles.catYellow,
    words: ['BRONZE', 'SILVER', 'GOLD', 'OBSIDIAN']
  },
  {
    id: 'crypto',
    title: 'Digital Currencies & Assets',
    colorClass: styles.catGreen,
    words: ['BITCOIN', 'ETHER', 'SOLANA', 'RIPPLE']
  },
  {
    id: 'security',
    title: 'Cyber Security Protocols',
    colorClass: styles.catBlue,
    words: ['BIOMETRIC', 'TWO-FACTOR', 'ENCRYPTION', 'PASSKEY']
  },
  {
    id: 'compounds',
    title: 'Fintech Yield Accelerators',
    colorClass: styles.catPurple,
    words: ['INTEREST', 'STREAK', 'MULTIPLIER', 'CASHBACK']
  }
];

function getAllShuffledWords() {
  const all = CATEGORIES.flatMap((c) => c.words);
  return all.sort(() => Math.random() - 0.5);
}

export default function FintechConnections({ onGoToConverter }) {
  const { recordGameResult } = useRewards();

  const [gameState, setGameState] = useState('instructions'); // 'instructions' | 'playing' | 'completed'
  const [solvedCategories, setSolvedCategories] = useState([]);
  const [remainingWords, setRemainingWords] = useState(getAllShuffledWords);
  const [selectedWords, setSelectedWords] = useState([]);
  const [mistakesLeft, setMistakesLeft] = useState(4);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [score, setScore] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);

  const startGame = () => {
    soundManager.playClick();
    setSolvedCategories([]);
    setRemainingWords(getAllShuffledWords());
    setSelectedWords([]);
    setMistakesLeft(4);
    setFeedbackMsg('');
    setScore(0);
    setHasClaimed(false);
    setGameState('playing');
  };

  const handleSelectWord = (word) => {
    soundManager.playClick();
    if (selectedWords.includes(word)) {
      setSelectedWords((prev) => prev.filter((w) => w !== word));
    } else {
      if (selectedWords.length < 4) {
        setSelectedWords((prev) => [...prev, word]);
      }
    }
  };

  const handleShuffle = () => {
    soundManager.playClick();
    setRemainingWords((prev) => [...prev].sort(() => Math.random() - 0.5));
  };

  const handleDeselectAll = () => {
    soundManager.playClick();
    setSelectedWords([]);
  };

  const handleSubmit = () => {
    if (selectedWords.length !== 4) return;

    // Check for exact category match
    const matchedCategory = CATEGORIES.find((cat) => {
      if (solvedCategories.some((sc) => sc.id === cat.id)) return false;
      return cat.words.every((w) => selectedWords.includes(w));
    });

    if (matchedCategory) {
      // Solved category!
      soundManager.playLevelUp();
      const updatedSolved = [...solvedCategories, matchedCategory];
      setSolvedCategories(updatedSolved);
      setRemainingWords((prev) => prev.filter((w) => !matchedCategory.words.includes(w)));
      setSelectedWords([]);
      const newScore = score + 150;
      setScore(newScore);

      if (updatedSolved.length === CATEGORIES.length) {
        setTimeout(() => setGameState('completed'), 600);
      }
      return;
    }

    // Check if "One away..." (3 out of 4)
    const isOneAway = CATEGORIES.some((cat) => {
      if (solvedCategories.some((sc) => sc.id === cat.id)) return false;
      const matchCount = cat.words.filter((w) => selectedWords.includes(w)).length;
      return matchCount === 3;
    });

    soundManager.playHazardHit();
    if (isOneAway) {
      setFeedbackMsg('One away... almost got it!');
    } else {
      setFeedbackMsg('Incorrect group. Try another association.');
    }
    setTimeout(() => setFeedbackMsg(''), 2500);

    const newMistakes = mistakesLeft - 1;
    setMistakesLeft(newMistakes);

    if (newMistakes <= 0) {
      // Reveal remaining and finish
      setTimeout(() => {
        setSolvedCategories(CATEGORIES);
        setRemainingWords([]);
        setGameState('completed');
      }, 700);
    }
  };

  const handleClaim = () => {
    if (hasClaimed) return;
    const finalScore = Math.max(score, 150);
    const xpEarned = Math.floor(finalScore * 0.25);
    recordGameResult(finalScore, Math.floor(finalScore / 25), xpEarned, 'Fintech Connections');
    setHasClaimed(true);
  };

  return (
    <div className={styles.gameContainer} aria-label="Fintech Connections Game">
      {/* Header */}
      <div className={styles.gameHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.gameIconBox}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className={styles.gameTitle}>Fintech Connections</h3>
            <p className={styles.gameSubtitle}>
              Find groups of 4 connected fintech words without making 4 mistakes!
            </p>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span>Solved: <strong>{solvedCategories.length}/4</strong></span>
          </div>
          <div className={styles.statPill}>
            <span>Points: <strong>{score} pts</strong></span>
          </div>
        </div>
      </div>

      {/* STATE 1: Instructions */}
      {gameState === 'instructions' && (
        <div className={styles.instructionsScreen}>
          <div className={styles.instructionsContent}>
            <div className={styles.tagline}>
              <Sparkles size={14} />
              <span>Deduction & Association Puzzle</span>
            </div>

            <h4 className={styles.headline}>
              Uncover 4 Hidden Fintech Categories
            </h4>

            <p className={styles.bodyText}>
              Inspired by classic association puzzles. Group the 16 digital wealth, blockchain, tier, and security terms into four sets of four items that share a common connection. Solve them with fewer than 4 mistakes to earn convertible reward points!
            </p>

            <button className={styles.playStartBtn} onClick={startGame}>
              <Play size={18} fill="#ffffff" />
              <span>Start Puzzle Session</span>
            </button>
          </div>

          <div className={styles.bannerImageWrapper}>
            <img src={bannerImg} alt="Fintech Connections Banner" className={styles.bannerImg} />
          </div>
        </div>
      )}

      {/* STATE 2: Playing Arena */}
      {gameState === 'playing' && (
        <div className={styles.arenaContainer}>
          {/* Solved Category Ribbons */}
          {solvedCategories.map((cat) => (
            <div key={cat.id} className={`${styles.solvedGroupCard} ${cat.colorClass}`}>
              <span className={styles.solvedCategoryTitle}>{cat.title}</span>
              <span className={styles.solvedCategoryWords}>{cat.words.join(', ')}</span>
            </div>
          ))}

          {/* Feedback Message Banner */}
          {feedbackMsg && (
            <div style={{
              background: 'rgba(248, 113, 113, 0.2)',
              border: '1px solid rgba(248, 113, 113, 0.5)',
              color: '#fca5a5',
              padding: '8px 16px',
              borderRadius: '9999px',
              fontSize: '0.82rem',
              fontWeight: 700
            }}>
              {feedbackMsg}
            </div>
          )}

          {/* Remaining Words Grid */}
          <div className={styles.wordsGrid}>
            {remainingWords.map((word) => {
              const isSelected = selectedWords.includes(word);
              return (
                <div
                  key={word}
                  className={`${styles.wordCard} ${isSelected ? styles.selectedCard : ''}`}
                  onClick={() => handleSelectWord(word)}
                >
                  {word}
                </div>
              );
            })}
          </div>

          {/* Mistakes Indicator */}
          <div className={styles.mistakesRow}>
            <span>Mistakes remaining:</span>
            {Array.from({ length: 4 }).map((_, idx) => (
              <span
                key={idx}
                className={styles.mistakeDot}
                style={{ opacity: idx < mistakesLeft ? 1 : 0.2 }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className={styles.actionsRow}>
            <button className={styles.actionBtn} onClick={handleShuffle}>
              <Shuffle size={14} style={{ display: 'inline', marginRight: '4px' }} />
              <span>Shuffle</span>
            </button>
            <button className={styles.actionBtn} onClick={handleDeselectAll} disabled={selectedWords.length === 0}>
              <span>Deselect All</span>
            </button>
            <button
              className={`${styles.actionBtn} ${styles.submitBtn}`}
              onClick={handleSubmit}
              disabled={selectedWords.length !== 4}
            >
              <span>Submit Guess ({selectedWords.length}/4)</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: Completion */}
      {gameState === 'completed' && (
        <div className={styles.completionScreen}>
          <div className={styles.completionTrophy}>
            <Trophy size={36} />
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              {mistakesLeft > 0 ? 'Brilliant Deduction!' : 'Puzzle Completed!'}
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              You solved the connections puzzle with <strong>{score} points</strong>.
            </p>
          </div>

          <div className={styles.pointsEarnedBox}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#38bdf8', fontWeight: 800 }}>
              Points Earned
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
              +{score || 250} Points
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className={styles.playStartBtn} onClick={handleClaim} disabled={hasClaimed}>
              <Sparkles size={16} />
              <span>{hasClaimed ? 'Points Deposited to Wallet!' : 'Deposit Points to Balance'}</span>
            </button>

            {onGoToConverter && (
              <button
                className={styles.playStartBtn}
                style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0f172a' }}
                onClick={() => {
                  handleClaim();
                  onGoToConverter();
                }}
              >
                <Repeat size={16} />
                <span>Exchange Points for Coins</span>
              </button>
            )}

            <button
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid var(--border-medium)',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.88rem',
                padding: '10px 20px',
                borderRadius: '8px'
              }}
              onClick={startGame}
            >
              <RotateCcw size={16} style={{ display: 'inline', marginRight: '6px' }} />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
