import { motion } from "framer-motion";
import { Users, Play, LogOut, Crown, X } from "lucide-react";
import { RankBadge } from "./RankBadge";
import { RankProgress } from "./RankProgress";
import { Rank } from "@/lib/ranks";

interface LobbyPlayer {
  id: number;
  name: string;
  ready: boolean;
  rank: Rank;
  xp: number;
  isLeader: boolean;
}

interface LobbyPanelProps {
  players: LobbyPlayer[];
  maxPlayers: number;
  onReady: () => void;
  onLeave: () => void;
  onRemovePlayer?: (playerId: number) => void;
  isReady: boolean;
  isLeader: boolean;
  currentPlayerId: number;
}

export function LobbyPanel({ 
  players, 
  maxPlayers, 
  onReady, 
  onLeave, 
  onRemovePlayer,
  isReady, 
  isLeader,
  currentPlayerId 
}: LobbyPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-panel p-6"
    >
      <h2 className="font-display text-xl font-bold mb-4 uppercase tracking-wider flex items-center gap-2">
        <Users className="w-5 h-5" />
        LOBBY
        <span className="text-primary">
          {players.length}/{maxPlayers}
        </span>
      </h2>

      <div className="space-y-3 mb-6">
        {Array.from({ length: maxPlayers }).map((_, index) => {
          const player = players[index];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-3 rounded bg-card/60 border-l-4 transition-all duration-200
                ${player?.ready ? "border-l-victory" : player ? "border-l-primary" : "border-l-muted"}
              `}
            >
              {player ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded bg-secondary flex items-center justify-center text-sm font-bold relative">
                      {player.name.charAt(0).toUpperCase()}
                      {player.isLeader && (
                        <Crown className="w-3 h-3 text-primary absolute -top-1 -right-1" />
                      )}
                    </div>
                    
                    {/* Rank Badge */}
                    <RankBadge rank={player.rank} size="sm" />
                    
                    {/* Name & Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold truncate">{player.name}</span>
                        {player.ready && (
                          <span className="text-xs text-victory uppercase font-bold">✓ Pronto</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{player.rank.name}</p>
                    </div>

                    {/* Remove button for leader */}
                    {isLeader && player.id !== currentPlayerId && onRemovePlayer && (
                      <button
                        onClick={() => onRemovePlayer(player.id)}
                        className="p-1 hover:bg-destructive/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    )}
                  </div>
                  
                  {/* XP Progress */}
                  <RankProgress rank={player.rank} xp={player.xp} showLabels={false} />
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 rounded bg-muted/30 border border-dashed border-muted-foreground/30" />
                  <span className="flex-1 text-muted-foreground italic text-sm">
                    Aguardando jogador...
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onReady}
          className={`btn-gaming flex-1 flex items-center justify-center gap-2 ${
            isReady ? "bg-victory" : "bg-primary"
          }`}
        >
          <Play className="w-4 h-4" />
          {isReady ? "PRONTO!" : "FICAR PRONTO"}
        </button>
        <button
          onClick={onLeave}
          className="btn-gaming-outline px-4"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
