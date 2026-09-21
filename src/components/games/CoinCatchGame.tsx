import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Award, Coins, Zap, Clock, ShieldAlert } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface CoinCatchGameProps {
  onClose: () => void;
  onGameComplete: (earnedXp: number, score: number) => void;
}

interface FallingObject {
  id: number;
  x: number;
  y: number;
  speed: number;
  type: 'coin' | 'xp' | 'bonus' | 'hazard';
  size: number;
}

interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
}

export const CoinCatchGame: React.FC<CoinCatchGameProps> = ({ onClose, onGameComplete }) => {
  const [gameState, setGameState] = useState<'preview' | 'countdown' | 'playing' | 'completed'>('preview');
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [collectorX, setCollectorX] = useState<number>(50); // percentage 0-100
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stateRef = useRef({
    collectorX: 50,
    score: 0,
    combo: 1,
    timeLeft: 20,
    running: false,
    objects: [] as FallingObject[],
    nextId: 1,
    floatingId: 1,
  });

  const handleStart = () => {
    sounds.playTap();
    setGameState('countdown');
    setCountdown(3);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        sounds.playTap();
        setCountdown(count);
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
    setCombo(1);
    setTimeLeft(20);
    setFloatingTexts([]);

    stateRef.current = {
      collectorX: 50,
      score: 0,
      combo: 1,
      timeLeft: 20,
      running: true,
      objects: [],
      nextId: 1,
      floatingId: 1,
    };

    // 20 second timer countdown
    timerRef.current = setInterval(() => {
      stateRef.current.timeLeft -= 1;
      setTimeLeft(stateRef.current.timeLeft);

      if (stateRef.current.timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        stateRef.current.running = false;
        sounds.playLevelUp();
        setGameState('completed');
      }
    }, 1000);
  };

  // Mouse / Touch movement for collector
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, relativeX));
    stateRef.current.collectorX = clampedX;
    setCollectorX(clampedX);
  };

  // Keyboard navigation for collector
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        stateRef.current.collectorX = Math.max(8, stateRef.current.collectorX - 6);
        setCollectorX(stateRef.current.collectorX);
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        stateRef.current.collectorX = Math.min(92, stateRef.current.collectorX + 6);
        setCollectorX(stateRef.current.collectorX);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Main game physics loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    let lastSpawn = Date.now();

    const loop = () => {
      if (!stateRef.current.running) return;

      const now = Date.now();
      const spawnInterval = Math.max(280, 600 - (20 - stateRef.current.timeLeft) * 15);

      // Spawn falling objects
      if (now - lastSpawn > spawnInterval) {
        lastSpawn = now;
        const roll = Math.random();
        let type: FallingObject['type'] = 'coin';
        if (roll < 0.45) type = 'coin';
        else if (roll < 0.75) type = 'xp';
        else if (roll < 0.88) type = 'bonus';
        else type = 'hazard';

        stateRef.current.objects.push({
          id: stateRef.current.nextId++,
          x: 10 + Math.random() * 80,
          y: 0,
          speed: 1.2 + Math.random() * 1.5 + (20 - stateRef.current.timeLeft) * 0.05,
          type,
          size: type === 'bonus' ? 36 : 28,
        });
      }

      // Move objects and check collisions with collector at bottom (y ~ 82% to 92%)
      const collectorPos = stateRef.current.collectorX;
      const remainingObjects: FallingObject[] = [];

      for (const obj of stateRef.current.objects) {
        obj.y += obj.speed;

        // Check catch collision
        if (obj.y >= 80 && obj.y <= 90) {
          const dist = Math.abs(obj.x - collectorPos);
          if (dist < 11) {
            // Caught!
            if (obj.type === 'coin') {
              sounds.playCoin();
              const pts = 5 * stateRef.current.combo;
              stateRef.current.score += pts;
              addFloatText(`+${pts} VE`, obj.x, 80, '#fbbf24');
            } else if (obj.type === 'xp') {
              sounds.playXp();
              stateRef.current.combo = Math.min(5, stateRef.current.combo + 1);
              setCombo(stateRef.current.combo);
              const pts = 10 * stateRef.current.combo;
              stateRef.current.score += pts;
              addFloatText(`+${pts} XP`, obj.x, 80, '#38bdf8');
            } else if (obj.type === 'bonus') {
              sounds.playXp();
              const pts = 25 * stateRef.current.combo;
              stateRef.current.score += pts;
              addFloatText(`+${pts} BONUS!`, obj.x, 80, '#f59e0b');
            } else if (obj.type === 'hazard') {
              sounds.playTap();
              stateRef.current.combo = 1;
              setCombo(1);
              stateRef.current.score = Math.max(0, stateRef.current.score - 15);
              addFloatText(`-15 HAZARD!`, obj.x, 80, '#f43f5e');
            }

            setScore(stateRef.current.score);
            continue; // Skip adding to remaining
          }
        }

        if (obj.y < 100) {
          remainingObjects.push(obj);
        }
      }

      stateRef.current.objects = remainingObjects;
      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const addFloatText = (text: string, x: number, y: number, color: string) => {
    const id = stateRef.current.floatingId++;
    setFloatingTexts((prev) => [...prev.slice(-6), { id, text, x, y, color }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-3xl bg-[#141828] border border-[#293252] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top Header */}
        <div className="px-5 py-3.5 bg-[#101320] border-b border-[#222942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                VE COIN CATCH
              </h3>
              <span className="text-[11px] text-slate-400">Reflex & Precision Challenge &bull; +25 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState === 'playing' && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181f33] border border-[#263150] text-amber-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-mono-numbers">{timeLeft}s</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#181f33] border border-[#263150] text-cyan-300">
                  <Zap className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold font-mono-numbers">x{combo}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">SCORE</span>
                  <span className="text-sm font-bold text-white font-mono-numbers">{score}</span>
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

        {/* Gameplay Stage Container */}
        <div
          ref={containerRef}
          onPointerMove={handlePointerMove}
          className="relative w-full h-[400px] sm:h-[460px] bg-gradient-to-b from-[#0e111d] via-[#121524] to-[#0a0c16] overflow-hidden select-none cursor-crosshair"
        >
          {/* Background grid lines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

          {/* Falling Items rendering */}
          {gameState === 'playing' &&
            stateRef.current.objects.map((obj) => (
              <div
                key={obj.id}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute pointer-events-none transition-transform"
              >
                {obj.type === 'coin' && (
                  <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/30 text-black font-black text-[10px]">
                    VE
                  </div>
                )}
                {obj.type === 'xp' && (
                  <div className="w-8 h-8 rounded-full bg-cyan-400 border-2 border-white flex items-center justify-center shadow-lg shadow-cyan-500/40 text-black font-black text-[10px]">
                    XP
                  </div>
                )}
                {obj.type === 'bonus' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-white flex items-center justify-center shadow-xl shadow-amber-500/50 text-black font-black text-xs">
                    ★
                  </div>
                )}
                {obj.type === 'hazard' && (
                  <div className="w-7 h-7 rounded-lg bg-rose-600 border-2 border-rose-400 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-rose-600/40 rotate-45">
                    ✕
                  </div>
                )}
              </div>
            ))}

          {/* Floating score text micro-animations */}
          {floatingTexts.map((f) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -25, scale: 1.2 }}
              transition={{ duration: 0.5 }}
              style={{
                left: `${f.x}%`,
                top: `${f.y}%`,
                color: f.color,
              }}
              className="absolute font-black text-xs pointer-events-none drop-shadow-md z-30 font-mono-numbers"
            >
              {f.text}
            </motion.div>
          ))}

          {/* Player VELOOP Collector Drone/Basket at bottom */}
          {gameState === 'playing' && (
            <div
              style={{
                left: `${collectorX}%`,
                top: '86%',
                transform: 'translateX(-50%)',
              }}
              className="absolute pointer-events-none transition-all duration-75 flex flex-col items-center"
            >
              {/* Magnetic collector beam */}
              <div className="w-20 h-3 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-500/40 flex items-center justify-center">
                <div className="w-16 h-1 bg-white/60 rounded-full" />
              </div>
              <div className="w-12 h-4 bg-[#1b233a] border border-cyan-500/40 rounded-b-xl flex items-center justify-center text-[9px] font-bold text-cyan-300">
                VELOOP
              </div>
            </div>
          )}

          {/* STATE 1: PREVIEW */}
          {gameState === 'preview' && (
            <div className="absolute inset-0 bg-[#121524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-lg">
                <Coins className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                VE COIN CATCH
              </h2>
              <p className="text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
                Catch falling VE coins and XP orbs with the VELOOP collector while dodging red hazard penalties. You have 20 seconds to maximize your score!
              </p>

              <div className="mt-5 flex items-center gap-4 text-xs text-slate-400 bg-[#0d101a] px-4 py-2 rounded-xl border border-[#1e253c]">
                <span>Move mouse / Drag finger or use &larr; &rarr;</span>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm shadow-lg shadow-amber-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START 20s SPRINT</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: COUNTDOWN */}
          {gameState === 'countdown' && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center z-20">
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="font-heading text-6xl sm:text-7xl font-black text-amber-300 font-mono-numbers"
              >
                {countdown > 0 ? countdown : 'GO!'}
              </motion.span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mt-4">
                CALIBRATING COLLECTOR
              </span>
            </div>
          )}

          {/* STATE 3: COMPLETED */}
          {gameState === 'completed' && (
            <div className="absolute inset-0 bg-[#0e111d]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                CHALLENGE COMPLETE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                VE Coin Catch
              </h3>

              <div className="bg-[#141829] p-4 rounded-xl border border-[#262f4c] my-4 max-w-xs w-full">
                <span className="text-xs text-slate-400 uppercase block">Final Score</span>
                <span className="text-2xl font-black text-amber-300 font-mono-numbers">{score}</span>
              </div>

              <div className="bg-gradient-to-r from-amber-500/15 via-cyan-500/15 to-blue-500/15 border border-amber-500/40 px-5 py-3 rounded-xl mb-6 flex items-center gap-3">
                <Zap className="w-5 h-5 text-amber-400" />
                <div className="text-left">
                  <span className="text-xs font-bold text-amber-300">+25 XP DEMO REWARD</span>
                  <p className="text-[11px] text-slate-400">Transferred to VELOOP Level-Up bar</p>
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
      </div>
    </div>
  );
};
