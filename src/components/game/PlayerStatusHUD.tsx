import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, User, Crosshair } from "lucide-react";

const PLAYER_AVATAR_STORAGE_KEY = "ranked-arena-player-avatar";

export function getStoredPlayerAvatar(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(PLAYER_AVATAR_STORAGE_KEY);
}

export function setStoredPlayerAvatar(url: string | null) {
  if (typeof window === "undefined") return;
  if (url) localStorage.setItem(PLAYER_AVATAR_STORAGE_KEY, url);
  else localStorage.removeItem(PLAYER_AVATAR_STORAGE_KEY);
}

interface PlayerStatusHUDProps {
  healthPercent?: number;
  ammo?: string; // "12/225"
  money?: number;
  /** URL da foto do jogador (mostrada no canto inferior esquerdo). Se não definida, usa ícone padrão. */
  playerAvatar?: string | null;
}

export function PlayerStatusHUD({
  healthPercent = 80,
  ammo = "12/225",
  money = 5000,
  playerAvatar,
}: PlayerStatusHUDProps) {
  const [avatarError, setAvatarError] = useState(false);
  const showAvatar = playerAvatar && !avatarError;

  useEffect(() => {
    setAvatarError(false);
  }, [playerAvatar]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 left-4 z-40 flex items-end gap-3"
    >
      {/* Foto do jogador ou ícone padrão */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-card/90 backdrop-blur-md border border-primary/50 shadow-lg overflow-hidden shrink-0 flex items-center justify-center ring-2 ring-primary/30">
        {showAvatar ? (
          <img
            src={playerAvatar}
            alt="Foto do jogador"
            className="w-full h-full object-cover"
            onError={() => setAvatarError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-muted to-muted/50 flex items-center justify-center">
            <User className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Barra de vida + ammo e dinheiro */}
      <div className="flex flex-col gap-2">
        <div
          className="h-3 sm:h-4 rounded-full bg-muted/80 border border-border overflow-hidden min-w-[120px] sm:min-w-[160px]"
          style={{ width: "clamp(120px, 20vw, 200px)" }}
        >
          <div
            className="h-full rounded-full bg-team-a transition-all duration-300"
            style={{ width: `${Math.max(0, Math.min(100, healthPercent))}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1.5 rounded-md bg-team-a/20 border border-team-a/50 flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-team-a shrink-0" />
            <span className="font-display text-sm font-bold tabular-nums text-foreground">{ammo}</span>
          </div>
          <div className="px-2.5 py-1.5 rounded-md bg-primary/20 border border-primary/50 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-primary" />
            <span className="font-display text-sm font-bold tabular-nums text-foreground">{money.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
