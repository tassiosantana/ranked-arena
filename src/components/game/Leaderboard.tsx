import { motion } from "framer-motion";
import { RankBadge } from "./RankBadge";
import { Rank } from "@/lib/ranks";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar?: string;
  winRate: number;
  kills: number;
  playerRank: Rank;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

export function Leaderboard({ entries }: LeaderboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
    >
      {/* Header */}
      <div className="btn-gaming text-center mb-4">
        <span className="text-sm">LEADERBOARD</span>
      </div>

      {/* Column Headers */}
      <div className="grid grid-cols-5 gap-2 px-4 py-2 text-xs text-muted-foreground uppercase">
        <span>Pos</span>
        <span>Nome</span>
        <span className="text-center">Patente</span>
        <span className="text-center">Win%</span>
        <span className="text-center">Kills</span>
      </div>

      {/* Entries */}
      <div className="space-y-2 p-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="player-row grid grid-cols-5 gap-2 items-center"
          >
            <div className="rank-badge text-sm w-8 h-8">{entry.rank}</div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-secondary overflow-hidden flex-shrink-0">
                {entry.avatar ? (
                  <img src={entry.avatar} alt={entry.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-primary">
                    {entry.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="font-semibold truncate text-sm">{entry.name}</span>
            </div>
            <div className="flex justify-center">
              <RankBadge rank={entry.playerRank} size="sm" />
            </div>
            <span className="text-center font-display text-sm">{entry.winRate.toFixed(1)}%</span>
            <span className="text-center font-display text-sm">{entry.kills}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
