import { motion } from "framer-motion";
import { RankBadge } from "./RankBadge";
import { RankProgress } from "./RankProgress";
import { Rank } from "@/lib/ranks";

interface PlayerStats {
  kills: number;
  deaths: number;
  wins: number;
  losses: number;
  kd: number;
  winRate: number;
}

interface PlayerCardProps {
  name: string;
  id: number;
  avatar?: string;
  stats: PlayerStats;
  rank: Rank;
  xp: number;
}

export function PlayerCard({ name, id, avatar, stats, rank, xp }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6"
    >
      {/* Player Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-lg bg-secondary overflow-hidden glow-border">
          {avatar ? (
            <img src={avatar} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold">{name}</h2>
          <p className="text-muted-foreground text-sm">ID: {id}</p>
        </div>
        <RankBadge rank={rank} size="lg" />
      </div>

      {/* Rank Progress */}
      <div className="mb-4 p-3 bg-secondary/30 rounded">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{rank.name}</span>
        </div>
        <RankProgress rank={rank} xp={xp} />
      </div>

      {/* Stats Header */}
      <div className="btn-gaming mb-4 text-center">
        <span className="text-sm">SUAS ESTATÍSTICAS</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">Abates</p>
          <p className="stat-value text-foreground">{stats.kills}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">Mortes</p>
          <p className="stat-value text-foreground">{stats.deaths}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">Vitória</p>
          <p className="stat-value text-foreground">{stats.wins}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">Perdas</p>
          <p className="stat-value text-foreground">{stats.losses}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">K/D</p>
          <p className="stat-value text-primary">{stats.kd.toFixed(2)}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm uppercase">Rate</p>
          <p className="stat-value text-primary">{stats.winRate.toFixed(1)}%</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Informações atualizadas a cada partida jogada.
      </p>
    </motion.div>
  );
}
