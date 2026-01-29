import { useState } from "react";
import { PlayerCard } from "@/components/game/PlayerCard";
import { Leaderboard } from "@/components/game/Leaderboard";
import { ArenaSelector } from "@/components/game/ArenaSelector";
import { GameModeSelector } from "@/components/game/GameModeSelector";
import { MatchHistory } from "@/components/game/MatchHistory";
import { LobbyPanel } from "@/components/game/LobbyPanel";
import { TeamCreation } from "@/components/game/TeamCreation";
import { GameType } from "@/components/game/GameTypeSelector";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, Ban, Play, Users } from "lucide-react";
import { getRankByXP, RANKS } from "@/lib/ranks";

type GameMode = "1V1" | "2V2" | "3V3" | "4V4" | "5V5";

// Mock data
const mockPlayerXP = 2700;
const mockPlayerRank = getRankByXP(mockPlayerXP);

const mockPlayer = {
  name: "luiz trigueiro",
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
  { rank: 4, name: "LUIZ TRI...", winRate: 33.3, kills: 11, playerRank: mockPlayerRank },
  { rank: 5, name: "BAR DEV", winRate: 28.6, kills: 10, playerRank: RANKS[6] },
];

const mockHistory = [
  { id: "1", teamA: "ATK", teamB: "SEU TIME", scoreA: 0, scoreB: 1, mode: "4V4", prize: 0, won: true },
  { id: "2", teamA: "SEU TIME", teamB: "DEF", scoreA: 1, scoreB: 0, mode: "4V4", prize: 0, won: true },
];

const mockLobbyPlayers = [
  { id: 1, name: "luiz trigueiro", ready: true, rank: mockPlayerRank, xp: mockPlayerXP, isLeader: true },
  { id: 2, name: "bar dev", ready: false, rank: RANKS[6], xp: 1500, isLeader: false },
];

function generateTeamCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function LobbyPage() {
  const [selectedMode, setSelectedMode] = useState<GameMode>("1V1");
  const [selectedType, setSelectedType] = useState<GameType>("bomb");
  const [filterOn, setFilterOn] = useState(true);
  const [selectedArena, setSelectedArena] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [teamCode, setTeamCode] = useState<string | undefined>(undefined);

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

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Game Mode Selector */}
      <GameModeSelector
        selectedMode={selectedMode}
        onSelectMode={setSelectedMode}
        selectedType={selectedType}
        onSelectType={setSelectedType}
        filterOn={filterOn}
        onToggleFilter={() => setFilterOn(!filterOn)}
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Player Stats & Leaderboard */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <PlayerCard
            name={mockPlayer.name}
            id={mockPlayer.id}
            stats={mockPlayer.stats}
            rank={mockPlayer.rank}
            xp={mockPlayer.xp}
          />
          <Leaderboard entries={mockLeaderboard} />
        </div>

        {/* Center Column - Arena Selection & History */}
        <div className="col-span-12 lg:col-span-6 space-y-6">
          <ArenaSelector
            selectedArena={selectedArena}
            onSelectArena={setSelectedArena}
          />
          <MatchHistory matches={mockHistory} />
        </div>

        {/* Right Column - Lobby */}
        <div className="col-span-12 lg:col-span-3 space-y-6">
          <LobbyPanel
            players={mockLobbyPlayers}
            maxPlayers={selectedMode === "1V1" ? 2 : selectedMode === "2V2" ? 4 : selectedMode === "3V3" ? 6 : selectedMode === "4V4" ? 8 : 10}
            isReady={isReady}
            onReady={() => setIsReady(!isReady)}
            onLeave={() => {}}
            onRemovePlayer={handleRemovePlayer}
            isLeader={true}
            currentPlayerId={1}
          />

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <button
              onClick={() => setTeamModalOpen(true)}
              className="btn-gaming-outline w-full flex items-center justify-center gap-2"
            >
              <Users className="w-5 h-5" />
              GERENCIAR TIME
            </button>
            <Link to="/buy" className="btn-gaming w-full flex items-center justify-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              LOJA DE ARMAS
            </Link>
            <Link to="/mapban" className="btn-gaming-outline w-full flex items-center justify-center gap-2">
              <Ban className="w-5 h-5" />
              BAN DE MAPAS
            </Link>
            <Link to="/match" className="btn-gaming w-full flex items-center justify-center gap-2 bg-victory hover:bg-victory/80">
              <Play className="w-5 h-5" />
              INICIAR PARTIDA
            </Link>
          </motion.div>
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
    </div>
  );
}
