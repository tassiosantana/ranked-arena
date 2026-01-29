import { motion } from "framer-motion";
import { Bomb, Crosshair } from "lucide-react";

export type GameType = "bomb" | "no-bomb";

interface GameTypeSelectorProps {
  selectedType: GameType;
  onSelectType: (type: GameType) => void;
}

export function GameTypeSelector({ selectedType, onSelectType }: GameTypeSelectorProps) {
  return (
    <div className="flex gap-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectType("bomb")}
        className={`
          flex-1 flex items-center justify-center gap-3 p-4
          border-2 rounded transition-all duration-200
          ${selectedType === "bomb" 
            ? "border-primary bg-primary/20 text-primary" 
            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
          }
        `}
      >
        <Bomb className="w-6 h-6" />
        <div className="text-left">
          <p className="font-display font-bold text-sm">PLANTAR BOMBA</p>
          <p className="text-xs opacity-70">Modo clássico</p>
        </div>
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelectType("no-bomb")}
        className={`
          flex-1 flex items-center justify-center gap-3 p-4
          border-2 rounded transition-all duration-200
          ${selectedType === "no-bomb" 
            ? "border-primary bg-primary/20 text-primary" 
            : "border-border bg-secondary/30 text-muted-foreground hover:border-primary/50"
          }
        `}
      >
        <Crosshair className="w-6 h-6" />
        <div className="text-left">
          <p className="font-display font-bold text-sm">SEM BOMBA</p>
          <p className="text-xs opacity-70">Eliminação</p>
        </div>
      </motion.button>
    </div>
  );
}
