import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Award, Coins, Zap, Shield, Sparkles, Gem, Gift, Check } from 'lucide-react';
import { sounds } from '../../utils/sound';

interface RewardMatchGameProps {
  onClose: () => void;
  onGameComplete: (earnedXp: number, score: number) => void;
}

interface MatchCard {
  id: number;
  type: string;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
  color: string;
}

const CARD_TYPES = [
  { type: 'coin', name: 'VE Coin', color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
  { type: 'xp', name: 'XP Orb', color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10' },
  { type: 'chest', name: 'Reward Chest', color: 'text-purple-400 border-purple-500/40 bg-purple-500/10' },
  { type: 'gem', name: 'Guardian Gem', color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
  { type: 'token', name: 'VELOOP Token', color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' },
  { type: 'badge', name: 'Apex Badge', color: 'text-rose-400 border-rose-500/40 bg-rose-500/10' },
];

export const RewardMatchGame: React.FC<RewardMatchGameProps> = ({ onClose, onGameComplete }) => {
  const [gameState, setGameState] = useState<'preview' | 'countdown' | 'playing' | 'completed'>('preview');
  const [countdown, setCountdown] = useState<number>(3);
  const [cards, setCards] = useState<MatchCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const initDeck = () => {
    // Generate pairs
    const deck: MatchCard[] = [];
    let id = 1;
    CARD_TYPES.forEach((item) => {
      // Add pair
      deck.push({ id: id++, type: item.type, name: item.name, isFlipped: false, isMatched: false, color: item.color });
      deck.push({ id: id++, type: item.type, name: item.name, isFlipped: false, isMatched: false, color: item.color });
    });
    // Shuffle
    return deck.sort(() => Math.random() - 0.5);
  };

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
    setCards(initDeck());
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setSeconds(0);
    setGameState('playing');

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
  };

  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    const card = cards[index];
    if (card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    sounds.playTap();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.type === secondCard.type) {
        // MATCH!
        sounds.playCoin();
        setTimeout(() => {
          firstCard.isMatched = true;
          secondCard.isMatched = true;
          setCards([...newCards]);
          setFlippedCards([]);
          setMatches((m) => {
            const nextMatch = m + 1;
            if (nextMatch === CARD_TYPES.length) {
              // ALL MATCHED
              if (timerRef.current) clearInterval(timerRef.current);
              sounds.playLevelUp();
              setGameState('completed');
            }
            return nextMatch;
          });
        }, 300);
      } else {
        // NO MATCH -> Flip back after delay
        setTimeout(() => {
          firstCard.isFlipped = false;
          secondCard.isFlipped = false;
          setCards([...newCards]);
          setFlippedCards([]);
        }, 900);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const renderIcon = (type: string) => {
    switch (type) {
      case 'coin':
        return <Coins className="w-6 h-6 sm:w-7 sm:h-7 text-amber-400" />;
      case 'xp':
        return <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-cyan-400" />;
      case 'chest':
        return <Gift className="w-6 h-6 sm:w-7 sm:h-7 text-purple-400" />;
      case 'gem':
        return <Gem className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />;
      case 'token':
        return <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />;
      case 'badge':
        return <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-rose-400" />;
      default:
        return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="w-full max-w-2xl bg-[#141828] border border-[#293252] rounded-3xl overflow-hidden shadow-2xl flex flex-col relative">
        {/* Top bar */}
        <div className="px-5 py-3.5 bg-[#101320] border-b border-[#222942] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-pulse" />
            <div>
              <h3 className="font-heading font-black text-sm sm:text-base text-white">
                REWARD MATCH
              </h3>
              <span className="text-[11px] text-slate-400">Memory Pairs Challenge &bull; +25 XP</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {gameState === 'playing' && (
              <div className="flex items-center gap-3">
                <div className="px-2.5 py-1 rounded-lg bg-[#181f33] border border-[#263150] text-xs font-bold text-slate-300 font-mono-numbers">
                  MOVES: {moves}
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#181f33] border border-[#263150] text-xs font-bold text-cyan-300 font-mono-numbers">
                  TIME: {seconds}s
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#181f33] border border-[#263150] text-xs font-bold text-amber-300 font-mono-numbers">
                  PAIRS: {matches}/6
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

        {/* Gameplay Area */}
        <div className="p-4 sm:p-6 bg-[#0e111d] min-h-[400px] flex items-center justify-center relative select-none">
          {/* STATE 1: PREVIEW */}
          {gameState === 'preview' && (
            <div className="absolute inset-0 bg-[#121524]/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 shadow-lg">
                <Gift className="w-8 h-8" />
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl font-black text-white">
                REWARD MATCH
              </h2>
              <p className="text-sm text-slate-300 max-w-md mt-2 leading-relaxed">
                Flip the elegant reward cards to uncover matching pairs of VELOOP assets under the timer. Clean pairs earn +25 XP.
              </p>

              <div className="mt-6">
                <button
                  onClick={handleStart}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-sm shadow-lg shadow-purple-500/25 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>START MATCHING</span>
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
                SHUFFLING REWARD VAULT
              </span>
            </div>
          )}

          {/* STATE 3: PLAYING (4x3 Grid of Cards) */}
          {gameState === 'playing' && (
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 w-full max-w-lg mx-auto">
              {cards.map((card, idx) => {
                const isOpen = card.isFlipped || card.isMatched;
                return (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className="aspect-square cursor-pointer perspective-1000"
                  >
                    <motion.div
                      animate={{ rotateY: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.35 }}
                      className="w-full h-full relative rounded-2xl transition-all preserve-3d"
                    >
                      {/* Card Back (Hidden state) */}
                      <div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-[#1c233a] to-[#121626] border border-[#2b3558] hover:border-cyan-400/50 flex flex-col items-center justify-center backface-hidden shadow-md`}
                      >
                        <Shield className="w-6 h-6 text-slate-600" />
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                          VELOOP
                        </span>
                      </div>

                      {/* Card Front (Revealed state) */}
                      <div
                        className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center backface-hidden rotate-y-180 shadow-lg ${
                          card.isMatched
                            ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300'
                            : 'bg-[#182035] border-cyan-400 text-white'
                        }`}
                      >
                        {renderIcon(card.type)}
                        <span className="text-[9px] font-bold text-slate-300 mt-1 truncate px-1 text-center">
                          {card.name}
                        </span>
                        {card.isMatched && (
                          <Check className="w-3 h-3 text-emerald-400 absolute top-1.5 right-1.5" />
                        )}
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          )}

          {/* STATE 4: COMPLETED */}
          {gameState === 'completed' && (
            <div className="absolute inset-0 bg-[#0e111d]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-20">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                CHALLENGE COMPLETE
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                Reward Match
              </h3>

              <div className="grid grid-cols-2 gap-3 my-4 max-w-xs w-full bg-[#141829] p-4 rounded-xl border border-[#262f4c]">
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Total Moves</span>
                  <span className="text-lg font-bold text-white font-mono-numbers">{moves}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase block">Time Taken</span>
                  <span className="text-lg font-bold text-cyan-300 font-mono-numbers">{seconds}s</span>
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
                    onGameComplete(25, 100 - moves);
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
