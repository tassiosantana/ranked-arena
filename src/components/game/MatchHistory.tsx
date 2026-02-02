import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

interface Match {
  id: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  mode: string;
  prize: number;
  won: boolean;
}

interface MatchHistoryProps {
  matches: Match[];
}

export function MatchHistory({ matches }: MatchHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <div className="flex items-center justify-between gap-4 mb-4 w-full">
        <span className="flex-1 text-right text-destructive font-display font-bold text-lg">PERDEDOR</span>
        <h2 className="flex-shrink-0 font-display text-2xl font-bold uppercase tracking-wider px-4">HISTÓRICOS</h2>
        <span className="flex-1 text-left text-victory font-display font-bold text-lg">VITÓRIA</span>
      </div>

      <div className="space-y-3">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, x: match.won ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`player-row ${match.won ? "glow-victory" : "glow-defeat"}`}
          >
            <div className={`w-10 h-10 rounded flex items-center justify-center ${match.won ? "bg-victory/20" : "bg-destructive/20"}`}>
              {match.won ? (
                <Check className="w-5 h-5 text-victory" />
              ) : (
                <X className="w-5 h-5 text-destructive" />
              )}
            </div>

            <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4 min-w-0">
              <div className="min-w-0">
                <span className="font-semibold">{match.teamA}</span>
                <span className="text-xs text-muted-foreground ml-2">MODO: {match.mode}</span>
              </div>

              <div className="flex items-center justify-center gap-2 shrink-0">
                <span className="font-display text-2xl tabular-nums">{match.scoreA}</span>
                <span className="text-muted-foreground">-</span>
                <span className="font-display text-2xl tabular-nums">{match.scoreB}</span>
              </div>

              <div className="flex items-center justify-end gap-4 min-w-0">
                <span className="font-semibold">{match.teamB}</span>
                <div className={`px-3 py-1 rounded shrink-0 ${match.won ? "bg-victory/20 text-victory" : "bg-destructive/20 text-destructive"}`}>
                  ${match.prize}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
