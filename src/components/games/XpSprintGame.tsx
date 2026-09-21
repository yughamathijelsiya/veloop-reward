import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Award, Zap, Clock, Flame, Target } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface XpSprintGameProps {
  onClose: () => void;
  onGameComplete: (earnedXp: number, score: number) => void;
}

interface XpNode {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  lifetimeMs: number;
  spawnTime: number;
  type: 'standard' | 'super' | 'bonus';
}

interface FloatingHit {
  id: number;
  text: string;
  x: number;
  y: number;
}

export const XpSprintGame: React.FC<XpSprintGameProps> = ({ onClose, onGameComplete }) => {
  const [gameState, setGameState] = useState<'preview' | 'countdown' | 'playing' | 'completed'>('preview');
  const [countdown, setCountdown] = useState<number>(3);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [maxCombo, setMaxCombo] = useState<number>(1);
  const [nodes, setNodes] = useState<XpNode[]>([]);
  const [floatingHits, setFloatingHits] = useState<FloatingHit[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);
  const nextId = useRef<number>(1);
  const hitId = useRef<number>(1);

  const stateRef = useRef({
    running: false,
    score: 0,
    combo: 1,
    maxCombo: 1,
    timeLeft: 15,
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
    setMaxCombo(1);
    setTimeLeft(15);
    setNodes([]);
    setFloatingHits([]);

    stateRef.current = {
      running: true,
      score: 0,
      combo: 1,
      maxCombo: 1,
      timeLeft: 15,
    };

    // Countdown clock (15s sprint)
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      stateRef.current.timeLeft -= 1;
      setTimeLeft(stateRef.current.timeLeft);

      if (stateRef.current.timeLeft <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        stateRef.current.running = false;
        sounds.playLevelUp();
        setGameState('completed');
      }
    }, 1000);

    // Spawner routine
    scheduleSpawns();
  };

  const scheduleSpawns = () => {
    const spawnCycle = () => {
      if (!stateRef.current.running) return;

      const roll = Math.random();
      const nodeType: XpNode['type'] = roll < 0.7 ? 'standard' : roll < 0.9 ? 'super' : 'bonus';
      const id = nextId.current++;

      const newNode: XpNode = {
        id,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 70,
        size: nodeType === 'bonus' ? 64 : nodeType === 'super' ? 56 : 48,
        lifetimeMs: nodeType === 'bonus' ? 1000 : 1300,
        spawnTime: Date.now(),
        type: nodeType,
      };

      setNodes((prev) => [...prev.slice(-4), newNode]);

      // Auto disappear if not clicked
      setTimeout(() => {
        setNodes((prev) => prev.filter((n) => n.id !== id));
      }, newNode.lifetimeMs);

      // Recursive loop with increasing tempo
      const nextDelay = Math.max(300, 650 - (15 - stateRef.current.timeLeft) * 20);
      spawnRef.current = setTimeout(spawnCycle, nextDelay);
    };

    spawnCycle();
  };

  const handleNodeTap = (node: XpNode, e: React.MouseEvent) => {
    e.stopPropagation();
    if (gameState !== 'playing') return;

    sounds.playXp();

    // Calculate score
    const basePts = node.type === 'bonus' ? 30 : node.type === 'super' ? 20 : 10;
    const pts = basePts * stateRef.current.combo;
    stateRef.current.score += pts;
    setScore(stateRef.current.score);

    // Increment combo
    stateRef.current.combo += 1;
    setCombo(stateRef.current.combo);
    if (stateRef.current.combo > stateRef.current.maxCombo) {
      stateRef.current.maxCombo = stateRef.current.combo;
      setMaxCombo(stateRef.current.combo);
    }

    // Remove node
    setNodes((prev) => prev.filter((n) => n.id !== node.id));

    // Add floating text
    const hitIdNum = hitId.current++;
    setFloatingHits((prev) => [
      ...prev,
      { id: hitIdNum, text: `+${pts} XP (x${stateRef.current.combo})`, x: node.x, y: node.y },
    ]);
    setTimeout(() => {
      setFloatingHits((prev) => prev.filter((h) => h.id !== hitIdNum));
    }, 600);
  };

  const handleMiss = () => {
    if (gameState !== 'playing') return;
    // reset combo on screen miss
    stateRef.current.combo = 1;
    setCombo(1);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearTimeout(spawnRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#141828] border border-[#293252] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#101320] border-b border-[#222942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                XP SPRINT
              </h3>
              <span className="text-[11px] text-slate-400">High-Speed Reaction Pulse &bull; +25 XP</span>
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
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold font-mono-numbers">x{combo}</span>
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

        {/* Tap Radar Field */}
        <div
          onClick={handleMiss}
          className="relative w-full h-[380px] sm:h-[440px] bg-gradient-to-b from-[#0e111d] to-[#121625] overflow-hidden select-none cursor-pointer"
        >
          {/* Radar background grid */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-72 h-72 rounded-full border border-cyan-500" />
            <div className="w-48 h-48 rounded-full border border-cyan-500" />
            <div className="w-24 h-24 rounded-full border border-cyan-500" />
          </div>

          {/* Active Tap Targets */}
          {gameState === 'playing' &&
            nodes.map((node) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={(e) => handleNodeTap(node, e)}
                className="absolute z-10 cursor-pointer active:scale-95 transition-transform"
              >
                <div
                  className={`rounded-full flex flex-col items-center justify-center border-2 shadow-lg ${
                    node.type === 'bonus'
                      ? 'w-16 h-16 bg-amber-500/30 border-amber-400 text-amber-300 shadow-amber-500/50'
                      : node.type === 'super'
                      ? 'w-14 h-14 bg-cyan-500/30 border-cyan-400 text-cyan-300 shadow-cyan-500/50'
                      : 'w-12 h-12 bg-blue-600/30 border-blue-400 text-white shadow-blue-500/40'
                  }`}
                >
                  <Zap className="w-5 h-5 animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-wider">
                    {node.type === 'bonus' ? '+30 XP' : node.type === 'super' ? '+20 XP' : '+10 XP'}
                  </span>
                </div>
              </motion.div>
            ))}

          {/* Floating score hit texts */}
          {floatingHits.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              style={{ left: `${h.x}%`, top: `${h.y}%` }}
              className="absolute pointer-events-none text-xs font-black text-cyan-300 drop-shadow-md z-30 font-mono-numbers"
            >
              {h.text}
            </motion.div>
          ))}

          {/* STATE 1: PREVIEW */}
          {gameState === 'preview' && (
            <div className="absolute inset-0 bg-[#121524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-lg">
                <Target className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                XP SPRINT
              </h2>
              <p className="text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
                Pulsing XP nodes materialize across the radar. Tap them swiftly before they dissipate. Build your combo streak for exponential multipliers!
              </p>

              <div className="mt-6">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-black text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>START 15s SPRINT</span>
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
                RADAR SYNCHRONIZING
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
                XP SPRINT COMPLETE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                Reaction Mastery
              </h3>

              <div className="grid grid-cols-2 gap-3 my-4 max-w-xs w-full bg-[#141829] p-4 rounded-xl border border-[#262f4c]">
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Total Score</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">{score}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Best Combo</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono-numbers">x{maxCombo}</span>
                </div>
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
