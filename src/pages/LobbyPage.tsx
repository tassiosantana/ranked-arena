import { useState, useEffect } from "react";
import { PlayerCard } from "@/components/game/PlayerCard";
import { Leaderboard } from "@/components/game/Leaderboard";
import { GameModeSelector } from "@/components/game/GameModeSelector";
import { MatchHistory } from "@/components/game/MatchHistory";
import { LobbyPanel } from "@/components/game/LobbyPanel";
import { TeamCreation } from "@/components/game/TeamCreation";
import { GameType } from "@/components/game/GameTypeSelector";
import { getStoredPlayerAvatar, setStoredPlayerAvatar } from "@/components/game/PlayerStatusHUD";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Ban, Play, Users, ImagePlus, Check, Swords, UserPlus, Loader2, ArrowLeft } from "lucide-react";
import { getRankByXP, RANKS } from "@/lib/ranks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockPlayerXP = 2700;
const mockPlayerRank = getRankByXP(mockPlayerXP);

const mockPlayer = {
  name: "Tz ",
  id: 5,
  stats: {
    kills: 11,
    deaths: 9,
    wins: 2,
    losses: 4,
    kd: 1.20,
    winRate: 33.3,
  },
  rank: mockPlayerRank,
  xp: mockPlayerXP,
};

const mockLeaderboard = [
  { rank: 1, name: "PRO PLAYER", winRate: 78.5, kills: 156, playerRank: RANKS[17] },
  { rank: 2, name: "ELITE GAMER", winRate: 72.3, kills: 134, playerRank: RANKS[16] },
  { rank: 3, name: "SNIPER KING", winRate: 65.1, kills: 98, playerRank: RANKS[14] },
  { rank: 4, name: "RYAN BLA...", winRate: 33.3, kills: 11, playerRank: mockPlayerRank },
  { rank: 5, name: "JORDAN COLE", winRate: 28.6, kills: 10, playerRank: RANKS[6] },
];

const mockHistory = [
  { id: "1", teamA: "ATK", teamB: "SEU TIME", scoreA: 0, scoreB: 1, mode: "5V5", prize: 0, won: true },
  { id: "2", teamA: "SEU TIME", teamB: "DEF", scoreA: 1, scoreB: 0, mode: "5V5", prize: 0, won: true },
];

const MY_TEAM_MAX = 5;

const mockMyTeamPlayers = [
  { id: 1, name: "Tz ", ready: true, rank: mockPlayerRank, xp: mockPlayerXP, isLeader: true },
  { id: 2, name: "Jordan Cole", ready: false, rank: RANKS[6], xp: 1500, isLeader: false },
];

interface OtherLobby {
  id: string;
  code: string;
  leaderName: string;
  playerCount: number;
  maxPlayers: number;
}
const mockOtherLobbies: OtherLobby[] = [
  { id: "1", code: "X7K2M9", leaderName: "PRO PLAYER", playerCount: 5, maxPlayers: 5 },
  { id: "2", code: "ABC123", leaderName: "ELITE GAMER", playerCount: 4, maxPlayers: 5 },
  { id: "3", code: "DEF456", leaderName: "SNIPER KING", playerCount: 5, maxPlayers: 5 },
];

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LobbyPage() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<GameType>("bomb");
  const [isReady, setIsReady] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamCode, setTeamCode] = useState<string | undefined>(undefined);
  const [playerAvatarUrl, setPlayerAvatarUrl] = useState("");
  const [avatarSaved, setAvatarSaved] = useState(false);
  /** Lobby desafiado: quando preenchido, mostra modal "Aguardando aceite". Ban de mapas só após o outro time aceitar. */
  const [challengePendingLobby, setChallengePendingLobby] = useState<OtherLobby | null>(null);
  const [challengeAccepted, setChallengeAccepted] = useState(false);
  /** Time adversário pronto (para iniciar partida os dois times precisam estar prontos). Demo: simulado por botão. */
  const [opponentTeamReady, setOpponentTeamReady] = useState(false);

  useEffect(() => {
    setPlayerAvatarUrl(getStoredPlayerAvatar() ?? "");
  }, []);

  const handleSavePlayerAvatar = () => {
    const url = playerAvatarUrl.trim();
    if (url) {
      setStoredPlayerAvatar(url);
      setAvatarSaved(true);
      setTimeout(() => setAvatarSaved(false), 2000);
    } else {
      setStoredPlayerAvatar(null);
    }
  };

  const handleCreateTeam = () => {
    setTeamCode(generateTeamCode());
  };

  const handleJoinTeam = (code: string) => {
    console.log("Joining team with code:", code);
    setTeamModalOpen(false);
  };

  const handleRemovePlayer = (playerId: number) => {
    console.log("Removing player:", playerId);
  };

  const handleChallengeLobby = (lobby: OtherLobby) => {
    setChallengePendingLobby(lobby);
    setChallengeAccepted(false);
  };

  const handleSimulateAcceptAndGoToMapBan = () => {
    setChallengeAccepted(true);
    const code = challengePendingLobby?.code ?? "";
    setTimeout(() => {
      setChallengePendingLobby(null);
      setChallengeAccepted(false);
      navigate(`/mapban?challenge=${encodeURIComponent(code)}`);
    }, 800);
  };

  const handleCloseChallengeModal = () => {
    if (!challengeAccepted) {
      setChallengePendingLobby(null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar à tela inicial
      </Link>
      {/* Game Mode Selector */}
      <GameModeSelector
        selectedType={selectedType}
        onSelectType={setSelectedType}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Player Stats & Leaderboard */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <PlayerCard
            name={mockPlayer.name}
            id={mockPlayer.id}
            avatar={getStoredPlayerAvatar() ?? undefined}
            stats={mockPlayer.stats}
            rank={mockPlayer.rank}
            xp={mockPlayer.xp}
          />

          {/* Foto do jogador - aparece na partida (canto inferior esquerdo) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-lg border border-border"
          >
            <div className="flex items-center gap-2 mb-3">
              <ImagePlus className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-sm uppercase tracking-wide">Foto do jogador</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Defina a URL da sua foto. Ela aparecerá no canto inferior esquerdo durante a partida.
            </p>
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://exemplo.com/sua-foto.jpg"
                value={playerAvatarUrl}
                onChange={(e) => setPlayerAvatarUrl(e.target.value)}
                className="flex-1 text-sm"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleSavePlayerAvatar}
                className="shrink-0 bg-primary hover:bg-primary/90"
              >
                {avatarSaved ? <Check className="w-4 h-4" /> : "Salvar"}
              </Button>
            </div>
          </motion.div>

          <Leaderboard entries={mockLeaderboard} />
        </div>

        {/* Center Column - Histórico (arena é escolhida no ban de mapas) */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-4 rounded-lg border border-border"
          >
            <p className="text-sm text-muted-foreground text-center">
              A arena (mapa) da partida é escolhida na tela de <strong className="text-foreground">Ban de mapas</strong>, após você desafiar um lobby e o outro time aceitar. Valor da partida e número de rounds aparecem lá.
            </p>
          </motion.div>
          <MatchHistory matches={mockHistory} />
        </div>

        {/* Right Column - Lobby com abas: Meu lobby / Desafiar lobbies */}
        <div className="col-span-12 lg:col-span-3 space-y-4">
          <Tabs defaultValue="meu-lobby" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted/80 p-1 h-auto">
              <TabsTrigger value="meu-lobby" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <UserPlus className="w-4 h-4" />
                Meu lobby
              </TabsTrigger>
              <TabsTrigger value="desafiar" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Swords className="w-4 h-4" />
                Desafiar lobbies
              </TabsTrigger>
            </TabsList>

            <TabsContent value="meu-lobby" className="mt-4 space-y-4">
              <LobbyPanel
                players={mockMyTeamPlayers}
                maxPlayers={MY_TEAM_MAX}
                isReady={isReady}
                onReady={() => setIsReady(!isReady)}
                onLeave={() => {}}
                onRemovePlayer={handleRemovePlayer}
                isLeader={true}
                currentPlayerId={1}
              />
              {mockMyTeamPlayers.length === MY_TEAM_MAX && (
                <p className="text-center text-sm text-victory font-semibold flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Time formado! Vá em &quot;Desafiar lobbies&quot; para desafiar.
                </p>
              )}
              {(() => {
                const myTeamAllReady = mockMyTeamPlayers.length === MY_TEAM_MAX && mockMyTeamPlayers.every((p) => p.ready);
                const canStartMatch = myTeamAllReady && opponentTeamReady;
                return (
                  <div className="space-y-3">
                    <button
                      onClick={() => setTeamModalOpen(true)}
                      className="btn-gaming-outline w-full flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      GERENCIAR TIME
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Ban de mapas ocorre quando você desafiar um lobby e o outro time aceitar.
                    </p>
                    {myTeamAllReady && !opponentTeamReady && (
                      <div className="rounded-lg border border-border/60 bg-muted/30 p-3 space-y-2">
                        <p className="text-sm text-muted-foreground text-center">
                          Seu time está pronto. Os dois times precisam estar prontos para iniciar a partida.
                        </p>
                        <button
                          type="button"
                          onClick={() => setOpponentTeamReady(true)}
                          className="w-full btn-gaming-outline text-sm py-2"
                        >
                          Simular adversário pronto (demo)
                        </button>
                      </div>
                    )}
                    {canStartMatch ? (
                      <Link to="/match" className="btn-gaming w-full flex items-center justify-center gap-2 bg-victory hover:bg-victory/80">
                        <Play className="w-5 h-5" />
                        INICIAR PARTIDA
                      </Link>
                    ) : (
                      <span
                        className="w-full flex items-center justify-center gap-2 py-3 rounded border border-border bg-muted/50 text-muted-foreground cursor-not-allowed font-display font-bold text-sm"
                        title={!myTeamAllReady ? "Seu time precisa estar completo (5 jogadores) e todos prontos." : "Aguarde o time adversário ficar pronto."}
                      >
                        <Play className="w-5 h-5" />
                        INICIAR PARTIDA
                      </span>
                    )}
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="desafiar" className="mt-4 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel p-4"
              >
                <h2 className="font-display text-lg font-bold mb-3 uppercase tracking-wider flex items-center gap-2">
                  <Swords className="w-5 h-5 text-primary" />
                  Lobbies disponíveis
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Só é possível desafiar quando seu time estiver formado (5 jogadores) em &quot;Meu lobby&quot;.
                </p>
                <div className="space-y-3">
                  {mockOtherLobbies.map((lobby) => {
                    const canChallenge = mockMyTeamPlayers.length === MY_TEAM_MAX && lobby.playerCount === lobby.maxPlayers;
                    return (
                      <div
                        key={lobby.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-lg bg-card/60 border border-border/60"
                      >
                        <div className="min-w-0">
                          <p className="font-display font-bold text-primary tracking-wider">{lobby.code}</p>
                          <p className="text-sm text-muted-foreground truncate">Líder: {lobby.leaderName}</p>
                          <p className="text-xs text-muted-foreground">
                            {lobby.playerCount}/{lobby.maxPlayers} jogadores
                          </p>
                        </div>
                        {canChallenge ? (
                          <button
                            type="button"
                            onClick={() => handleChallengeLobby(lobby)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2 rounded font-display font-bold text-sm uppercase bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Swords className="w-4 h-4" />
                            Desafiar
                          </button>
                        ) : (
                          <span className="shrink-0 flex items-center gap-2 px-4 py-2 rounded font-display font-bold text-sm uppercase bg-muted text-muted-foreground cursor-not-allowed opacity-60">
                            <Swords className="w-4 h-4" />
                            Desafiar
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Team Creation Modal */}
      <TeamCreation
        isOpen={teamModalOpen}
        onClose={() => setTeamModalOpen(false)}
        onCreateTeam={handleCreateTeam}
        onJoinTeam={handleJoinTeam}
        teamCode={teamCode}
      />

      {/* Modal: Desafio enviado - aguardando o outro time aceitar. Ban de mapas só após aceite. */}
      <Dialog open={!!challengePendingLobby} onOpenChange={() => handleCloseChallengeModal()}>
        <DialogContent className="bg-card border-border max-w-md" onPointerDownOutside={handleCloseChallengeModal}>
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Swords className="w-5 h-5 text-primary" />
              Desafio enviado
            </DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {challengePendingLobby && !challengeAccepted ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <p className="text-muted-foreground">
                  Desafio enviado ao time <span className="font-display font-bold text-primary">{challengePendingLobby.code}</span>.
                </p>
                <p className="text-sm text-muted-foreground">
                  Aguardando <span className="font-semibold text-foreground">{challengePendingLobby.leaderName}</span> aceitar. Quando aceitar, o ban de mapas será iniciado.
                </p>
                <div className="flex items-center justify-center gap-2 py-2">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Aguardando aceite...</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleCloseChallengeModal}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    className="flex-1 bg-victory hover:bg-victory/90"
                    onClick={handleSimulateAcceptAndGoToMapBan}
                  >
                    Simular aceite (demo)
                  </Button>
                </div>
              </motion.div>
            ) : challengePendingLobby && challengeAccepted ? (
              <motion.div
                key="accepted"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="py-4 text-center space-y-2"
              >
                <Check className="w-12 h-12 text-victory mx-auto" />
                <p className="font-display font-bold text-victory">Time aceitou! Iniciando ban de mapas...</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}
