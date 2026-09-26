import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Trophy,
  RotateCcw,
  Play,
  Repeat,
  Zap,
  Target
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { soundManager } from '../../utils/audio';
import bannerImg from '../../assets/crypto-crush-banner.jpg';
import styles from './CryptoCrush.module.css';

const ROWS = 7;
const COLS = 7;
const TOKEN_TYPES = ['gold', 'sapphire', 'ruby', 'amethyst', 'emerald'];

const TOKEN_ICONS = {
  gold: '🪙',
  sapphire: '💎',
  ruby: '♦️',
  amethyst: '🔮',
  emerald: '❇️'
};

const TOKEN_CLASSES = {
  gold: styles.tileGold,
  sapphire: styles.tileSapphire,
  ruby: styles.tileRuby,
  amethyst: styles.tileAmethyst,
  emerald: styles.tileEmerald
};

function createInitialBoard() {
  const board = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      let type;
      do {
        type = TOKEN_TYPES[Math.floor(Math.random() * TOKEN_TYPES.length)];
      } while (
        (c >= 2 && row[c - 1] === type && row[c - 2] === type) ||
        (r >= 2 && board[r - 1][c] === type && board[r - 2][c] === type)
      );
      row.push(type);
    }
    board.push(row);
  }
  return board;
}

export default function CryptoCrush({ onGoToConverter }) {
  const { recordGameResult } = useRewards();

  const [gameState, setGameState] = useState('instructions'); // 'instructions' | 'playing' | 'completed'
  const [board, setBoard] = useState(createInitialBoard);
  const [selectedTile, setSelectedTile] = useState(null); // { r, c }
  const [movesLeft, setMovesLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [combos, setCombos] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);

  const startGame = () => {
    soundManager.playClick();
    setBoard(createInitialBoard());
    setSelectedTile(null);
    setMovesLeft(15);
    setScore(0);
    setCombos(0);
    setHasClaimed(false);
    setGameState('playing');
  };

  // Find all matches on the board
  const findMatches = useCallback((b) => {
    const matched = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    let matchFound = false;

    // Horizontal check
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 2; c++) {
        const type = b[r][c];
        if (type && type === b[r][c + 1] && type === b[r][c + 2]) {
          matched[r][c] = true;
          matched[r][c + 1] = true;
          matched[r][c + 2] = true;
          matchFound = true;
        }
      }
    }

    // Vertical check
    for (let c = 0; c < COLS; c++) {
      for (let r = 0; r < ROWS - 2; r++) {
        const type = b[r][c];
        if (type && type === b[r + 1][c] && type === b[r + 2][c]) {
          matched[r][c] = true;
          matched[r + 1][c] = true;
          matched[r + 2][c] = true;
          matchFound = true;
        }
      }
    }

    return { matched, matchFound };
  }, []);

  // Drop tiles down (gravity) and fill top with new random tokens
  const applyGravity = useCallback((b, matched) => {
    let clearedCount = 0;
    const newBoard = b.map((row) => [...row]);

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (matched[r][c]) {
          newBoard[r][c] = null;
          clearedCount++;
        }
      }
    }

    // Shift down
    for (let c = 0; c < COLS; c++) {
      let emptyRow = ROWS - 1;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (newBoard[r][c] !== null) {
          const val = newBoard[r][c];
          newBoard[r][c] = null;
          newBoard[emptyRow][c] = val;
          emptyRow--;
        }
      }
      // Fill remaining empty spots at top
      for (let r = emptyRow; r >= 0; r--) {
        newBoard[r][c] = TOKEN_TYPES[Math.floor(Math.random() * TOKEN_TYPES.length)];
      }
    }

    return { newBoard, clearedCount };
  }, []);

  // Handle Tile Click
  const handleTileClick = (r, c) => {
    if (gameState !== 'playing' || movesLeft <= 0) return;

    if (!selectedTile) {
      soundManager.playClick();
      setSelectedTile({ r, c });
      return;
    }

    // Check if clicked tile is adjacent
    const dr = Math.abs(selectedTile.r - r);
    const dc = Math.abs(selectedTile.c - c);
    const isAdjacent = (dr === 1 && dc === 0) || (dr === 0 && dc === 1);

    if (!isAdjacent) {
      // Re-select new tile
      soundManager.playClick();
      setSelectedTile({ r, c });
      return;
    }

    // Swap tiles
    const swapped = board.map((row) => [...row]);
    const temp = swapped[selectedTile.r][selectedTile.c];
    swapped[selectedTile.r][selectedTile.c] = swapped[r][c];
    swapped[r][c] = temp;

    // Check if swap produces a match
    const { matched, matchFound } = findMatches(swapped);

    if (!matchFound) {
      // Invalid swap - shake/no-op
      soundManager.playClick();
      setSelectedTile(null);
      return;
    }

    // Valid Match! Deduct a move
    setSelectedTile(null);
    soundManager.playCoinCatch();

    // Process cascade
    let currentBoard = swapped;
    let currentMatches = matched;
    let totalCleared = 0;
    let cascadeStreak = 0;

    while (true) {
      const { newBoard, clearedCount } = applyGravity(currentBoard, currentMatches);
      totalCleared += clearedCount;
      cascadeStreak++;

      // Check next cascade
      const next = findMatches(newBoard);
      if (!next.matchFound || cascadeStreak > 5) {
        currentBoard = newBoard;
        break;
      }
      currentBoard = newBoard;
      currentMatches = next.matched;
    }

    const earnedPoints = totalCleared * 15 * cascadeStreak;
    if (cascadeStreak > 1) {
      soundManager.playSpecialOrb();
      setCombos((prev) => prev + 1);
    }

    setBoard(currentBoard);
    setScore((prev) => prev + earnedPoints);
    const remainingMoves = movesLeft - 1;
    setMovesLeft(remainingMoves);

    if (remainingMoves <= 0) {
      setTimeout(() => {
        setGameState('completed');
        soundManager.playLevelUp();
      }, 500);
    }
  };

  const handleClaim = () => {
    if (hasClaimed) return;
    const xpEarned = Math.floor(score * 0.25);
    recordGameResult(score, Math.floor(score / 20), xpEarned, 'Crypto Crush Match-3');
    setHasClaimed(true);
  };

  return (
    <div className={styles.gameContainer} aria-label="Crypto Crush Match-3 Game">
      {/* Header */}
      <div className={styles.gameHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.gameIconBox}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className={styles.gameTitle}>Crypto Crush: Match-3</h3>
            <p className={styles.gameSubtitle}>
              Swap tokens, trigger chain explosions, and earn convertible points!
            </p>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <Target size={14} color="#38bdf8" />
            <span>Target: <strong>600 pts</strong></span>
          </div>
          <div className={styles.statPill}>
            <Zap size={14} color="#fbbf24" />
            <span>Moves: <strong>{movesLeft}</strong></span>
          </div>
        </div>
      </div>

      {/* STATE 1: Instructions Screen */}
      {gameState === 'instructions' && (
        <div className={styles.instructionsScreen}>
          <div className={styles.instructionsContent}>
            <div className={styles.tagline}>
              <Sparkles size={14} />
              <span>Token Puzzle Arcade</span>
            </div>

            <h4 className={styles.headline}>
              Align 3+ Tokens To Trigger Cascading Blasts
            </h4>

            <p className={styles.bodyText}>
              Swap adjacent crypto tokens to create rows or columns of 3, 4, or 5 matching gems. Form chain combos to multiply your score within 15 tactical moves. Points convert directly into <strong>VE Coins & XP</strong>!
            </p>

            <div className={styles.rulesGrid}>
              <div className={styles.ruleCard}>
                <span className={styles.ruleLabel}>Move Limit</span>
                <span className={styles.ruleValue}>15 Turns</span>
              </div>
              <div className={styles.ruleCard}>
                <span className={styles.ruleLabel}>Combo Bonus</span>
                <span className={styles.ruleValue}>Up to 3.0x Multiplier</span>
              </div>
              <div className={styles.ruleCard}>
                <span className={styles.ruleLabel}>Goal Target</span>
                <span className={styles.ruleValue}>600 Points</span>
              </div>
            </div>

            <div>
              <button className={styles.playStartBtn} onClick={startGame}>
                <Play size={18} fill="#0f172a" />
                <span>Start Match-3 Session</span>
              </button>
            </div>
          </div>

          <div className={styles.bannerImageWrapper}>
            <img src={bannerImg} alt="Crypto Crush Artwork" className={styles.bannerImg} />
          </div>
        </div>
      )}

      {/* STATE 2: Playing Board */}
      {gameState === 'playing' && (
        <div className={styles.arenaContainer}>
          {/* HUD */}
          <div className={styles.gameHud}>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Moves Remaining</span>
              <span className={styles.hudValue} style={{ color: movesLeft <= 3 ? '#f87171' : '#38bdf8' }}>
                {movesLeft}
              </span>
            </div>

            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Current Score</span>
              <span className={styles.hudValue} style={{ color: '#fbbf24' }}>
                {score} pts
              </span>
            </div>

            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Combo Chains</span>
              <span className={styles.hudValue} style={{ color: '#a78bfa' }}>
                {combos}x
              </span>
            </div>
          </div>

          {/* 7x7 Grid */}
          <div className={styles.boardWrapper}>
            {board.map((row, r) =>
              row.map((token, c) => {
                const isSelected = selectedTile?.r === r && selectedTile?.c === c;
                return (
                  <button
                    key={`${r}-${c}`}
                    className={`${styles.tile} ${TOKEN_CLASSES[token]} ${
                      isSelected ? styles.selectedTile : ''
                    }`}
                    onClick={() => handleTileClick(r, c)}
                    aria-label={`Row ${r + 1}, Column ${c + 1}: ${token}`}
                  >
                    <span>{TOKEN_ICONS[token]}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* STATE 3: Completed Screen */}
      {gameState === 'completed' && (
        <div className={styles.completionScreen}>
          <div className={styles.completionTrophy}>
            <Trophy size={36} />
          </div>

          <div>
            <h4 className={styles.completionTitle}>Session Finished!</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              {score >= 600 ? '🎉 Victory! Target goal reached!' : 'Well played! Points tallied below.'}
            </p>
          </div>

          <div className={styles.pointsEarnedBox}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 800 }}>
              Points Earned
            </span>
            <span className={styles.pointsNumber}>+{score} Points</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Convert these points in the <strong>Points Converter</strong> to claim <strong>+{Math.floor(score * 0.1)} VE Coins</strong> and <strong>+{Math.floor(score * 0.25)} XP</strong>!
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
                style={{ background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#ffffff' }}
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
