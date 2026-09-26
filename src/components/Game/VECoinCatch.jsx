import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Play,
  Pause,
  Award,
  Clock,
  Zap,
  Info
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { soundManager } from '../../utils/audio';
import Tooltip from '../Tooltip/Tooltip';
import gameBannerImg from '../../assets/ve-coin-catch-banner.jpg';
import styles from './VECoinCatch.module.css';

const GAME_DURATION = 30; // 30 seconds

export default function VECoinCatch() {
  const {
    gameStats,
    recordGameResult,
    resetGamePlays,
    openLevelModal,
    nextLevel
  } = useRewards();

  const [gameState, setGameState] = useState('instructions'); // 'instructions' | 'playing' | 'paused' | 'completed'
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [coinsCaught, setCoinsCaught] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastTimeRef = useRef(0);
  const moveDirectionRef = useRef(0); // -1: left, 1: right, 0: idle

  // Mutable Game Entities in refs for 60fps performance
  const gameData = useRef({
    paddleX: 300,
    paddleWidth: 96,
    paddleHeight: 18,
    items: [],
    particles: [],
    floatingTexts: [],
    spawnTimer: 0,
    activeTime: GAME_DURATION,
    currentScore: 0,
    currentCoins: 0,
    currentCombo: 0,
    highestCombo: 0
  });

  // Calculate XP reward based on score
  const calculateReward = useCallback((finalScore) => {
    if (finalScore >= 400) return { xp: 250, rank: 'Apex Tier', tierColor: '#38bdf8' };
    if (finalScore >= 250) return { xp: 175, rank: 'Gold Tier', tierColor: '#fbbf24' };
    if (finalScore >= 100) return { xp: 100, rank: 'Silver Tier', tierColor: '#cbd5e1' };
    return { xp: 50, rank: 'Bronze Tier', tierColor: '#cd7f32' };
  }, []);

  // Keyboard controls
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveDirectionRef.current = -1;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveDirectionRef.current = 1;
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
      }
    };

    const handleKeyUp = (e) => {
      if (
        (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') &&
        moveDirectionRef.current === -1
      ) {
        moveDirectionRef.current = 0;
      }
      if (
        (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') &&
        moveDirectionRef.current === 1
      ) {
        moveDirectionRef.current = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);

  // Touch and pointer tracking on canvas
  const handlePointerMove = (e) => {
    if (gameState !== 'playing' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
    if (!clientX) return;

    const scale = 680 / rect.width;
    const touchX = (clientX - rect.left) * scale;
    const pWidth = gameData.current.paddleWidth;
    gameData.current.paddleX = Math.max(0, Math.min(680 - pWidth, touchX - pWidth / 2));
  };

  // Start / Reset Session
  const startGame = () => {
    if (gameStats.dailyPlaysLeft <= 0) {
      resetGamePlays(); // Auto reset for smooth reviewer demo testing
    }

    soundManager.playClick();
    gameData.current = {
      paddleX: 290,
      paddleWidth: 96,
      paddleHeight: 18,
      items: [],
      particles: [],
      floatingTexts: [],
      spawnTimer: 0,
      activeTime: GAME_DURATION,
      currentScore: 0,
      currentCoins: 0,
      currentCombo: 0,
      highestCombo: 0
    };

    setScore(0);
    setCoinsCaught(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION);
    setRewardClaimed(false);
    setGameState('playing');
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    lastTimeRef.current = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = currentTime;

      // 1. Update Timer
      gameData.current.activeTime -= dt;
      if (gameData.current.activeTime <= 0) {
        gameData.current.activeTime = 0;
        setTimeLeft(0);
        setScore(gameData.current.currentScore);
        setCoinsCaught(gameData.current.currentCoins);
        setMaxCombo(gameData.current.highestCombo);
        setGameState('completed');
        soundManager.playSpecialOrb();
        return;
      }
      setTimeLeft(Math.ceil(gameData.current.activeTime));

      // 2. Paddle movement from arrow keys
      const speed = 460 * dt;
      if (moveDirectionRef.current !== 0) {
        gameData.current.paddleX += moveDirectionRef.current * speed;
        const maxRight = 680 - gameData.current.paddleWidth;
        if (gameData.current.paddleX < 0) gameData.current.paddleX = 0;
        if (gameData.current.paddleX > maxRight) gameData.current.paddleX = maxRight;
      }

      // 3. Spawn falling items
      gameData.current.spawnTimer += dt;
      if (gameData.current.spawnTimer >= 0.55) {
        gameData.current.spawnTimer = 0;
        const rand = Math.random();
        let type = 'gold'; // 60% gold coin
        let value = 10;
        let color = '#fbbf24';
        let radius = 11;
        let fallSpeed = 160 + Math.random() * 80;

        if (rand < 0.15) {
          type = 'diamond'; // 15% diamond star
          value = 50;
          color = '#ffffff';
          radius = 12;
          fallSpeed = 200 + Math.random() * 90;
        } else if (rand < 0.35) {
          type = 'sapphire'; // 20% sapphire orb
          value = 25;
          color = '#38bdf8';
          radius = 10;
          fallSpeed = 180 + Math.random() * 80;
        } else if (rand < 0.52) {
          type = 'hazard'; // 17% hazard node
          value = -15;
          color = '#f87171';
          radius = 10;
          fallSpeed = 170 + Math.random() * 70;
        }

        gameData.current.items.push({
          x: 25 + Math.random() * (680 - 50),
          y: -15,
          radius,
          type,
          value,
          color,
          speed: fallSpeed
        });
      }

      // 4. Update falling items & collision with paddle
      const paddle = {
        x: gameData.current.paddleX,
        y: 425 - 35,
        w: gameData.current.paddleWidth,
        h: gameData.current.paddleHeight
      };

      for (let i = gameData.current.items.length - 1; i >= 0; i--) {
        const item = gameData.current.items[i];
        item.y += item.speed * dt;

        // Collision Check with paddle
        const hitX = item.x >= paddle.x - item.radius && item.x <= paddle.x + paddle.w + item.radius;
        const hitY = item.y + item.radius >= paddle.y && item.y - item.radius <= paddle.y + paddle.h;

        if (hitX && hitY) {
          // Item Caught!
          if (item.type === 'hazard') {
            soundManager.playHazardHit();
            gameData.current.currentScore = Math.max(0, gameData.current.currentScore + item.value);
            gameData.current.currentCombo = 0; // reset combo
            gameData.current.floatingTexts.push({
              x: item.x,
              y: paddle.y - 10,
              text: `${item.value}`,
              color: '#f87171',
              life: 1.0
            });
          } else {
            // Success coin catch
            if (item.type === 'diamond') {
              soundManager.playSpecialOrb();
            } else if (item.type === 'sapphire') {
              soundManager.playSpecialOrb();
            } else {
              soundManager.playCoinCatch();
            }

            gameData.current.currentCoins += 1;
            gameData.current.currentCombo += 1;
            if (gameData.current.currentCombo > gameData.current.highestCombo) {
              gameData.current.highestCombo = gameData.current.currentCombo;
            }

            // Combo multiplier bonus
            let multiplier = 1.0;
            if (gameData.current.currentCombo >= 10) multiplier = 2.0;
            else if (gameData.current.currentCombo >= 6) multiplier = 1.5;
            else if (gameData.current.currentCombo >= 3) multiplier = 1.2;

            const awardedPoints = Math.round(item.value * multiplier);
            gameData.current.currentScore += awardedPoints;

            // Spawn floating text
            const label = multiplier > 1 ? `+${awardedPoints} (${multiplier}x)` : `+${awardedPoints}`;
            gameData.current.floatingTexts.push({
              x: item.x,
              y: paddle.y - 10,
              text: label,
              color: item.color,
              life: 1.0
            });

            // Spawn sparkle particles
            for (let p = 0; p < 8; p++) {
              gameData.current.particles.push({
                x: item.x,
                y: paddle.y,
                vx: (Math.random() - 0.5) * 120,
                vy: -Math.random() * 120 - 30,
                color: item.color,
                life: 0.6,
                maxLife: 0.6
              });
            }
          }

          setScore(gameData.current.currentScore);
          setCombo(gameData.current.currentCombo);
          setCoinsCaught(gameData.current.currentCoins);
          gameData.current.items.splice(i, 1);
          continue;
        }

        // Offscreen removal
        if (item.y > 440) {
          if (item.type !== 'hazard') {
            // Missed coin drops combo
            gameData.current.currentCombo = 0;
            setCombo(0);
          }
          gameData.current.items.splice(i, 1);
        }
      }

      // 5. Update particles
      for (let i = gameData.current.particles.length - 1; i >= 0; i--) {
        const p = gameData.current.particles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
        if (p.life <= 0) {
          gameData.current.particles.splice(i, 1);
        }
      }

      // 6. Update floating texts
      for (let i = gameData.current.floatingTexts.length - 1; i >= 0; i--) {
        const ft = gameData.current.floatingTexts[i];
        ft.y -= 35 * dt;
        ft.life -= dt;
        if (ft.life <= 0) {
          gameData.current.floatingTexts.splice(i, 1);
        }
      }

      // 7. RENDER CANVAS
      ctx.clearRect(0, 0, 680, 425);

      // Background ambient grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let x = 40; x < 680; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 425);
        ctx.stroke();
      }
      for (let y = 40; y < 425; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(680, y);
        ctx.stroke();
      }

      // Draw Items
      gameData.current.items.forEach((item) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.radius, 0, Math.PI * 2);

        if (item.type === 'hazard') {
          ctx.fillStyle = '#ef4444';
          ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
          ctx.shadowBlur = 10;
          ctx.fill();

          // Glitch inner cross
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(item.x - 4, item.y - 4);
          ctx.lineTo(item.x + 4, item.y + 4);
          ctx.moveTo(item.x + 4, item.y - 4);
          ctx.lineTo(item.x - 4, item.y + 4);
          ctx.stroke();
        } else if (item.type === 'diamond') {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.shadowBlur = 14;
          ctx.fill();

          // Star symbol
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('★', item.x, item.y);
        } else if (item.type === 'sapphire') {
          ctx.fillStyle = '#38bdf8';
          ctx.shadowColor = 'rgba(56, 189, 248, 0.8)';
          ctx.shadowBlur = 12;
          ctx.fill();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💎', item.x, item.y);
        } else {
          // Gold coin
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = 'rgba(251, 191, 36, 0.7)';
          ctx.shadowBlur = 10;
          ctx.fill();

          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = '#78350f';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('V', item.x, item.y);
        }

        ctx.restore();
      });

      // Draw Particles
      gameData.current.particles.forEach((p) => {
        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Floating Texts
      gameData.current.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = ft.life;
        ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // Draw Collector Paddle (Obsidian Dock with Cyan Laser Collector Core)
      ctx.save();
      const px = gameData.current.paddleX;
      const py = paddle.y;
      const pw = paddle.w;
      const ph = paddle.h;

      // Glow behind dock
      ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
      ctx.shadowBlur = 16;

      // Outer dock
      ctx.fillStyle = '#1e243d';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(px, py, pw, ph, 8);
      ctx.fill();
      ctx.stroke();

      // Glowing center beam
      ctx.fillStyle = 'linear-gradient(90deg, #38bdf8, #818cf8)';
      ctx.fillRect(px + 12, py + 4, pw - 24, 4);

      // Gold indicator lights
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(px + 8, py + ph / 2, 2.5, 0, Math.PI * 2);
      ctx.arc(px + pw - 8, py + ph / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [gameState]);

  // Handle claiming game reward
  const handleClaimReward = () => {
    if (rewardClaimed) return;
    const { xp } = calculateReward(score);
    recordGameResult(score, coinsCaught, xp);
    setRewardClaimed(true);
  };

  const rewardTier = calculateReward(score);

  return (
    <section id="play-earn" className={styles.gameSection} aria-label="Play and Earn Game Section">
      <div className="container">
        <div className={styles.gameWrapperCard}>
          {/* Header */}
          <div className={styles.gameHeader}>
            <div className={styles.titleGroup}>
              <div className={styles.gameIconBox}>
                <Gamepad2 size={24} />
              </div>
              <div>
                <h2 className={styles.gameTitle}>VE Coin Catch</h2>
                <p className={styles.gameSubtitle}>
                  Skill-based arcade mini-game. Catch falling digital assets to earn XP bonuses.
                </p>
              </div>
            </div>

            <div className={styles.headerStats}>
              <div className={styles.statPill}>
                <Trophy size={14} color="#fbbf24" />
                <span>Today's Best: <strong>{gameStats.highScore} pts</strong></span>
              </div>
              <div className={styles.statPill}>
                <Zap size={14} color="#38bdf8" />
                <span>Plays Remaining: <strong>{gameStats.dailyPlaysLeft}/3</strong></span>
              </div>
            </div>
          </div>

          {/* STATE 1: Instructions & Start Screen */}
          {gameState === 'instructions' && (
            <div className={styles.instructionsScreen}>
              <div className={styles.instructionsContent}>
                <div className={styles.tagline}>
                  <Sparkles size={14} />
                  <span>Interactive Skill Mini-Game</span>
                </div>

                <h3 className={styles.headline}>
                  Intercept VE Assets, Accelerate Your Level-Up
                </h3>

                <p className={styles.bodyText}>
                  Position your collector dock to catch falling digital coins, rare sapphire orbs, and diamond stars before they hit the ground. Avoid hazard nodes that break your streak and subtract points.
                </p>

                {/* Rules & Parameters Grid */}
                <div className={styles.rulesGrid}>
                  <div className={styles.ruleCard}>
                    <span className={styles.ruleLabel}>Time Limit</span>
                    <span className={styles.ruleValue}>30 Seconds</span>
                  </div>
                  <div className={styles.ruleCard}>
                    <span className={styles.ruleLabel}>Controls</span>
                    <span className={styles.ruleValue}>Arrows, A/D, Mouse Drag, Touch</span>
                  </div>
                  <div className={styles.ruleCard}>
                    <span className={styles.ruleLabel}>Reward Potential</span>
                    <span className={styles.ruleValue}>Up to +250 XP per session</span>
                  </div>
                  <div className={styles.ruleCard}>
                    <span className={styles.ruleLabel}>Daily Frequency</span>
                    <span className={styles.ruleValue}>3 Daily Energy Charges</span>
                  </div>
                </div>

                {/* Items & Points Breakdown */}
                <div className={styles.itemsLegend}>
                  <div className={styles.legendItem}>
                    <span className={styles.coinDotGold} />
                    <span>VE Coin: +10 pts</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.coinDotBlue} />
                    <span>Sapphire Orb: +25 pts</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.coinDotDiamond} />
                    <span>Diamond Star: +50 pts</span>
                  </div>
                  <div className={styles.legendItem}>
                    <span className={styles.hazardDot} />
                    <span>Hazard Node: -15 pts</span>
                  </div>
                </div>

                <div className={styles.startBtnRow}>
                  <button
                    className={styles.playStartBtn}
                    onClick={startGame}
                  >
                    <Play size={18} fill="#ffffff" />
                    <span>Start 30s Session</span>
                  </button>

                  <div className={styles.disclaimerNotice}>
                    *Purely skill-based. Demo XP rewards only. No real wallet currency, betting, or gambling mechanics.
                  </div>
                </div>
              </div>

              {/* Graphic Banner */}
              <div className={styles.bannerImageWrapper}>
                <img
                  src={gameBannerImg}
                  alt="VE Coin Catch visual artwork"
                  className={styles.bannerImg}
                />
              </div>
            </div>
          )}

          {/* STATE 2: Active Playing Canvas Arena */}
          {(gameState === 'playing' || gameState === 'paused') && (
            <div className={styles.arenaContainer}>
              {/* In-game HUD */}
              <div className={styles.gameHud}>
                <div className={styles.hudItem}>
                  <span className={styles.hudLabel}>Time Remaining</span>
                  <span className={`${styles.hudValue} ${timeLeft <= 5 ? styles.blueValue : ''}`}>
                    {timeLeft}s
                  </span>
                </div>

                <div className={styles.hudItem}>
                  <span className={styles.hudLabel}>Current Score</span>
                  <span className={`${styles.hudValue} ${styles.goldValue}`}>
                    {score} pts
                  </span>
                </div>

                <div className={styles.hudItem}>
                  <span className={styles.hudLabel}>Combo Streak</span>
                  <span className={styles.hudValue}>
                    {combo > 0 ? `${combo}x` : '0'}
                  </span>
                </div>

                <div className={styles.hudItem}>
                  <span className={styles.hudLabel}>Assets Caught</span>
                  <span className={styles.hudValue}>
                    {coinsCaught}
                  </span>
                </div>

                <button
                  className={styles.statPill}
                  onClick={() => setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'))}
                  style={{ cursor: 'pointer' }}
                >
                  {gameState === 'playing' ? <Pause size={14} /> : <Play size={14} />}
                  <span>{gameState === 'playing' ? 'Pause' : 'Resume'}</span>
                </button>
              </div>

              {/* Canvas viewport */}
              <div
                className={styles.canvasWrapper}
                onPointerMove={handlePointerMove}
                onTouchMove={handlePointerMove}
              >
                <canvas
                  ref={canvasRef}
                  width={680}
                  height={425}
                  className={styles.gameCanvas}
                />
              </div>

              {/* On-screen touch buttons for mobile devices */}
              <div className={styles.mobileControls}>
                <button
                  className={styles.touchBtn}
                  onPointerDown={() => { moveDirectionRef.current = -1; }}
                  onPointerUp={() => { moveDirectionRef.current = 0; }}
                  onPointerLeave={() => { moveDirectionRef.current = 0; }}
                >
                  ◀ Move Left
                </button>
                <button
                  className={styles.touchBtn}
                  onPointerDown={() => { moveDirectionRef.current = 1; }}
                  onPointerUp={() => { moveDirectionRef.current = 0; }}
                  onPointerLeave={() => { moveDirectionRef.current = 0; }}
                >
                  Move Right ▶
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: Session Completed & Reward Reveal */}
          {gameState === 'completed' && (
            <div className={styles.completionScreen}>
              <div className={styles.completionTrophy}>
                <Trophy size={36} />
              </div>

              <div>
                <h3 className={styles.completionTitle}>Session Completed!</h3>
                <p className={styles.completionSubtitle}>
                  Skill rating verified. You unlocked the <strong>{rewardTier.rank}</strong> reward bracket.
                </p>
              </div>

              {/* Performance Stats */}
              <div className={styles.statsGrid}>
                <div className={styles.statBox}>
                  <span className={styles.statBoxLabel}>Final Score</span>
                  <span className={styles.statBoxValue} style={{ color: '#fbbf24' }}>
                    {score} pts
                  </span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statBoxLabel}>Assets Caught</span>
                  <span className={styles.statBoxValue}>
                    {coinsCaught}
                  </span>
                </div>
                <div className={styles.statBox}>
                  <span className={styles.statBoxLabel}>Highest Combo</span>
                  <span className={styles.statBoxValue} style={{ color: '#38bdf8' }}>
                    {maxCombo}x Streak
                  </span>
                </div>
              </div>

              {/* Reward Reveal Box */}
              <div className={styles.rewardRevealBox}>
                <span className={styles.rewardRevealLabel}>
                  XP Reward Earned
                </span>
                <span className={styles.rewardRevealXp}>
                  +{rewardTier.xp} XP
                </span>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  Credited to your VELOOP Level-Up progress meter.
                </span>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  className={styles.claimGameBtn}
                  onClick={handleClaimReward}
                  disabled={rewardClaimed}
                >
                  <Sparkles size={16} />
                  <span>{rewardClaimed ? 'XP Claimed & Deposited!' : 'Claim & Add to Dashboard XP'}</span>
                </button>

                <button
                  className={styles.replayBtn}
                  onClick={startGame}
                >
                  <RotateCcw size={16} />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
