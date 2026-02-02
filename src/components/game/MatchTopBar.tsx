import { motion } from "framer-motion";
import { X, Skull, HelpCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface TeamPlayer {
  id: number;
  name: string;
  avatar?: string;
  isDead?: boolean;
  borderColor?: "blue" | "red" | "teal" | "pink" | "purple" | "green";
}

/** Qual slot da barra superior é o jogador local (para mostrar a foto definida no lobby). */
export type CurrentPlayerSlot = { team: "A" | "B"; index: number };

interface MatchTopBarProps {
  teamAPlayers: TeamPlayer[];
  teamBPlayers: TeamPlayer[];
  scoreA: number;
  scoreB: number;
  timer: string; // "00:03"
  onClose?: () => void;
  /** Foto do jogador (mesma definida no lobby). Mostrada no slot indicado por currentPlayerSlot. */
  currentPlayerAvatar?: string | null;
  /** Em qual posição (time e índice 0–4) está o jogador local. Ex.: { team: "A", index: 0 } = primeiro do time A. */
  currentPlayerSlot?: CurrentPlayerSlot;
}

const borderColors = {
  blue: "ring-2 ring-team-a",
  red: "ring-2 ring-red-500",
  teal: "ring-2 ring-teal-400",
  pink: "ring-2 ring-pink-400",
  purple: "ring-2 ring-purple-400",
  green: "ring-2 ring-green-500",
};

export function MatchTopBar({
  teamAPlayers,
  teamBPlayers,
  scoreA,
  scoreB,
  timer,
  onClose,
  currentPlayerAvatar,
  currentPlayerSlot = { team: "A", index: 0 },
}: MatchTopBarProps) {
  const getAvatarForSlot = (team: "A" | "B", index: number, playerAvatar?: string) => {
    const isCurrentPlayer =
      currentPlayerSlot?.team === team && currentPlayerSlot?.index === index;
    if (isCurrentPlayer && currentPlayerAvatar) return currentPlayerAvatar;
    return playerAvatar;
  };

  return (
    <>
      {onClose && (
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[60] w-8 h-8 bg-secondary/90 rounded-full flex items-center justify-center hover:bg-primary transition-colors border border-border"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-4 left-4 right-4 z-50 px-2 sm:px-4"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          {/* Team A - 5 avatars (foto do jogador no slot definido por currentPlayerSlot) */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 justify-end">
            {teamAPlayers.slice(0, 5).map((p, index) => {
              const avatarUrl = getAvatarForSlot("A", index, p.avatar);
              return (
                <Avatar
                  key={p.id}
                  className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 ${p.borderColor ? borderColors[p.borderColor] : "ring-2 ring-team-a"} ${p.isDead ? "opacity-60 grayscale" : ""}`}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={p.name} />
                  ) : (
                    <AvatarFallback className="bg-team-a/80 text-white flex items-center justify-center">
                      {p.isDead ? <Skull className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              );
            })}
          </div>

          {/* Centro: Placar A | Timer | Placar B */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center border border-border">
              <span className="font-display text-lg sm:text-xl font-bold text-team-a tabular-nums">{scoreA}</span>
            </div>
            <div className="w-14 h-10 sm:w-16 sm:h-12 rounded-lg bg-muted flex items-center justify-center border border-primary/50">
              <span className="font-display text-sm sm:text-base font-bold text-primary tabular-nums">{timer}</span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-muted flex items-center justify-center border border-border">
              <span className="font-display text-lg sm:text-xl font-bold text-team-b tabular-nums">{scoreB}</span>
            </div>
          </div>

          {/* Team B - 5 avatars (foto do jogador no slot definido por currentPlayerSlot) */}
          <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 justify-start">
            {teamBPlayers.slice(0, 5).map((p, index) => {
              const avatarUrl = getAvatarForSlot("B", index, p.avatar);
              return (
                <Avatar
                  key={p.id}
                  className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 ${p.borderColor ? borderColors[p.borderColor] : "ring-2 ring-team-b"} ${p.isDead ? "opacity-60 grayscale" : ""}`}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={p.name} />
                  ) : (
                    <AvatarFallback className="bg-team-b/80 text-white flex items-center justify-center">
                      {p.isDead ? <Skull className="w-4 h-4" /> : <HelpCircle className="w-4 h-4" />}
                    </AvatarFallback>
                  )}
                </Avatar>
              );
            })}
          </div>
        </div>
      </motion.div>
    </>
  );
}
