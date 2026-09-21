import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Award, ArrowLeft, ArrowRight, ArrowUp, Zap, Coins } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface GuardianRunGameProps {
  onClose: () => void;
  onGameComplete: (earnedXp: number, score: number) => void;
}

type GameState = 'preview' | 'countdown' | 'playing' | 'completed';

interface Collectible {
  lane: number; // 0, 1, 2
  z: number; // distance forward
  type: 'coin' | 'xp' | 'obstacle';
  collected: boolean;
}

export const GuardianRunGame: React.FC<GuardianRunGameProps> = ({ onClose, onGameComplete }) => {
  const [gameState, setGameState] = useState<GameState>('preview');
  const [countdown, setCountdown] = useState<number>(3);
  const [score, setScore] = useState<number>(0);
  const [distance, setDistance] = useState<number>(0);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [playerLane, setPlayerLane] = useState<number>(1); // 0 = left, 1 = mid, 2 = right
  const [isJumping, setIsJumping] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Mutable game simulation refs
  const stateRef = useRef({
    lane: 1,
    isJumping: false,
    jumpY: 0,
    jumpVelocity: 0,
    speed: 6,
    distance: 0,
    score: 0,
    coins: 0,
    combo: 1,
    collectibles: [] as Collectible[],
    lastSpawnDist: 0,
    running: false,
  });

  // Start Countdown
  const handleStart = () => {
    sounds.playTap();
    setGameState('countdown');
    setCountdown(3);

    let currentCount = 3;
    const interval = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        sounds.playTap();
        setCountdown(currentCount);
      } else {
        clearInterval(interval);
        sounds.playJump();
        setCountdown(0);
        startGameplay();
      }
    }, 700);
  };

  const startGameplay = () => {
    setGameState('playing');
    setScore(0);
    setDistance(0);
    setCoinsCollected(0);
    setCombo(1);
    setPlayerLane(1);

    stateRef.current = {
      lane: 1,
      isJumping: false,
      jumpY: 0,
      jumpVelocity: 0,
      speed: 7,
      distance: 0,
      score: 0,
      coins: 0,
      combo: 1,
      collectibles: [],
      lastSpawnDist: 0,
      running: true,
    };

    // Pre-populate initial items along the track
    for (let i = 1; i <= 6; i++) {
      const lane = Math.floor(Math.random() * 3);
      const isObs = i % 2 === 0;
      stateRef.current.collectibles.push({
        lane,
        z: 300 + i * 200,
        type: isObs ? 'obstacle' : Math.random() > 0.4 ? 'coin' : 'xp',
        collected: false,
      });
    }
  };

  // Lane switching controls
  const switchLane = (direction: 'left' | 'right') => {
    if (gameState !== 'playing') return;
    const cur = stateRef.current.lane;
    let nextLane = cur;
    if (direction === 'left' && cur > 0) nextLane = cur - 1;
    if (direction === 'right' && cur < 2) nextLane = cur + 1;

    if (nextLane !== cur) {
      sounds.playTap();
      stateRef.current.lane = nextLane;
      setPlayerLane(nextLane);
    }
  };

  const jump = () => {
    if (gameState !== 'playing' || stateRef.current.isJumping) return;
    sounds.playJump();
    stateRef.current.isJumping = true;
    stateRef.current.jumpVelocity = 14;
    setIsJumping(true);
  };

  // Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        switchLane('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        switchLane('right');
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localDistance = 0;

    const render = () => {
      if (!stateRef.current.running) return;

      const width = canvas.width;
      const height = canvas.height;

      // Update physics
      localDistance += stateRef.current.speed * 0.1;
      stateRef.current.distance = Math.floor(localDistance);
      setDistance(stateRef.current.distance);

      // Speed acceleration gradual
      stateRef.current.speed = Math.min(15, 7 + localDistance * 0.008);

      // Handle jumping
      if (stateRef.current.isJumping) {
        stateRef.current.jumpY += stateRef.current.jumpVelocity;
        stateRef.current.jumpVelocity -= 0.8; // gravity
        if (stateRef.current.jumpY <= 0) {
          stateRef.current.jumpY = 0;
          stateRef.current.isJumping = false;
          setIsJumping(false);
        }
      }

      // Move collectibles forward
      for (const item of stateRef.current.collectibles) {
        item.z -= stateRef.current.speed;
      }

      // Spawn new items
      const lastItem = stateRef.current.collectibles[stateRef.current.collectibles.length - 1];
      if (!lastItem || lastItem.z < 1200) {
        const lane = Math.floor(Math.random() * 3);
        const typeRoll = Math.random();
        const type = typeRoll < 0.4 ? 'obstacle' : typeRoll < 0.75 ? 'coin' : 'xp';
        stateRef.current.collectibles.push({
          lane,
          z: (lastItem ? lastItem.z : 400) + 160 + Math.random() * 80,
          type,
          collected: false,
        });
      }

      // Collision checks
      const playerLane = stateRef.current.lane;
      const playerJumping = stateRef.current.jumpY > 20;

      for (const item of stateRef.current.collectibles) {
        if (!item.collected && item.z > 40 && item.z < 110) {
          if (item.lane === playerLane) {
            if (item.type === 'coin') {
              item.collected = true;
              sounds.playCoin();
              stateRef.current.coins += 1;
              stateRef.current.score += 20 * stateRef.current.combo;
              setCoinsCollected(stateRef.current.coins);
              setScore(stateRef.current.score);
            } else if (item.type === 'xp') {
              item.collected = true;
              sounds.playXp();
              stateRef.current.combo = Math.min(4, stateRef.current.combo + 1);
              stateRef.current.score += 50 * stateRef.current.combo;
              setCombo(stateRef.current.combo);
              setScore(stateRef.current.score);
            } else if (item.type === 'obstacle') {
              if (!playerJumping) {
                // Hit obstacle -> finish run smoothly!
                stateRef.current.running = false;
                setGameState('completed');
                return;
              }
            }
          }
        }
      }

      // Clean off-screen items
      stateRef.current.collectibles = stateRef.current.collectibles.filter((it) => it.z > -50);

      // Win / completion condition (or reaches distance threshold for demo round)
      if (localDistance >= 300) {
        stateRef.current.running = false;
        setGameState('completed');
        return;
      }

      // DRAW CANVAS: VELOOP Reward City
      ctx.clearRect(0, 0, width, height);

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
      skyGrad.addColorStop(0, '#0c0e18');
      skyGrad.addColorStop(1, '#161b2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Futuristic Buildings Silhouette
      ctx.fillStyle = '#0f1424';
      ctx.fillRect(20, height * 0.25, 45, height * 0.35);
      ctx.fillRect(80, height * 0.18, 55, height * 0.42);
      ctx.fillRect(155, height * 0.22, 50, height * 0.38);
      ctx.fillRect(225, height * 0.15, 60, height * 0.45);
      ctx.fillRect(width - 120, height * 0.2, 50, height * 0.4);
      ctx.fillRect(width - 60, height * 0.27, 45, height * 0.33);

      // Neon window telemetry dots on buildings
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(95, height * 0.22, 4, 4);
      ctx.fillRect(110, height * 0.26, 4, 4);
      ctx.fillRect(240, height * 0.2, 4, 4);
      ctx.fillRect(width - 100, height * 0.25, 4, 4);

      // Horizon line
      const horizonY = height * 0.45;

      // 3D Ground Pathway
      const groundGrad = ctx.createLinearGradient(0, horizonY, 0, height);
      groundGrad.addColorStop(0, '#101422');
      groundGrad.addColorStop(1, '#090b13');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, horizonY, width, height - horizonY);

      // Perspective 3-Lane Track
      const trackTopW = width * 0.3;
      const trackBotW = width * 0.85;
      const trackTopLeft = (width - trackTopW) / 2;
      const trackTopRight = trackTopLeft + trackTopW;
      const trackBotLeft = (width - trackBotW) / 2;
      const trackBotRight = trackBotLeft + trackBotW;

      // Track background
      ctx.beginPath();
      ctx.moveTo(trackTopLeft, horizonY);
      ctx.lineTo(trackTopRight, horizonY);
      ctx.lineTo(trackBotRight, height);
      ctx.lineTo(trackBotLeft, height);
      ctx.closePath();
      ctx.fillStyle = '#171e33';
      ctx.fill();
      ctx.strokeStyle = '#283556';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Lane dividers (2 lines separating 3 lanes)
      for (let l = 1; l <= 2; l++) {
        const topX = trackTopLeft + (trackTopW * l) / 3;
        const botX = trackBotLeft + (trackBotW * l) / 3;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(botX, height);
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([15, 15]);
        ctx.lineDashOffset = -localDistance * 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Lane centers calculation function
      const getLaneX = (lane: number, z: number) => {
        const progress = Math.max(0, Math.min(1, (1000 - z) / 1000));
        const currentTopLeft = trackTopLeft;
        const currentBotLeft = trackBotLeft;
        const currentW = trackTopW + (trackBotW - trackTopW) * progress;
        const currentLeft = (width - currentW) / 2;
        const laneW = currentW / 3;
        return currentLeft + laneW * (lane + 0.5);
      };

      const getZScreenY = (z: number) => {
        const progress = Math.max(0, Math.min(1, (1000 - z) / 1000));
        return horizonY + (height - horizonY) * progress;
      };

      // Draw Collectibles & Obstacles
      for (const item of stateRef.current.collectibles) {
        if (item.collected || item.z < 0 || item.z > 1000) continue;
        const x = getLaneX(item.lane, item.z);
        const y = getZScreenY(item.z);
        const scale = Math.max(0.2, (1000 - item.z) / 1000);

        if (item.type === 'coin') {
          // VE Coin (Rotating gold coin)
          ctx.beginPath();
          ctx.arc(x, y - 10 * scale, 14 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#fbbf24';
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3 * scale;
          ctx.stroke();

          // Coin Symbol
          ctx.fillStyle = '#78350f';
          ctx.font = `bold ${Math.floor(10 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('VE', x, y - 10 * scale);
        } else if (item.type === 'xp') {
          // XP Orb (Glowing soft blue sphere)
          ctx.beginPath();
          ctx.arc(x, y - 12 * scale, 15 * scale, 0, Math.PI * 2);
          ctx.fillStyle = '#06b6d4';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2 * scale;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(9 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('XP', x, y - 12 * scale);
        } else if (item.type === 'obstacle') {
          // Energy Barricade
          const obsW = 50 * scale;
          const obsH = 26 * scale;
          ctx.fillStyle = '#be123c';
          ctx.fillRect(x - obsW / 2, y - obsH, obsW, obsH);
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 2 * scale;
          ctx.strokeRect(x - obsW / 2, y - obsH, obsW, obsH);

          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.floor(8 * scale)}px sans-serif`;
          ctx.textAlign = 'center';
          ctx.fillText('WARNING', x, y - obsH / 2);
        }
      }

      // Draw Player: VELOOP Guardian Runner
      const playerZ = 80;
      const playerScreenX = getLaneX(stateRef.current.lane, playerZ);
      const playerBaseY = getZScreenY(playerZ);
      const playerY = playerBaseY - stateRef.current.jumpY;

      // Shadow under character
      ctx.beginPath();
      ctx.ellipse(playerScreenX, playerBaseY, 22, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fill();

      // Guardian Runner Body
      // Suit
      ctx.fillStyle = '#111628';
      ctx.fillRect(playerScreenX - 12, playerY - 48, 24, 30);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(playerScreenX - 12, playerY - 48, 24, 30);

      // Gold VELOOP Chest emblem
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(playerScreenX - 6, playerY - 40);
      ctx.lineTo(playerScreenX, playerY - 30);
      ctx.lineTo(playerScreenX + 6, playerY - 40);
      ctx.closePath();
      ctx.fill();

      // Helmet & illuminated blue visor
      ctx.fillStyle = '#0f1424';
      ctx.beginPath();
      ctx.arc(playerScreenX, playerY - 56, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#1e293b';
      ctx.stroke();

      // Soft Blue Visor
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(playerScreenX - 8, playerY - 58, 16, 6);

      // Legs / animated running steps
      const stepOffset = Math.sin(localDistance * 0.8) * 8;
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(playerScreenX - 6, playerY - 18);
      ctx.lineTo(playerScreenX - 8, playerY + stepOffset);
      ctx.moveTo(playerScreenX + 6, playerY - 18);
      ctx.lineTo(playerScreenX + 8, playerY - stepOffset);
      ctx.stroke();

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [gameState]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-4xl bg-[#141828] border border-[#293252] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top Game Bar */}
        <div className="px-5 py-3.5 bg-[#101320] border-b border-[#222942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                VELOOP GUARDIAN RUN
              </h3>
              <span className="text-[11px] text-slate-400">Endless Skill Challenge &bull; +25 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState === 'playing' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191f34] border border-[#273252]">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 font-mono-numbers">{coinsCollected}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#191f34] border border-[#273252]">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-300 font-mono-numbers">COMBO x{combo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">SCORE</span>
                  <span className="text-xs font-bold text-white font-mono-numbers">{score}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => {
                sounds.playTap();
                onClose();
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gameplay Stage */}
        <div className="relative w-full h-[420px] sm:h-[480px] bg-[#0c0e18] flex items-center justify-center overflow-hidden">
          {/* Active Canvas */}
          <canvas
            ref={canvasRef}
            width={720}
            height={480}
            className="w-full h-full object-contain"
          />

          {/* STATE 1: PREVIEW STATE */}
          {gameState === 'preview' && (
            <div className="absolute inset-0 bg-[#121524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg">
                <Zap className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                VELOOP GUARDIAN RUN
              </h2>
              <p className="text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
                Pilot the VELOOP Guardian Runner through VELOOP Reward City. Switch lanes, leap over hazards, and collect VE coins to claim your tier reward.
              </p>

              {/* Controls hints */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 bg-[#0d101a] px-4 py-2.5 rounded-xl border border-[#1e253c]">
                <span>&larr; &rarr; or A / D : Switch Lanes</span>
                <span>&bull;</span>
                <span>Space / &uarr; : Jump Obstacles</span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START CHALLENGE</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: COUNTDOWN STATE */}
          {gameState === 'countdown' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-20">
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="font-heading text-6xl sm:text-7xl font-black text-amber-300 font-mono-numbers drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]"
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-4">
                PREPARE FOR INGRESS
              </span>
            </div>
          )}

          {/* STATE 3: COMPLETED / REWARD STATE */}
          {gameState === 'completed' && (
            <div className="absolute inset-0 bg-[#0e111d]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                CHALLENGE COMPLETE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                VELOOP Guardian Run
              </h3>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 my-5 max-w-sm w-full bg-[#141829] p-4 rounded-xl border border-[#262f4c]">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Final Score</span>
                  <span className="text-base font-bold text-white font-mono-numbers">{score}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">Distance</span>
                  <span className="text-base font-bold text-cyan-300 font-mono-numbers">{distance}m</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block">VE Coins</span>
                  <span className="text-base font-bold text-amber-300 font-mono-numbers">{coinsCollected}</span>
                </div>
              </div>

              {/* Reward Reveal */}
              <div className="bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-blue-500/15 border border-amber-500/40 px-5 py-3 rounded-xl mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-xs font-bold text-amber-300">+25 XP REWARD EARNED</span>
                  <p className="text-[11px] text-slate-400">Transferring XP directly to your VELOOP Level-Up bar</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    sounds.playCoin();
                    onGameComplete(25, score);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
                >
                  Claim +25 XP & Return
                </button>
                <button
                  onClick={handleStart}
                  className="px-4 py-2.5 rounded-xl bg-[#1e253d] hover:bg-[#283252] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile On-Screen Touch Controls (shown on small devices or for accessibility) */}
        <div className="p-3 bg-[#111422] border-t border-[#20263d] flex sm:hidden items-center justify-around">
          <button
            onClick={() => switchLane('left')}
            className="p-3 rounded-xl bg-[#1c223a] active:bg-[#2b3558] text-white border border-[#2c375c]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={jump}
            className="px-6 py-3 rounded-xl bg-cyan-500 active:bg-cyan-400 text-black font-bold flex items-center gap-1"
          >
            <ArrowUp className="w-5 h-5" />
            <span>JUMP</span>
          </button>
          <button
            onClick={() => switchLane('right')}
            className="p-3 rounded-xl bg-[#1c223a] active:bg-[#2b3558] text-white border border-[#2c375c]"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
