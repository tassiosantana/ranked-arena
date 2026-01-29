import { useState } from "react";
import { MapBanScreen } from "@/components/game/MapBanScreen";
import { useNavigate } from "react-router-dom";

export default function MapBanPage() {
  const navigate = useNavigate();
  const [currentTurn, setCurrentTurn] = useState<"teamA" | "teamB">("teamA");
  const [bannedMaps, setBannedMaps] = useState<string[]>([]);

  const handleBan = (mapId: string) => {
    setBannedMaps([...bannedMaps, mapId]);
    setCurrentTurn(currentTurn === "teamA" ? "teamB" : "teamA");
  };

  return (
    <MapBanScreen
      teamAName="TEAM A"
      teamBName="TEAM B"
      currentTurn={currentTurn}
      onBan={handleBan}
      onClose={() => navigate("/")}
    />
  );
}
