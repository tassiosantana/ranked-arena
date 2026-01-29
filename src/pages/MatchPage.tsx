import { useState, useEffect } from "react";
import { MatchHUD } from "@/components/game/MatchHUD";
import { DuelDisplay } from "@/components/game/DuelDisplay";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mockDuels = [
  { id: "1", playerA: { id: 8, name: "Marcus Reed" }, playerB: { id: 3, name: "Alex Stone" } },
  { id: "2", playerA: { id: 5, name: "Ryan Blake" }, playerB: { id: 6, name: "Jordan Cole" } },
  { id: "3", playerA: { id: 8, name: "Marcus Reed" }, playerB: { id: 5, name: "Ryan Blake" } },
];

export default function MatchPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background - simulating game view */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-background" />
      
      {/* Game elements placeholder */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center text-muted-foreground">
          <p className="text-lg mb-2">Área de jogo</p>
          <p className="text-sm">A partida começará em breve...</p>
        </div>
      </motion.div>

      {/* HUD */}
      <MatchHUD
        teamAName="TEAM A"
        teamBName="TEAM B"
        scoreA={scoreA}
        scoreB={scoreB}
        countdown={countdown > 0 ? countdown : undefined}
        onClose={() => navigate("/")}
      />

      {/* Duel Display */}
      <DuelDisplay duels={mockDuels} />

      {/* Bottom Info */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-panel px-8 py-4"
      >
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Round</p>
            <p className="font-display text-xl font-bold">1/16</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Tempo</p>
            <p className="font-display text-xl font-bold text-primary">1:45</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase">Jogadores Vivos</p>
            <p className="font-display text-xl font-bold">
              <span className="text-team-a">4</span>
              <span className="text-muted-foreground mx-2">vs</span>
              <span className="text-team-b">3</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
