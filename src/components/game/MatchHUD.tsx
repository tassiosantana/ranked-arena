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
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4"
      >
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 bg-secondary rounded-full flex items-center justify-center hover:bg-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Team A */}
        <div className="flex items-center">
          <div className="score-box bg-team-a text-white mr-2">
            <span>{teamAName}</span>
          </div>
          <div className="score-box bg-secondary border-2 border-team-a">
            {scoreA}
          </div>
        </div>

        {/* VS */}
        <span className="font-display text-xl font-bold text-muted-foreground">VS</span>

        {/* Team B */}
        <div className="flex items-center">
          <div className="score-box bg-secondary border-2 border-team-b">
            {scoreB}
          </div>
          <div className="score-box bg-team-b text-white ml-2">
            <span>{teamBName}</span>
          </div>
        </div>
      </motion.div>

      {/* Countdown */}
      <AnimatePresence>
        {countdown !== undefined && countdown > 0 && (
          <motion.div
            key={countdown}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="relative">
              {/* Glowing Circle */}
              <div className="w-40 h-40 rounded-full border-4 border-primary flex items-center justify-center animate-pulse-glow">
                <span className="font-display text-7xl font-bold text-white">{countdown}</span>
              </div>
              {/* Outer Ring */}
              <div className="absolute inset-0 w-40 h-40 rounded-full border-2 border-primary/30 animate-ping" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
