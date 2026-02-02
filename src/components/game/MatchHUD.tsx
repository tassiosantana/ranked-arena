import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface MatchHUDProps {
  teamAName: string;
  teamBName: string;
  scoreA: number;
  scoreB: number;
  countdown?: number;
  onClose?: () => void;
}

export function MatchHUD({ teamAName, teamBName, scoreA, scoreB, countdown, onClose }: MatchHUDProps) {
  return (
    <>
      {/* Close Button - fora do fluxo para não deslocar o centro */}
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[60] w-6 h-6 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Top Bar - grid 3 colunas para VS ficar exatamente no centro da tela */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-0 right-0 z-50 px-4 md:px-12"
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 max-w-4xl mx-auto">
          {/* Team A - alinhado à direita da coluna esquerda */}
          <div className="flex items-center justify-end gap-2">
            <div className="score-box bg-team-a text-white flex items-center justify-center">
              <span>{teamAName}</span>
            </div>
            <div className="score-box bg-secondary border-2 border-team-a min-w-[3rem] flex items-center justify-center">
              {scoreA}
            </div>
          </div>

          {/* VS - sempre no centro exato */}
          <span className="font-display text-xl font-bold text-muted-foreground text-center shrink-0">
            VS
          </span>

          {/* Team B - alinhado à esquerda da coluna direita */}
          <div className="flex items-center justify-start gap-2">
            <div className="score-box bg-secondary border-2 border-team-b min-w-[3rem] flex items-center justify-center">
              {scoreB}
            </div>
            <div className="score-box bg-team-b text-white flex items-center justify-center">
              <span>{teamBName}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Countdown - centralizado exatamente no meio da viewport */}
      <AnimatePresence>
        {countdown !== undefined && countdown > 0 && (
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              key={countdown}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="pointer-events-auto"
            >
              <div className="relative">
                {/* Glowing Circle */}
                <div className="w-40 h-40 rounded-full border-4 border-primary flex items-center justify-center animate-pulse-glow">
                  <span className="font-display text-7xl font-bold text-white tabular-nums">{countdown}</span>
                </div>
                {/* Outer Ring */}
                <div className="absolute inset-0 w-40 h-40 rounded-full border-2 border-primary/30 animate-ping" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
