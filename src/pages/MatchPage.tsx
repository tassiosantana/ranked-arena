import { useState, useEffect, useRef } from "react";
import { MatchTopBar, type TeamPlayer } from "@/components/game/MatchTopBar";
import { MatchHUD } from "@/components/game/MatchHUD";
import { RoundCountdownBanner } from "@/components/game/RoundCountdownBanner";
import { WeaponSelector } from "@/components/game/WeaponSelector";
import { MatchScoreboard, type PlayerStatsRow } from "@/components/game/MatchScoreboard";
import { PlayerStatusHUD, getStoredPlayerAvatar } from "@/components/game/PlayerStatusHUD";
import { BuyMenu, type ShopItem } from "@/components/game/BuyMenu";
import { type WeaponSlotItem } from "@/components/game/WeaponSelector";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import arenaWarehouse from "@/assets/arena-warehouse.jpg";

const BUY_PHASE_DURATION = 15; // segundos para comprar a cada round
const ROUND_DURATION_SECONDS = 120; // 2 min por round; se TR não plantar a bomba em 2 min, CT ganha

const mockTeamA: TeamPlayer[] = [
  { id: 1, name: "Player 1", borderColor: "blue" },
  { id: 2, name: "Player 2", borderColor: "teal" },
  { id: 3, name: "Player 3", borderColor: "pink" },
  { id: 4, name: "Player 4", borderColor: "purple" },
  { id: 5, name: "Player 5", borderColor: "purple" },
];

const mockTeamB: TeamPlayer[] = [
  { id: 6, name: "Player 6", borderColor: "green" },
  { id: 7, name: "Player 7", borderColor: "red" },
  { id: 8, name: "Player 8", borderColor: "teal" },
  { id: 9, name: "Player 9", borderColor: "pink" },
  { id: 10, name: "Player 10", borderColor: "purple" },
];

const mockStatsTeamA: PlayerStatsRow[] = [
  { id: 1, name: "Player 1", money: 5000, kills: 4, deaths: 2, assists: 1, hsPercent: 25, damage: 236 },
  { id: 2, name: "Player 2", money: 4200, kills: 2, deaths: 3, assists: 0, hsPercent: 50, damage: 185 },
  { id: 3, name: "Player 3", money: 3800, kills: 3, deaths: 2, assists: 1, hsPercent: 0, damage: 122 },
  { id: 4, name: "Player 4", money: 3100, kills: 2, deaths: 4, assists: 0, hsPercent: 50, damage: 115 },
  { id: 5, name: "Player 5", money: 2400, kills: 0, deaths: 5, assists: 1, hsPercent: 0, damage: 77 },
];

const mockStatsTeamB: PlayerStatsRow[] = [
  { id: 6, name: "Player 6", money: 14600, kills: 25, deaths: 0, assists: 0, hsPercent: 80, damage: 2195 },
  { id: 7, name: "Player 7", money: 16000, kills: 6, deaths: 1, assists: 1, hsPercent: 0, damage: 483 },
  { id: 8, name: "Player 8", money: 5850, kills: 2, deaths: 4, assists: 1, hsPercent: 0, damage: 238 },
  { id: 9, name: "Player 9", money: 11700, kills: 1, deaths: 3, assists: 2, hsPercent: 0, damage: 235 },
  { id: 10, name: "Player 10", money: 9700, kills: 1, deaths: 3, assists: 2, hsPercent: 100, damage: 224 },
];

function formatMatchTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Formata o tempo do round (countdown 02:00 -> 00:00). */
function formatRoundTime(secondsLeft: number) {
  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/** Retorna índice do slot (0=primária, 1=pistola, 2=faca) ou -1 se não for arma. */
function getWeaponSlotIndex(category: ShopItem["category"]): number {
  if (category === "pistols") return 1;
  if (category === "smgs" || category === "midtier" || category === "rifles") return 0;
  return -1; // equipment, grenades não vão para os 3 slots
}

export default function MatchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isSpectating = searchParams.get("spectate") === "1";

  const [matchStartCountdown, setMatchStartCountdown] = useState(5);
  const [roundStartCountdown, setRoundStartCountdown] = useState<number | null>(null);
  const [matchTimerSeconds, setMatchTimerSeconds] = useState(0);
  const [scoreA, setScoreA] = useState(3);
  const [scoreB, setScoreB] = useState(2);
  const [buyPhaseActive, setBuyPhaseActive] = useState(false);
  const [buyPhaseTimeLeft, setBuyPhaseTimeLeft] = useState(BUY_PHASE_DURATION);
  const [playerMoney, setPlayerMoney] = useState(5000);
  const [weaponSlots, setWeaponSlots] = useState<(WeaponSlotItem | null)[]>([null, null, null]);
  const [scoreboardOpen, setScoreboardOpen] = useState(false);
  const [buyMenuOpen, setBuyMenuOpen] = useState(false); // menu de compra visível (só durante a fase de compra)
  const [roundTimeLeft, setRoundTimeLeft] = useState(0); // 2 min por round; countdown; ao chegar 0, CT ganha
  const buyPhaseTriggered = useRef(false);
  const prevBuyPhaseActive = useRef(false);

  const matchStarted = matchStartCountdown === 0;
  const currentPlayerId = 1;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        setScoreboardOpen((prev) => !prev);
      }
      // B: abrir/fechar menu de compra só durante os 15 s da fase de compra
      if (e.key.toLowerCase() === "b") {
        const target = e.target as Node;
        if (target && (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) return;
        if (buyPhaseActive) {
          e.preventDefault();
          setBuyMenuOpen((prev) => !prev);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [buyPhaseActive]);

  // Countdown inicial da partida (círculo central)
  useEffect(() => {
    if (matchStartCountdown <= 0) return;
    const t = setInterval(() => setMatchStartCountdown((p) => (p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [matchStartCountdown]);

  // Quando a partida "começa", inicia o countdown do round (3 segundos) e o timer da partida
  useEffect(() => {
    if (matchStartCountdown !== 0) return;
    setRoundStartCountdown(3);
  }, [matchStartCountdown]);

  // Countdown "O round irá iniciar em X segundos"
  useEffect(() => {
    if (roundStartCountdown === null || roundStartCountdown <= 0) return;
    const t = setInterval(() => setRoundStartCountdown((p) => (p == null || p <= 0 ? 0 : p - 1)), 1000);
    return () => clearInterval(t);
  }, [roundStartCountdown]);

  // Quando o round começa (countdown chega a 0), inicia a fase de compra de 15 s; menu abre automaticamente
  useEffect(() => {
    if (roundStartCountdown !== 0) return;
    if (matchStartCountdown > 0) return;
    if (buyPhaseTriggered.current) return;
    buyPhaseTriggered.current = true;
    setBuyPhaseActive(true);
    setBuyPhaseTimeLeft(BUY_PHASE_DURATION);
    setBuyMenuOpen(true);
  }, [roundStartCountdown, matchStartCountdown]);

  // Timer da fase de compra: quando chega a 0, fecha a loja
  useEffect(() => {
    if (!buyPhaseActive || buyPhaseTimeLeft <= 0) return;
    const t = setInterval(() => {
      setBuyPhaseTimeLeft((prev) => {
        if (prev <= 1) {
          setBuyPhaseActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [buyPhaseActive, buyPhaseTimeLeft]);

  // Quando a fase de compra termina, inicia o timer do round (2 min decrescente)
  useEffect(() => {
    if (prevBuyPhaseActive.current && !buyPhaseActive && matchStarted) {
      setRoundTimeLeft(ROUND_DURATION_SECONDS);
    }
    prevBuyPhaseActive.current = buyPhaseActive;
  }, [buyPhaseActive, matchStarted]);

  // Timer do round: countdown de 2 min; ao chegar 0, CT (Time B) ganha se TR não plantou a bomba
  useEffect(() => {
    if (!matchStarted || buyPhaseActive || roundTimeLeft <= 0) return;
    const t = setInterval(() => {
      setRoundTimeLeft((prev) => {
        if (prev <= 1) {
          setScoreB((s) => s + 1); // CT (Time B) ganha o round
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [matchStarted, buyPhaseActive, roundTimeLeft]);

  // Timer da partida (cronômetro geral, opcional)
  useEffect(() => {
    if (matchStartCountdown > 0) return;
    const t = setInterval(() => setMatchTimerSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [matchStartCountdown]);

  const showRoundBanner = roundStartCountdown != null && roundStartCountdown > 0;

  // Timer exibido na barra: decrescente 02:00 -> 00:00 (durante buy phase mostra 02:00; depois countdown)
  const displayRoundTimer =
    roundTimeLeft > 0
      ? formatRoundTime(roundTimeLeft)
      : buyPhaseActive
        ? "02:00"
        : "00:00";

  const handleBuy = (item: ShopItem) => {
    setPlayerMoney((prev) => Math.max(0, prev - item.price));
    const slotIndex = getWeaponSlotIndex(item.category);
    if (slotIndex >= 0) {
      setWeaponSlots((prev) => {
        const next = [...prev];
        next[slotIndex] = { name: item.name, icon: item.icon };
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen h-screen bg-background relative overflow-hidden">
      {/* Background - arena warehouse */}
      <div className="absolute inset-0">
        <img
          src={arenaWarehouse}
          alt="Arena"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background/80" />
      </div>

      {/* Barra superior: 5 avatars + placar + timer (quando partida iniciou) */}
      {matchStarted && (
        <MatchTopBar
          teamAPlayers={mockTeamA}
          teamBPlayers={mockTeamB}
          scoreA={scoreA}
          scoreB={scoreB}
          timer={displayRoundTimer}
          onClose={() => navigate("/")}
          currentPlayerAvatar={getStoredPlayerAvatar()}
          currentPlayerSlot={{ team: "A", index: 0 }}
        />
      )}

      {/* Countdown inicial da partida (círculo central) - só antes de iniciar */}
      {matchStartCountdown > 0 && (
        <MatchHUD
          teamAName="TEAM A"
          teamBName="TEAM B"
          scoreA={scoreA}
          scoreB={scoreB}
          countdown={matchStartCountdown}
          onClose={() => navigate("/")}
        />
      )}

      {/* Tab de estatísticas (TAB para abrir/fechar) */}
      <AnimatePresence>
        {matchStarted && scoreboardOpen && (
          <MatchScoreboard
            teamAName="TIME A"
            teamBName="TIME B"
            teamAPlayers={mockStatsTeamA}
            teamBPlayers={mockStatsTeamB}
            scoreA={scoreA}
            scoreB={scoreB}
            aliveA={4}
            aliveB={3}
            matchTime={formatMatchTime(matchTimerSeconds)}
            mapName="Arena Armazém"
            currentPlayerId={currentPlayerId}
            onClose={() => setScoreboardOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Banner central: "O ROUND IRÁ INICIAR EM X SEGUNDOS" */}
      <AnimatePresence>
        {showRoundBanner && <RoundCountdownBanner seconds={roundStartCountdown} />}
      </AnimatePresence>

      {/* Loja de armas - visível só quando fase de compra ativa e menu aberto; B ou X apenas fecha/abre, jogo libera após 15 s */}
      {buyPhaseActive && buyMenuOpen && (
        <BuyMenu
          money={playerMoney}
          timeLeft={buyPhaseTimeLeft}
          onBuy={handleBuy}
          onClose={() => setBuyMenuOpen(false)}
        />
      )}

      {/* Área de jogo - texto só quando countdown do round acabou, partida começou e não está na loja */}
      {matchStarted && !showRoundBanner && !buyPhaseActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="text-center text-white/80 pointer-events-auto drop-shadow-lg">
            <p className="text-lg font-display font-bold">Área de jogo</p>
            <p className="text-sm opacity-90">Round em andamento</p>
          </div>
        </motion.div>
      )}

      {/* Seletor de armas - direita; slots preenchidos com o que foi comprado na loja */}
      {matchStarted && <WeaponSelector slots={weaponSlots} />}

      {/* Status do jogador - canto inferior esquerdo (foto, vida, munição, dinheiro) */}
      {matchStarted && !buyPhaseActive && (
        <PlayerStatusHUD
          healthPercent={80}
          ammo="12/225"
          money={playerMoney}
          playerAvatar={getStoredPlayerAvatar()}
        />
      )}

      {/* Barra inferior (Round / Tempo / Jogadores vivos) - apenas para espectador */}
      {matchStarted && isSpectating && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-8 left-0 right-0 z-40 flex justify-center px-4"
        >
          <div className="glass-panel rounded-xl border border-border/80 shadow-xl flex w-full max-w-xl overflow-hidden">
            <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-4 px-4 border-r border-border/60">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium w-full text-center">Round</p>
              <p className="font-display text-lg sm:text-xl font-bold w-full text-center text-foreground">1/16</p>
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-4 px-4 border-r border-border/60">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium w-full text-center">Tempo</p>
              <p className="font-display text-lg sm:text-xl font-bold text-primary w-full text-center">{formatMatchTime(matchTimerSeconds)}</p>
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 py-4 px-4">
              <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-medium w-full text-center leading-tight">Jogadores Vivos</p>
              <p className="font-display text-lg sm:text-xl font-bold w-full text-center inline-flex items-baseline justify-center gap-1">
                <span className="text-team-a">4</span>
                <span className="text-muted-foreground text-base">vs</span>
                <span className="text-team-b">3</span>
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
