import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Sparkles,
  Trophy,
  RotateCcw,
  Play,
  Repeat,
  Zap,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useRewards } from '../../context/RewardsContext';
import { soundManager } from '../../utils/audio';
import bannerImg from '../../assets/neuro-matrix-banner.jpg';
import styles from './NeuroBrainMatrix.module.css';

const MATRIX_SIZE = 16; // 4x4

export default function NeuroBrainMatrix({ onGoToConverter }) {
  const { recordGameResult } = useRewards();

  const [gameState, setGameState] = useState('instructions'); // 'instructions' | 'playing' | 'completed'
  const [phase, setPhase] = useState('showing'); // 'showing' | 'waiting'
  const [stage, setStage] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerInputIndex, setPlayerInputIndex] = useState(0);
  const [activeNode, setActiveNode] = useState(null);
  const [wrongNode, setWrongNode] = useState(null);
  const [score, setScore] = useState(0);
  const [hasClaimed, setHasClaimed] = useState(false);

  // Playback timer ref
  const playTimerRef = useRef(null);

  const startNewStage = (currentStage) => {
    setPhase('showing');
    setPlayerInputIndex(0);
    setActiveNode(null);
    setWrongNode(null);

    // Sequence length = currentStage + 2 (Stage 1 = 3 nodes, Stage 2 = 4 nodes, etc.)
    const seqLength = currentStage + 2;
    const newSeq = [];
    for (let i = 0; i < seqLength; i++) {
      let node;
      do {
        node = Math.floor(Math.random() * MATRIX_SIZE);
      } while (i > 0 && node === newSeq[i - 1]); // don't repeat immediate consecutive
      newSeq.push(node);
    }
    setSequence(newSeq);

    // Playback sequence
    let step = 0;
    playTimerRef.current = setInterval(() => {
      if (step < newSeq.length) {
        const nodeToLight = newSeq[step];
        setActiveNode(nodeToLight);
        soundManager.playCoinCatch();

        setTimeout(() => {
          setActiveNode(null);
        }, 400);

        step++;
      } else {
        clearInterval(playTimerRef.current);
        setTimeout(() => {
          setPhase('waiting');
        }, 400);
      }
    }, 650);
  };

  const startGame = () => {
    soundManager.playClick();
    setStage(1);
    setScore(0);
    setHasClaimed(false);
    setGameState('playing');
    startNewStage(1);
  };

  // Handle player node tap
  const handleNodeClick = (nodeIndex) => {
    if (gameState !== 'playing' || phase !== 'waiting') return;

    const expectedNode = sequence[playerInputIndex];

    if (nodeIndex === expectedNode) {
      // Correct!
      soundManager.playCoinCatch();
      setActiveNode(nodeIndex);
      setTimeout(() => setActiveNode(null), 250);

      const nextInputIndex = playerInputIndex + 1;
      setPlayerInputIndex(nextInputIndex);

      if (nextInputIndex === sequence.length) {
        // Stage Complete!
        soundManager.playSpecialOrb();
        const stagePoints = stage * 150;
        const newScore = score + stagePoints;
        setScore(newScore);

        if (stage >= 6) {
          // Max stage reached!
          setTimeout(() => {
            setGameState('completed');
            soundManager.playLevelUp();
          }, 600);
        } else {
          const nextStage = stage + 1;
          setStage(nextStage);
          setTimeout(() => {
            startNewStage(nextStage);
          }, 800);
        }
      }
    } else {
      // Wrong node!
      soundManager.playHazardHit();
      setWrongNode(nodeIndex);
      setTimeout(() => {
        setWrongNode(null);
        setGameState('completed');
      }, 700);
    }
  };

  useEffect(() => {
    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, []);

  const handleClaim = () => {
    if (hasClaimed) return;
    const finalScore = Math.max(score, 120);
    const xpEarned = Math.floor(finalScore * 0.25);
    recordGameResult(finalScore, Math.floor(finalScore / 25), xpEarned, 'Neuro Matrix Brain Test');
    setHasClaimed(true);
  };

  const getBrainRating = () => {
    if (stage >= 5) return 'Master Synaptic Genius';
    if (stage >= 4) return 'Advanced Cognitive Navigator';
    if (stage >= 3) return 'Sharp Spatial Recall';
    return 'Active Neural Apprentice';
  };

  return (
    <div className={styles.gameContainer} aria-label="Neuro Matrix Brain Test Game">
      {/* Header */}
      <div className={styles.gameHeader}>
        <div className={styles.titleGroup}>
          <div className={styles.gameIconBox}>
            <Brain size={24} />
          </div>
          <div>
            <h3 className={styles.gameTitle}>Neuro Matrix: Brain Test</h3>
            <p className={styles.gameSubtitle}>
              Memorize the glowing neural node sequence and repeat it accurately!
            </p>
          </div>
        </div>

        <div className={styles.headerStats}>
          <div className={styles.statPill}>
            <span>Stage: <strong>{stage}/6</strong></span>
          </div>
          <div className={styles.statPill}>
            <Zap size={14} color="#c084fc" />
            <span>Score: <strong>{score} pts</strong></span>
          </div>
        </div>
      </div>

      {/* STATE 1: Instructions */}
      {gameState === 'instructions' && (
        <div className={styles.instructionsScreen}>
          <div className={styles.instructionsContent}>
            <div className={styles.tagline}>
              <Brain size={14} />
              <span>Cognitive Spatial Memory Test</span>
            </div>

            <h4 className={styles.headline}>
              Enhance Working Memory & Earn Arcade Points
            </h4>

            <p className={styles.bodyText}>
              Watch the neural matrix nodes light up in a sequential pattern. When the prompt turns cyan, repeat the exact pattern. Each stage adds more nodes to test and expand your cognitive limits, rewarding generous convertible points!
            </p>

            <button className={styles.playStartBtn} onClick={startGame}>
              <Play size={18} fill="#ffffff" />
              <span>Start Cognitive Test</span>
            </button>
          </div>

          <div className={styles.bannerImageWrapper}>
            <img src={bannerImg} alt="Neuro Matrix Artwork" className={styles.bannerImg} />
          </div>
        </div>
      )}

      {/* STATE 2: Playing Arena */}
      {gameState === 'playing' && (
        <div className={styles.arenaContainer}>
          {/* Phase Callout */}
          <div className={`${styles.phaseCallout} ${phase === 'showing' ? styles.phaseWatch : styles.phaseRepeat}`}>
            {phase === 'showing' ? (
              <>
                <Eye size={18} />
                <span>Watch Sequence Pattern ({sequence.length} nodes)...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Your Turn: Repeat Sequence ({playerInputIndex}/{sequence.length})</span>
              </>
            )}
          </div>

          {/* 4x4 Matrix */}
          <div className={styles.matrixBoard}>
            {Array.from({ length: MATRIX_SIZE }).map((_, idx) => {
              const isLit = activeNode === idx;
              const isWrong = wrongNode === idx;

              return (
                <button
                  key={idx}
                  className={`${styles.matrixNode} ${isLit ? styles.nodeLit : ''} ${
                    isWrong ? styles.nodeWrong : ''
                  }`}
                  onClick={() => handleNodeClick(idx)}
                  disabled={phase === 'showing'}
                  aria-label={`Node ${idx + 1}`}
                >
                  <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.2)', fontWeight: 800 }}>
                    {idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 3: Completion */}
      {gameState === 'completed' && (
        <div className={styles.completionScreen}>
          <div className={styles.completionTrophy}>
            <Brain size={36} />
          </div>

          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Evaluation Complete!
            </h4>
            <p style={{ color: '#c084fc', fontSize: '1rem', fontWeight: 700, margin: '4px 0' }}>
              Cognitive Rating: {getBrainRating()}
            </p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
              Reached Stage {stage} with <strong>{score} points</strong>.
            </p>
          </div>

          <div className={styles.pointsEarnedBox}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#c084fc', fontWeight: 800 }}>
              Points Earned
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, color: '#ffffff' }}>
              +{score || 150} Points
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
              <span>Test Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
