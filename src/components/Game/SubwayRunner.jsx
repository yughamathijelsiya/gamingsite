import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Coins,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Repeat
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { soundManager } from '../../utils/audio';
import runnerBannerImg from '../../assets/subway-runner-banner.jpg';
import styles from './SubwayRunner.module.css';

export default function SubwayRunner({ onGoToConverter }) {
  const { recordGameResult, gameStats } = useRewards();

  const [gameState, setGameState] = useState('instructions'); // 'instructions' | 'playing' | 'paused' | 'gameover'
  const [distance, setDistance] = useState(0);
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [activeMagnet, setActiveMagnet] = useState(false);
  const [hasClaimed, setHasClaimed] = useState(false);

  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastTimeRef = useRef(0);

  // Mutable Game State in ref for smooth 60fps performance
  const runnerData = useRef({
    lane: 1, // 0: Left, 1: Center, 2: Right
    targetLane: 1,
    laneX: 0, // interpolated position -1 to 1
    isJumping: false,
    jumpTimer: 0,
    jumpHeight: 0,
    isSliding: false,
    slideTimer: 0,
    speed: 1.0,
    distanceRun: 0,
    coins: 0,
    score: 0,
    magnetTimer: 0,
    multiplierTimer: 0,
    obstacles: [], // { id, lane, z: 0..1, type: 'hurdle' | 'laser' | 'train' | 'coin' | 'magnet', height }
    spawnTimer: 0,
    trackOffset: 0
  });

  // Controls handler
  const handleMoveLeft = useCallback(() => {
    if (runnerData.current.targetLane > 0) {
      runnerData.current.targetLane -= 1;
      soundManager.playClick();
    }
  }, []);

  const handleMoveRight = useCallback(() => {
    if (runnerData.current.targetLane < 2) {
      runnerData.current.targetLane += 1;
      soundManager.playClick();
    }
  }, []);

  const handleJump = useCallback(() => {
    if (!runnerData.current.isJumping && !runnerData.current.isSliding) {
      runnerData.current.isJumping = true;
      runnerData.current.jumpTimer = 0;
      soundManager.playJumpSound();
    }
  }, []);

  const handleSlide = useCallback(() => {
    if (!runnerData.current.isSliding) {
      runnerData.current.isSliding = true;
      runnerData.current.slideTimer = 0;
      runnerData.current.isJumping = false; // fast fall
      soundManager.playSlideSound();
    }
  }, []);

  // Keyboard listener
  useEffect(() => {
    if (gameState !== 'playing') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        handleMoveLeft();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        handleMoveRight();
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') {
        e.preventDefault();
        handleJump();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleSlide();
      } else if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, handleMoveLeft, handleMoveRight, handleJump, handleSlide]);

  // Touch Swipe on Canvas
  const touchStartPos = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e) => {
    if (e.touches && e.touches[0]) {
      touchStartPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    const dx = e.changedTouches[0].clientX - touchStartPos.current.x;
    const dy = e.changedTouches[0].clientY - touchStartPos.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 25) {
      if (absX > absY) {
        if (dx > 0) handleMoveRight();
        else handleMoveLeft();
      } else {
        if (dy > 0) handleSlide();
        else handleJump();
      }
    }
  };

  // Start Game
  const startGame = () => {
    soundManager.playClick();
    runnerData.current = {
      lane: 1,
      targetLane: 1,
      laneX: 0,
      isJumping: false,
      jumpTimer: 0,
      jumpHeight: 0,
      isSliding: false,
      slideTimer: 0,
      speed: 1.0,
      distanceRun: 0,
      coins: 0,
      score: 0,
      magnetTimer: 0,
      multiplierTimer: 0,
      obstacles: [],
      spawnTimer: 0,
      trackOffset: 0
    };

    setDistance(0);
    setCoinsCollected(0);
    setCurrentScore(0);
    setActiveMagnet(false);
    setHasClaimed(false);
    setGameState('playing');
  };

  // 60 FPS 3D Runner Canvas Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    lastTimeRef.current = performance.now();

    const loop = (currentTime) => {
      const dt = Math.min((currentTime - lastTimeRef.current) / 1000, 0.08);
      lastTimeRef.current = currentTime;

      const r = runnerData.current;

      // 1. Update distance & speed
      r.distanceRun += dt * 40 * r.speed;
      r.speed = Math.min(2.5, 1.0 + (r.distanceRun / 1000) * 0.4);
      setDistance(Math.floor(r.distanceRun));

      // Calculate running score: distance * 2 + coins * 10
      const pointMultiplier = r.multiplierTimer > 0 ? 2 : 1;
      r.score = Math.floor(r.distanceRun * 2 + r.coins * 10) * pointMultiplier;
      setCurrentScore(r.score);

      // Power-up timers
      if (r.magnetTimer > 0) {
        r.magnetTimer -= dt;
        if (r.magnetTimer <= 0) setActiveMagnet(false);
      }
      if (r.multiplierTimer > 0) {
        r.multiplierTimer -= dt;
      }

      // 2. Smooth Lane Interpolation (-1: Left, 0: Center, 1: Right)
      const targetX = r.targetLane - 1;
      r.laneX += (targetX - r.laneX) * 14 * dt;
      if (Math.abs(targetX - r.laneX) < 0.01) r.laneX = targetX;

      // 3. Jump physics
      if (r.isJumping) {
        r.jumpTimer += dt;
        // Sine wave arc over 0.6 seconds
        const progress = r.jumpTimer / 0.6;
        if (progress >= 1) {
          r.isJumping = false;
          r.jumpHeight = 0;
        } else {
          r.jumpHeight = Math.sin(progress * Math.PI) * 75;
        }
      }

      // 4. Slide physics
      if (r.isSliding) {
        r.slideTimer += dt;
        if (r.slideTimer >= 0.65) {
          r.isSliding = false;
        }
      }

      // 5. Track offset for moving ground effect
      r.trackOffset = (r.trackOffset + dt * 2.8 * r.speed) % 1;

      // 6. Spawn Obstacles & Coins
      r.spawnTimer += dt * r.speed;
      if (r.spawnTimer >= 0.85) {
        r.spawnTimer = 0;
        const randomLane = Math.floor(Math.random() * 3); // 0, 1, 2
        const randType = Math.random();

        if (randType < 0.35) {
          // Low hurdle (Jump over or change lane)
          r.obstacles.push({
            id: Math.random(),
            lane: randomLane,
            z: 0.0,
            type: 'hurdle'
          });
        } else if (randType < 0.6) {
          // High laser barrier (Slide under or change lane)
          r.obstacles.push({
            id: Math.random(),
            lane: randomLane,
            z: 0.0,
            type: 'laser'
          });
        } else if (randType < 0.8) {
          // Solid Train / Security Drone Block (Must change lane)
          r.obstacles.push({
            id: Math.random(),
            lane: randomLane,
            z: 0.0,
            type: 'train'
          });
        } else if (randType < 0.95) {
          // Coin cluster (3 coins in a row)
          for (let c = 0; c < 3; c++) {
            r.obstacles.push({
              id: Math.random(),
              lane: randomLane,
              z: -c * 0.07,
              type: 'coin',
              floating: false
            });
          }
        } else {
          // Magnet power-up
          r.obstacles.push({
            id: Math.random(),
            lane: randomLane,
            z: 0.0,
            type: 'magnet'
          });
        }
      }

      // 7. Update Obstacles & Check Collisions
      const playerZ = 0.86; // Player is positioned near bottom (z = 0.86)
      const playerLaneIndex = Math.round(r.laneX + 1);

      for (let i = r.obstacles.length - 1; i >= 0; i--) {
        const item = r.obstacles[i];
        item.z += dt * 0.95 * r.speed;

        // Magnet attraction
        if (r.magnetTimer > 0 && item.type === 'coin' && item.z > 0.4) {
          item.lane += (r.targetLane - item.lane) * 8 * dt;
        }

        // Collision Check when item reaches player Z
        if (item.z >= playerZ - 0.05 && item.z <= playerZ + 0.05) {
          const inSameLane = Math.abs(item.lane - (r.laneX + 1)) < 0.45;

          if (inSameLane) {
            if (item.type === 'coin') {
              soundManager.playCoinCatch();
              r.coins += 1;
              setCoinsCollected(r.coins);
              r.obstacles.splice(i, 1);
              continue;
            } else if (item.type === 'magnet') {
              soundManager.playSpecialOrb();
              r.magnetTimer = 8.0;
              setActiveMagnet(true);
              r.obstacles.splice(i, 1);
              continue;
            } else if (item.type === 'hurdle') {
              // Can only survive if jumping high enough
              if (r.jumpHeight < 28) {
                // Crash!
                soundManager.playCrashSound();
                setGameState('gameover');
                return;
              }
            } else if (item.type === 'laser') {
              // Can only survive if sliding!
              if (!r.isSliding) {
                // Crash!
                soundManager.playCrashSound();
                setGameState('gameover');
                return;
              }
            } else if (item.type === 'train') {
              // Solid train always crashes if in same lane!
              soundManager.playCrashSound();
              setGameState('gameover');
              return;
            }
          }
        }

        // Remove past screen
        if (item.z > 1.1) {
          r.obstacles.splice(i, 1);
        }
      }

      // 8. RENDER 3D PERSPECTIVE CANVAS
      const W = 720;
      const H = 450;
      ctx.clearRect(0, 0, W, H);

      // Sky & Horizon
      const horizonY = 135;
      const vpX = W / 2;

      // Dark futuristic city skyline gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
      skyGrad.addColorStop(0, '#0a0d18');
      skyGrad.addColorStop(1, '#181d33');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, horizonY);

      // Distant city silhouette
      ctx.fillStyle = '#0f1325';
      const buildings = [
        [30, 40, 30], [70, 70, 40], [130, 50, 25], [170, 90, 45],
        [240, 60, 35], [300, 100, 50], [380, 85, 40], [450, 65, 30],
        [510, 95, 45], [580, 55, 35], [640, 80, 40]
      ];
      buildings.forEach(([bx, bh, bw]) => {
        ctx.fillRect(bx, horizonY - bh, bw, bh);
        // Window lights
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.fillRect(bx + 4, horizonY - bh + 10, bw - 8, 4);
        ctx.fillRect(bx + 4, horizonY - bh + 22, bw - 8, 4);
        ctx.fillStyle = '#0f1325';
      });

      // Ground (Neon Subway Road)
      const roadGrad = ctx.createLinearGradient(0, horizonY, 0, H);
      roadGrad.addColorStop(0, '#101322');
      roadGrad.addColorStop(1, '#16192c');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, horizonY, W, H - horizonY);

      // 3 Perspective Lanes
      // Helper function to get 2D canvas coordinates from (lane: -1..1, z: 0..1)
      const project = (laneNorm, z, heightOffGround = 0) => {
        const pz = Math.max(0, Math.min(1, z));
        // Exponential scale factor for 3D depth
        const scale = 0.15 + 0.85 * pz;
        const curY = horizonY + (H - horizonY) * pz;
        const trackHalfWidth = 60 + (280 - 60) * pz;
        const curX = vpX + laneNorm * (trackHalfWidth * 0.7);
        return { x: curX, y: curY - heightOffGround * scale, scale };
      };

      // Draw Rails & Lane Dividers
      const leftRailTop = project(-1.45, 0);
      const leftRailBottom = project(-1.45, 1);
      const rightRailTop = project(1.45, 0);
      const rightRailBottom = project(1.45, 1);

      // Outer track glow borders
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(leftRailTop.x, leftRailTop.y);
      ctx.lineTo(leftRailBottom.x, leftRailBottom.y);
      ctx.moveTo(rightRailTop.x, rightRailTop.y);
      ctx.lineTo(rightRailBottom.x, rightRailBottom.y);
      ctx.stroke();

      // Lane dividers (between lanes 0-1 and 1-2)
      [-0.45, 0.45].forEach((divLane) => {
        const top = project(divLane, 0);
        const btm = project(divLane, 1);
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([12, 12]);
        ctx.beginPath();
        ctx.moveTo(top.x, top.y);
        ctx.lineTo(btm.x, btm.y);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Moving cross-ties (railway ties illusion)
      for (let zi = 0; zi < 10; zi++) {
        const z = (zi / 10 + r.trackOffset * 0.1) % 1;
        const pL = project(-1.45, z);
        const pR = project(1.45, z);
        ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 + 0.15 * z})`;
        ctx.lineWidth = 1 + 2 * z;
        ctx.beginPath();
        ctx.moveTo(pL.x, pL.y);
        ctx.lineTo(pR.x, pR.y);
        ctx.stroke();
      }

      // Draw Obstacles (sorted back-to-front by Z)
      const sortedObstacles = [...r.obstacles].sort((a, b) => a.z - b.z);

      sortedObstacles.forEach((obs) => {
        if (obs.z < 0) return;
        const normLane = obs.lane - 1;
        const pos = project(normLane, obs.z);

        ctx.save();
        if (obs.type === 'coin') {
          // Floating Gold Coin
          const size = 10 * pos.scale;
          ctx.shadowColor = '#fbbf24';
          ctx.shadowBlur = 12 * pos.scale;
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y - 12 * pos.scale, size, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1.5 * pos.scale;
          ctx.stroke();

          // Coin text
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.max(6, 8 * pos.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('V', pos.x, pos.y - 12 * pos.scale);
        } else if (obs.type === 'magnet') {
          // Magnet Power-up Orb
          const size = 12 * pos.scale;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 14 * pos.scale;
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y - 14 * pos.scale, size, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = `${Math.max(8, 12 * pos.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('🧲', pos.x, pos.y - 14 * pos.scale);
        } else if (obs.type === 'hurdle') {
          // Low Barrier (Requires Jump)
          const w = 55 * pos.scale;
          const h = 22 * pos.scale;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 10 * pos.scale;
          ctx.fillStyle = '#d97706';
          ctx.fillRect(pos.x - w / 2, pos.y - h, w, h);

          // Yellow/Black stripes
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 2 * pos.scale;
          ctx.strokeRect(pos.x - w / 2, pos.y - h, w, h);

          ctx.fillStyle = '#0f172a';
          ctx.font = `bold ${Math.max(7, 9 * pos.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('JUMP ▲', pos.x, pos.y - h / 2 + 3 * pos.scale);
        } else if (obs.type === 'laser') {
          // High Laser Gate (Requires Slide)
          const w = 65 * pos.scale;
          const postH = 45 * pos.scale;
          const laserY = pos.y - postH + 10 * pos.scale;

          // Side posts
          ctx.fillStyle = '#64748b';
          ctx.fillRect(pos.x - w / 2, pos.y - postH, 6 * pos.scale, postH);
          ctx.fillRect(pos.x + w / 2 - 6 * pos.scale, pos.y - postH, 6 * pos.scale, postH);

          // Glowing laser beam
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 4 * pos.scale;
          ctx.shadowColor = '#f87171';
          ctx.shadowBlur = 12 * pos.scale;
          ctx.beginPath();
          ctx.moveTo(pos.x - w / 2, laserY);
          ctx.lineTo(pos.x + w / 2, laserY);
          ctx.stroke();

          ctx.fillStyle = '#f87171';
          ctx.font = `bold ${Math.max(6, 8 * pos.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('SLIDE ▼', pos.x, laserY - 6 * pos.scale);
        } else if (obs.type === 'train') {
          // Solid Train / Security Block (Must switch lane)
          const w = 60 * pos.scale;
          const h = 50 * pos.scale;
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 14 * pos.scale;
          ctx.fillStyle = '#1e243d';
          ctx.strokeStyle = '#818cf8';
          ctx.lineWidth = 2 * pos.scale;

          ctx.fillRect(pos.x - w / 2, pos.y - h, w, h);
          ctx.strokeRect(pos.x - w / 2, pos.y - h, w, h);

          // Headlights
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(pos.x - w / 3, pos.y - h + 15 * pos.scale, 4 * pos.scale, 0, Math.PI * 2);
          ctx.arc(pos.x + w / 3, pos.y - h + 15 * pos.scale, 4 * pos.scale, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#cbd5e1';
          ctx.font = `bold ${Math.max(6, 8 * pos.scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('BLOCK', pos.x, pos.y - 10 * pos.scale);
        }
        ctx.restore();
      });

      // 9. DRAW PLAYER (Cyber Surfer on Gold Hoverboard)
      const playerPos = project(r.laneX, playerZ, r.jumpHeight);
      const pScale = playerPos.scale;
      const px = playerPos.x;
      const py = playerPos.y;

      ctx.save();
      // Shadow under hoverboard on track
      const groundPos = project(r.laneX, playerZ);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(groundPos.x, groundPos.y, 24 * pScale, 6 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Gold Hoverboard
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 16 * pScale;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.ellipse(px, py - 4 * pScale, 26 * pScale, 6 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Hoverboard neon center
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.ellipse(px, py - 4 * pScale, 18 * pScale, 3 * pScale, 0, 0, Math.PI * 2);
      ctx.fill();

      // Runner Body
      if (r.isSliding) {
        // Crouched ducking pose
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 * pScale;
        ctx.beginPath();
        ctx.roundRect(px - 14 * pScale, py - 20 * pScale, 28 * pScale, 16 * pScale, 4);
        ctx.fill();
        ctx.stroke();

        // Helmet
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(px, py - 24 * pScale, 7 * pScale, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Upright Running / Hovering Pose
        // Torso & Cyber Suit
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2 * pScale;
        ctx.beginPath();
        ctx.roundRect(px - 12 * pScale, py - 38 * pScale, 24 * pScale, 28 * pScale, 6);
        ctx.fill();
        ctx.stroke();

        // Glowing gold chest insignia (V)
        ctx.fillStyle = '#fbbf24';
        ctx.font = `bold ${Math.max(8, 10 * pScale)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText('V', px, py - 24 * pScale);

        // Cyber Helmet
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 10 * pScale;
        ctx.beginPath();
        ctx.arc(px, py - 46 * pScale, 9 * pScale, 0, Math.PI * 2);
        ctx.fill();

        // Visor
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(px - 6 * pScale, py - 48 * pScale, 12 * pScale, 4 * pScale);
      }
      ctx.restore();

      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState]);

  // When Game Over: record result and auto-inject into points balance
  const handleClaimPoints = () => {
    if (hasClaimed) return;
    const xpReward = Math.floor(currentScore * 0.2); // 20% conversion to XP directly
    recordGameResult(currentScore, coinsCollected, xpReward, 'Cyber Surfers: Neon Run');
    setHasClaimed(true);
  };

  return (
    <div className={styles.gameContainer} aria-label="Subway Runner Arcade Game">
      {/* Header Bar */}
      <div className={styles.gameHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.gameIconBox}>
            <Zap size={24} />
          </div>
          <div>
            <h3 className={styles.gameTitle}>Cyber Surfers: Neon Run</h3>
            <p className={styles.gameSubtitle}>
              3D endless subway runner. Dodge lasers & hurdles, grab VE coins, and rack up points!
            </p>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <Trophy size={14} color="#fbbf24" />
            <span>Best Distance: <strong>{gameStats.subwayBestDistance || 940}m</strong></span>
          </div>
          <div className={styles.statPill}>
            <Coins size={14} color="#38bdf8" />
            <span>Total Coins: <strong>{coinsCollected}</strong></span>
          </div>
        </div>
      </div>

      {/* STATE 1: Instructions Screen */}
      {gameState === 'instructions' && (
        <div className={styles.instructionsScreen}>
          <div className={styles.instructionsContent}>
            <div className={styles.tagline}>
              <Sparkles size={14} />
              <span>3D Arcade Runner</span>
            </div>

            <h4 className={styles.headline}>
              Sprint The Neon Grid, Collect VE Coins & Surge
            </h4>

            <p className={styles.bodyText}>
              Navigate 3 high-speed tracks on your gold hoverboard. <strong>Jump</strong> over low hurdles, <strong>Slide</strong> under high laser beams, and <strong>dodge</strong> security trains. Every meter traveled and coin collected is converted directly into exchangeable <strong>Game Points</strong>!
            </p>

            {/* Controls Guide */}
            <div className={styles.controlsGuideGrid}>
              <div className={styles.controlCard}>
                <span className={styles.controlKey}>← or A</span>
                <span className={styles.controlAction}>Shift Left</span>
              </div>
              <div className={styles.controlCard}>
                <span className={styles.controlKey}>→ or D</span>
                <span className={styles.controlAction}>Shift Right</span>
              </div>
              <div className={styles.controlCard}>
                <span className={styles.controlKey}>↑ or W / Space</span>
                <span className={styles.controlAction}>Jump Hurdle</span>
              </div>
              <div className={styles.controlCard}>
                <span className={styles.controlKey}>↓ or S</span>
                <span className={styles.controlAction}>Slide Laser</span>
              </div>
            </div>

            <div className={styles.startBtnRow}>
              <button className={styles.playStartBtn} onClick={startGame}>
                <Play size={18} fill="#0f172a" />
                <span>Start Neon Run</span>
              </button>
            </div>
          </div>

          {/* Banner Image */}
          <div className={styles.bannerImageWrapper}>
            <img
              src={runnerBannerImg}
              alt="Cyber Surfers Neon Run Banner"
              className={styles.bannerImg}
            />
          </div>
        </div>
      )}

      {/* STATE 2: Playing Arena */}
      {(gameState === 'playing' || gameState === 'paused') && (
        <div className={styles.arenaContainer}>
          {/* In-Game HUD */}
          <div className={styles.gameHud}>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Distance</span>
              <span className={styles.hudValue} style={{ color: '#38bdf8' }}>{distance}m</span>
            </div>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Coins</span>
              <span className={styles.hudValue} style={{ color: '#fbbf24' }}>🪙 {coinsCollected}</span>
            </div>
            <div className={styles.hudItem}>
              <span className={styles.hudLabel}>Game Points</span>
              <span className={styles.hudValue} style={{ color: '#ffffff' }}>{currentScore} pts</span>
            </div>
            {activeMagnet && (
              <div className={styles.hudItem}>
                <span className={styles.hudLabel}>Power-Up</span>
                <span className={styles.hudValue} style={{ color: '#a78bfa' }}>🧲 Magnet Active</span>
              </div>
            )}
            <button
              className={styles.statPill}
              onClick={() => setGameState((prev) => (prev === 'playing' ? 'paused' : 'playing'))}
              style={{ cursor: 'pointer' }}
            >
              {gameState === 'playing' ? <Pause size={14} /> : <Play size={14} />}
              <span>{gameState === 'playing' ? 'Pause' : 'Resume'}</span>
            </button>
          </div>

          {/* Canvas Viewport */}
          <div
            className={styles.canvasWrapper}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <canvas
              ref={canvasRef}
              width={720}
              height={450}
              className={styles.gameCanvas}
            />
          </div>

          {/* Mobile Touch Navigation Buttons */}
          <div className={styles.mobileControls}>
            <button className={styles.touchBtn} onClick={handleMoveLeft}>
              <ArrowLeft size={16} />
              <span>Left</span>
            </button>
            <button className={styles.touchBtn} onClick={handleJump}>
              <ArrowUp size={16} />
              <span>Jump</span>
            </button>
            <button className={styles.touchBtn} onClick={handleSlide}>
              <ArrowDown size={16} />
              <span>Slide</span>
            </button>
            <button className={styles.touchBtn} onClick={handleMoveRight}>
              <ArrowRight size={16} />
              <span>Right</span>
            </button>
          </div>
        </div>
      )}

      {/* STATE 3: Game Over Screen */}
      {gameState === 'gameover' && (
        <div className={styles.completionScreen}>
          <div className={styles.completionTrophy}>
            <Trophy size={36} />
          </div>

          <div>
            <h4 className={styles.completionTitle}>Run Completed!</h4>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>
              Great reflex performance! Your distance and coins have been tallied.
            </p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Distance Run</span>
              <span className={styles.statBoxValue} style={{ color: '#38bdf8' }}>{distance} meters</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Coins Collected</span>
              <span className={styles.statBoxValue} style={{ color: '#fbbf24' }}>{coinsCollected} coins</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statBoxLabel}>Total Points</span>
              <span className={styles.statBoxValue} style={{ color: '#ffffff' }}>{currentScore} pts</span>
            </div>
          </div>

          <div className={styles.pointsEarnedBox}>
            <span className={styles.pointsTitle}>Arcade Points Earned</span>
            <span className={styles.pointsNumber}>+{currentScore} Points</span>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Deposit these points into your account to exchange for <strong>VE Coins</strong> and <strong>Level XP</strong>!
            </span>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              className={styles.playStartBtn}
              onClick={handleClaimPoints}
              disabled={hasClaimed}
            >
              <Sparkles size={16} />
              <span>{hasClaimed ? 'Points Deposited to Wallet!' : 'Deposit Points to Balance'}</span>
            </button>

            {onGoToConverter && (
              <button
                className={styles.playStartBtn}
                style={{ background: 'linear-gradient(135deg, #38bdf8, #2563eb)', color: '#ffffff' }}
                onClick={() => {
                  handleClaimPoints();
                  onGoToConverter();
                }}
              >
                <Repeat size={16} />
                <span>Exchange Points for Coins & XP</span>
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
              <span>Run Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
