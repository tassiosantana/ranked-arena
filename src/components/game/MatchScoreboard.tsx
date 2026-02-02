import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface PlayerStatsRow {
  id: number;
  name: string;
  avatar?: string;
  money?: number;
  kills: number;
  deaths: number;
  assists: number;
  hsPercent?: number;
  damage: number;
}

interface MatchScoreboardProps {
  teamAName: string;
  teamBName: string;
  teamAPlayers: PlayerStatsRow[];
  teamBPlayers: PlayerStatsRow[];
  scoreA: number;
  scoreB: number;
  aliveA: number;
  aliveB: number;
  matchTime: string;
  mapName?: string;
  /** ID do jogador local (linha destacada). */
  currentPlayerId?: number;
  onClose?: () => void;
}

const STAT_COLUMNS = [
  { key: "money", label: "Money", width: "w-16" },
  { key: "kills", label: "K", width: "w-10" },
  { key: "deaths", label: "D", width: "w-10" },
  { key: "assists", label: "A", width: "w-10" },
  { key: "hsPercent", label: "HS%", width: "w-12" },
  { key: "damage", label: "DMG", width: "w-12" },
] as const;

function TeamSection({
  teamName,
  score,
  alive,
  totalAlive,
  players,
  teamColor,
  currentPlayerId,
}: {
  teamName: string;
  score: number;
  alive: number;
  totalAlive: number;
  players: PlayerStatsRow[];
  teamColor: "team-a" | "team-b";
  currentPlayerId?: number;
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col rounded-lg border border-border bg-card/95 overflow-hidden max-h-[320px] min-h-0">
      <div className={`flex items-center gap-2 px-3 py-1.5 border-b border-border shrink-0 ${teamColor === "team-a" ? "bg-team-a/10" : "bg-team-b/10"}`}>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${teamColor === "team-a" ? "bg-team-a" : "bg-team-b"}`}>
          <span className="font-display text-sm font-bold text-white">{score}</span>
        </div>
        <div className="min-w-0">
          <p className="font-display font-bold text-xs uppercase tracking-wide truncate">{teamName}</p>
          <p className="text-[10px] text-muted-foreground">Vivos: {alive}/{totalAlive}</p>
        </div>
      </div>
      <div className="overflow-auto min-h-0 flex-1">
        <table className="w-full text-xs">
          <thead className="sticky top-0 bg-card/95 z-10">
            <tr className="border-b border-border text-muted-foreground text-[10px] uppercase">
              <th className="text-left py-1 px-1.5 font-medium">Jogador</th>
              {STAT_COLUMNS.map((col) => (
                <th key={col.key} className={`text-right py-1 px-0.5 ${col.width}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((p) => {
              const isCurrentPlayer = p.id === currentPlayerId;
              return (
                <tr
                  key={p.id}
                  className={`border-b border-border/40 transition-colors ${
                    isCurrentPlayer ? "bg-primary/20" : "hover:bg-muted/30"
                  }`}
                >
                  <td className="py-0.5 px-1.5">
                    <div className="flex items-center gap-1.5">
                      <Avatar className="h-5 w-5 shrink-0">
                        {p.avatar ? (
                          <img src={p.avatar} alt={p.name} />
                        ) : (
                          <AvatarFallback className="text-[9px] bg-muted">
                            {p.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span className="font-medium truncate max-w-[80px] text-[11px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="text-right py-0.5 px-0.5 text-[11px]">
                    {p.money != null ? `$${p.money.toLocaleString()}` : "-"}
                  </td>
                  <td className="text-right py-0.5 px-0.5 font-display font-bold text-foreground text-[11px]">
                    {p.kills}
                  </td>
                  <td className="text-right py-0.5 px-0.5 font-display text-muted-foreground text-[11px]">
                    {p.deaths}
                  </td>
                  <td className="text-right py-0.5 px-0.5 text-[11px]">{p.assists}</td>
                  <td className="text-right py-0.5 px-0.5 text-[11px]">{p.hsPercent ?? "-"}%</td>
                  <td className="text-right py-0.5 px-0.5 font-display text-[11px]">{p.damage}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function MatchScoreboard({
  teamAName,
  teamBName,
  teamAPlayers,
  teamBPlayers,
  scoreA,
  scoreB,
  aliveA,
  aliveB,
  matchTime,
  mapName = "Arena Armazém",
  currentPlayerId,
  onClose,
}: MatchScoreboardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="max-w-4xl w-full flex flex-col max-h-[85vh] rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header compacto */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border shrink-0">
          <div>
            <p className="font-display font-bold text-xs uppercase tracking-wider text-foreground">
              Competitivo | {mapName}
            </p>
            <p className="text-[10px] text-muted-foreground">Ranked Arena</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-base font-bold text-primary tabular-nums">
              {matchTime}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-[10px] text-muted-foreground hover:text-foreground underline"
            >
              TAB para fechar
            </button>
          </div>
        </div>

        {/* Placar central compacto */}
        <div className="flex items-center justify-center gap-4 py-1.5 border-b border-border/60 shrink-0">
          <span className="font-display text-xl font-bold text-team-a">{scoreA}</span>
          <span className="text-muted-foreground font-display text-sm">-</span>
          <span className="font-display text-xl font-bold text-team-b">{scoreB}</span>
        </div>

        {/* Dois times lado a lado - altura limitada */}
        <div className="flex gap-3 p-2 min-h-0 flex-1 overflow-hidden">
          <TeamSection
            teamName={teamAName}
            score={scoreA}
            alive={aliveA}
            totalAlive={teamAPlayers.length}
            players={teamAPlayers}
            teamColor="team-a"
            currentPlayerId={currentPlayerId}
          />
          <TeamSection
            teamName={teamBName}
            score={scoreB}
            alive={aliveB}
            totalAlive={teamBPlayers.length}
            players={teamBPlayers}
            teamColor="team-b"
            currentPlayerId={currentPlayerId}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
