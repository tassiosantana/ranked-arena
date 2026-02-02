import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, LogIn, Swords } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const mockPublicLobbies = [
  { code: "X7K2M9", leaderName: "PRO PLAYER", playerCount: 4, maxPlayers: 5 },
  { code: "ABC123", leaderName: "ELITE GAMER", playerCount: 3, maxPlayers: 5 },
  { code: "DEF456", leaderName: "SNIPER KING", playerCount: 5, maxPlayers: 5 },
];

export default function LobbyEntryPage() {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");

  const handleCreateLobby = () => {
    navigate("/lobby", { state: { action: "create" } });
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code) {
      navigate("/lobby", { state: { action: "join", code } });
    }
  };

  const handleJoinLobby = (code: string) => {
    navigate("/lobby", { state: { action: "join", code } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-primary/5" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-lg space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-wider text-foreground">
            Modo Competitivo
          </h1>
          <p className="text-muted-foreground text-sm">Escolha como deseja entrar na arena</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <motion.div
            role="button"
            tabIndex={0}
            onClick={handleCreateLobby}
            onKeyDown={(e) => e.key === "Enter" && handleCreateLobby()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glass-panel p-8 rounded-xl border-2 border-primary/30 hover:border-primary/60 flex flex-col items-center gap-4 text-left transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                Criar lobby
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Crie um novo lobby e convide jogadores com o código. Depois desafie outros times.
              </p>
            </div>
            <Button type="button" className="w-full btn-gaming mt-2" size="lg" onClick={(e) => { e.stopPropagation(); handleCreateLobby(); }}>
              CRIAR LOBBY
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-8 rounded-xl border-2 border-border flex flex-col gap-4"
          >
            <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
              <LogIn className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold uppercase tracking-wider text-foreground">
                Entrar em lobby
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Entre com o código do lobby ou escolha um lobby público abaixo.
              </p>
            </div>

            <form onSubmit={handleJoinByCode} className="space-y-2">
              <Input
                type="text"
                placeholder="Código do lobby (ex: ABC123)"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="font-display tracking-widest text-center uppercase max-w-[8rem] mx-auto"
                maxLength={6}
              />
              <Button type="submit" variant="outline" className="w-full" disabled={!joinCode.trim()}>
                ENTRAR COM CÓDIGO
              </Button>
            </form>

            <div className="border-t border-border/60 pt-4 mt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Lobbies públicos</p>
              <ul className="space-y-2">
                {mockPublicLobbies.map((lobby) => (
                  <li key={lobby.code}>
                    <button
                      type="button"
                      onClick={() => handleJoinLobby(lobby.code)}
                      className="w-full flex items-center justify-between gap-3 p-3 rounded-lg bg-card/60 border border-border/60 hover:border-primary/40 hover:bg-card/80 transition-colors text-left"
                    >
                      <div className="min-w-0">
                        <span className="font-display font-bold text-primary">{lobby.code}</span>
                        <span className="text-muted-foreground text-sm ml-2">• {lobby.leaderName}</span>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {lobby.playerCount}/{lobby.maxPlayers}
                      </span>
                      <Swords className="w-4 h-4 text-muted-foreground shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Após entrar ou criar, você verá a tela do lobby com seu time, arenas e histórico.
        </p>
      </motion.div>
    </div>
  );
}
