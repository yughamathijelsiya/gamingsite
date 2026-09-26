import React, { useState, useEffect, useCallback, useRef } from 'react';
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

  // Animation States
  const [swappingState, setSwappingState] = useState(null); // { a: {r, c, dir}, b: {r, c, dir}, isInvalid: bool }
  const [poppingTiles, setPoppingTiles] = useState(new Set());
  const [droppingTiles, setDroppingTiles] = useState(new Set());
  const [comboToast, setComboToast] = useState('');
  const [isLocked, setIsLocked] = useState(false);

  const startGame = () => {
    soundManager.playClick();
    setBoard(createInitialBoard());
    setSelectedTile(null);
    setSwappingState(null);
    setPoppingTiles(new Set());
    setDroppingTiles(new Set());
    setComboToast('');
    setIsLocked(false);
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
    const droppedKeys = new Set();

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
          if (emptyRow !== r) {
            droppedKeys.add(`${emptyRow}-${c}`);
          }
          emptyRow--;
        }
      }
      // Fill remaining empty spots at top
      for (let r = emptyRow; r >= 0; r--) {
        newBoard[r][c] = TOKEN_TYPES[Math.floor(Math.random() * TOKEN_TYPES.length)];
        droppedKeys.add(`${r}-${c}`);
      }
    }

    return { newBoard, clearedCount, droppedKeys };
  }, []);

  // Handle Tile Click & Trigger Tactile Swap Animation
  const handleTileClick = (r, c) => {
    if (gameState !== 'playing' || movesLeft <= 0 || isLocked) return;

    if (!selectedTile) {
      soundManager.playClick();
      setSelectedTile({ r, c });
      return;
    }

    // Clicking the same tile deselects
    if (selectedTile.r === r && selectedTile.c === c) {
      soundManager.playClick();
      setSelectedTile(null);
      return;
    }

    // Check if clicked tile is adjacent
    const dr = r - selectedTile.r;
    const dc = c - selectedTile.c;
    const isAdjacent = Math.abs(dr) + Math.abs(dc) === 1;

    if (!isAdjacent) {
      // Re-select newly clicked tile
      soundManager.playClick();
      setSelectedTile({ r, c });
      return;
    }

    // Compute visual sliding direction
    let dirA = 'right';
    let dirB = 'left';
    if (dc === 1) {
      dirA = 'right';
      dirB = 'left';
    } else if (dc === -1) {
      dirA = 'left';
      dirB = 'right';
    } else if (dr === 1) {
      dirA = 'down';
      dirB = 'up';
    } else if (dr === -1) {
      dirA = 'up';
      dirB = 'down';
    }

    const tileA = { r: selectedTile.r, c: selectedTile.c, dir: dirA };
    const tileB = { r, c, dir: dirB };

    // Lock board and trigger smooth slide animation
    setIsLocked(true);
    setSelectedTile(null);
    setSwappingState({ a: tileA, b: tileB, isInvalid: false });
    soundManager.playSlideSound();

    // After slide transition (220ms), check matches
    setTimeout(() => {
      // Perform logical swap
      const swapped = board.map((row) => [...row]);
      const temp = swapped[tileA.r][tileA.c];
      swapped[tileA.r][tileA.c] = swapped[tileB.r][tileB.c];
      swapped[tileB.r][tileB.c] = temp;

      const { matched, matchFound } = findMatches(swapped);

      if (!matchFound) {
        // INVALID SWAP: Revert animation
        soundManager.playHazardHit();
        setSwappingState({ a: tileA, b: tileB, isInvalid: true });

        setTimeout(() => {
          setSwappingState(null);
          setIsLocked(false);
        }, 260);
        return;
      }

      // VALID MATCH! Clear swapping state and update board
      setSwappingState(null);
      setBoard(swapped);

      // Collect matched keys for explode pop animation
      const matchedKeys = new Set();
      for (let ri = 0; ri < ROWS; ri++) {
        for (let ci = 0; ci < COLS; ci++) {
          if (matched[ri][ci]) matchedKeys.add(`${ri}-${ci}`);
        }
      }

      setPoppingTiles(matchedKeys);
      soundManager.playCoinCatch();

      // Wait for explode pop (260ms) before gravity drop
      setTimeout(() => {
        let currentBoard = swapped;
        let currentMatches = matched;
        let totalCleared = 0;
        let cascadeCount = 0;

        // Execute cascades
        const processCascades = (b, m) => {
          const { newBoard, clearedCount, droppedKeys } = applyGravity(b, m);
          totalCleared += clearedCount;
          cascadeCount++;

          setBoard(newBoard);
          setDroppingTiles(droppedKeys);
          setPoppingTiles(new Set());

          if (cascadeCount > 1) {
            soundManager.playSpecialOrb();
            setCombos((prev) => prev + 1);
            setComboToast(cascadeCount === 2 ? '⚡ SWEET COMBO!' : '🔥 MEGA CRUSH!');
            setTimeout(() => setComboToast(''), 1500);
          }

          // Check for next cascade
          const next = findMatches(newBoard);
          if (next.matchFound && cascadeCount < 5) {
            const nextKeys = new Set();
            for (let ri = 0; ri < ROWS; ri++) {
              for (let ci = 0; ci < COLS; ci++) {
                if (next.matched[ri][ci]) nextKeys.add(`${ri}-${ci}`);
              }
            }
            setTimeout(() => {
              setPoppingTiles(nextKeys);
              soundManager.playCoinCatch();
              setTimeout(() => {
                processCascades(newBoard, next.matched);
              }, 260);
            }, 280);
          } else {
            // Cascade sequence finished
            const earnedPoints = totalCleared * 20 * Math.max(1, cascadeCount);
            setScore((prev) => prev + earnedPoints);
            const remainingMoves = movesLeft - 1;
            setMovesLeft(remainingMoves);

            setTimeout(() => {
              setDroppingTiles(new Set());
              setIsLocked(false);

              if (remainingMoves <= 0) {
                setGameState('completed');
                soundManager.playLevelUp();
              }
            }, 300);
          }
        };

        processCascades(currentBoard, currentMatches);
      }, 260);
    }, 220);
  };

  const handleClaim = () => {
    if (hasClaimed) return;
    const xpEarned = Math.floor(score * 0.25);
    recordGameResult(score, Math.floor(score / 20), xpEarned, 'Crypto Crush Match-3');
    setHasClaimed(true);
  };

  // Helper to determine active animation class for a tile
  const getTileAnimClass = (r, c) => {
    const key = `${r}-${c}`;

    if (poppingTiles.has(key)) {
      return styles.poppingTile;
    }
    if (droppingTiles.has(key)) {
      return styles.droppingTile;
    }

    if (swappingState) {
      const { a, b, isInvalid } = swappingState;
      if (isInvalid) {
        if ((a.r === r && a.c === c) || (b.r === r && b.c === c)) {
          return styles.invalidWobble;
        }
      }

      if (a.r === r && a.c === c) {
        if (a.dir === 'right') return styles.swappingToRight;
        if (a.dir === 'left') return styles.swappingToLeft;
        if (a.dir === 'down') return styles.swappingToDown;
        if (a.dir === 'up') return styles.swappingToUp;
      }
      if (b.r === r && b.c === c) {
        if (b.dir === 'right') return styles.swappingToRight;
        if (b.dir === 'left') return styles.swappingToLeft;
        if (b.dir === 'down') return styles.swappingToDown;
        if (b.dir === 'up') return styles.swappingToUp;
      }
    }

    return '';
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
          {/* Combo Toast Alert */}
          {comboToast && (
            <div className={styles.comboToast}>
              {comboToast}
            </div>
          )}

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
                const animClass = getTileAnimClass(r, c);

                return (
                  <button
                    key={`${r}-${c}`}
                    className={`${styles.tile} ${TOKEN_CLASSES[token]} ${
                      isSelected ? styles.selectedTile : ''
                    } ${animClass}`}
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
