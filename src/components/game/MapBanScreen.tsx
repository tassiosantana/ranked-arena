import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Ban } from "lucide-react";
import arenaWarehouse from "@/assets/arena-warehouse.jpg";
import arenaFarm from "@/assets/arena-farm.jpg";
import arenaBuilding from "@/assets/arena-building.jpg";
import arenaDocks from "@/assets/arena-docks.jpg";

interface Map {
  id: string;
  name: string;
  image: string;
  bannedBy?: "teamA" | "teamB";
}

const initialMaps: Map[] = [
  { id: "warehouse", name: "ARENA ARMAZÉM", image: arenaWarehouse },
  { id: "farm", name: "ARENA FAZENDA", image: arenaFarm },
  { id: "building", name: "ARENA PRÉDIO", image: arenaBuilding },
  { id: "docks", name: "ARENA DOCAS", image: arenaDocks },
];

interface MapBanScreenProps {
  teamAName: string;
  teamBName: string;
  currentTurn: "teamA" | "teamB";
  onBan: (mapId: string) => void;
  onClose: () => void;
}

export function MapBanScreen({ teamAName, teamBName, currentTurn, onBan, onClose }: MapBanScreenProps) {
  const [maps, setMaps] = useState<Map[]>(initialMaps);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleBan = (mapId: string) => {
    setMaps((prev) =>
      prev.map((map) =>
        map.id === mapId ? { ...map, bannedBy: currentTurn } : map
      )
    );
    onBan(mapId);
  };

  const availableMaps = maps.filter((m) => !m.bannedBy);
  const bannedMaps = maps.filter((m) => m.bannedBy);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-8"
    >
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-display text-3xl font-bold uppercase tracking-wider"
          >
            <Ban className="inline-block w-8 h-8 mr-3 text-primary" />
            Ban de Mapas
          </motion.h1>
          
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Turn Indicator */}
        <motion.div
          key={currentTurn}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground mb-2">VEZ DE BANIR</p>
          <div className={`inline-block px-8 py-3 font-display text-2xl font-bold ${
            currentTurn === "teamA" ? "bg-team-a glow-border" : "bg-team-b glow-border"
          }`}>
            {currentTurn === "teamA" ? teamAName : teamBName}
          </div>
          <div className="mt-4">
            <span className="text-4xl font-display font-bold text-primary">{timeLeft}s</span>
          </div>
        </motion.div>

        {/* Available Maps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <AnimatePresence>
            {maps.map((map) => (
              <motion.div
                key={map.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => !map.bannedBy && handleBan(map.id)}
                className={`map-card relative ${map.bannedBy ? "banned cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={map.image}
                    alt={map.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-display text-sm font-bold text-center">{map.name}</h3>
                </div>

                {/* Banned Overlay */}
                {map.bannedBy && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center"
                  >
                    <Ban className="w-12 h-12 text-primary mb-2" />
                    <span className="text-xs uppercase text-primary font-bold">
                      Banido por {map.bannedBy === "teamA" ? teamAName : teamBName}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Status e configuração da partida (junto com o ban) */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-6 text-muted-foreground">
            <span>Mapas disponíveis: {availableMaps.length}</span>
            <span>Mapas banidos: {bannedMaps.length}</span>
          </div>
          <div className="flex items-center gap-6 text-muted-foreground">
            <span>Valor da partida:</span>
            <span className="font-display text-foreground text-lg">$0</span>
            <span>Número de rounds:</span>
            <span className="font-display text-foreground text-lg">1</span>
          </div>
        </div>

        {/* Arena selecionada: quando sobra só um mapa após os bans */}
        {availableMaps.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 rounded-lg border-2 border-primary/50 bg-primary/10 text-center"
          >
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Arena selecionada</p>
            <p className="font-display text-xl font-bold text-primary">{availableMaps[0].name}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
