import { motion } from "framer-motion";
import { GameTypeSelector, GameType } from "./GameTypeSelector";

export type GameMode = "5V5";

interface GameModeSelectorProps {
  selectedType: GameType;
  onSelectType: (type: GameType) => void;
}

export function GameModeSelector({
  selectedType,
  onSelectType,
}: GameModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-4"
    >
      {/* Game Type Selector */}
      <GameTypeSelector selectedType={selectedType} onSelectType={onSelectType} />

      {/* Modo fixo 5v5 */}
      <div className="flex items-center justify-center gap-4">
        <span className="btn-gaming text-sm bg-primary/20 text-primary border border-primary/50 pointer-events-none">
          5V5
        </span>
      </div>
    </motion.div>
  );
}
