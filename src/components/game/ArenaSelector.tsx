import { motion } from "framer-motion";
import arenaWarehouse from "@/assets/arena-warehouse.jpg";
import arenaFarm from "@/assets/arena-farm.jpg";
import arenaBuilding from "@/assets/arena-building.jpg";
import arenaDocks from "@/assets/arena-docks.jpg";

interface Arena {
  id: string;
  name: string;
  image: string;
}

const arenas: Arena[] = [
  { id: "warehouse", name: "ARENA ARMAZÉM", image: arenaWarehouse },
  { id: "farm", name: "ARENA FAZENDA", image: arenaFarm },
  { id: "building", name: "ARENA PRÉDIO", image: arenaBuilding },
  { id: "docks", name: "ARENA DOCAS", image: arenaDocks },
];

interface ArenaSelectorProps {
  selectedArena: string | null;
  onSelectArena: (arenaId: string) => void;
}

export function ArenaSelector({ selectedArena, onSelectArena }: ArenaSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-6"
    >
      <h2 className="font-display text-xl font-bold mb-4 uppercase tracking-wider">
        Selecione a Arena
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {arenas.map((arena, index) => (
          <motion.div
            key={arena.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelectArena(arena.id)}
            className={`map-card ${selectedArena === arena.id ? "selected" : ""}`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={arena.image}
                alt={arena.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <h3 className="font-display text-sm font-bold text-center">{arena.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Match Settings */}
      <div className="mt-6 flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>Valor da partida:</span>
          <span className="font-display text-foreground text-lg">$0</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Número de rounds:</span>
          <span className="font-display text-foreground text-lg">1</span>
        </div>
      </div>
    </motion.div>
  );
}
