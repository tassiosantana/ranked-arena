import { motion } from "framer-motion";
import { GameTypeSelector, GameType } from "./GameTypeSelector";

type GameMode = "1V1" | "2V2" | "3V3" | "4V4" | "5V5";

interface GameModeSelectorProps {
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedType: GameType;
  onSelectType: (type: GameType) => void;
  filterOn: boolean;
  onToggleFilter: () => void;
}

const modes: GameMode[] = ["1V1", "2V2", "3V3", "4V4", "5V5"];

export function GameModeSelector({
  selectedMode,
  onSelectMode,
  selectedType,
  onSelectType,
  filterOn,
  onToggleFilter,
}: GameModeSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 space-y-4"
    >
      {/* Game Type Selector */}
      <GameTypeSelector selectedType={selectedType} onSelectType={onSelectType} />

      {/* Mode Selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={onToggleFilter}
          className={`btn-gaming text-sm ${filterOn ? "bg-primary" : "bg-secondary text-foreground"}`}
        >
          FILTRO {filterOn ? "ON" : "OFF"}
        </button>

        {modes.map((mode) => (
          <button
            key={mode}
            onClick={() => onSelectMode(mode)}
            className={`btn-gaming text-sm ${
              selectedMode === mode ? "bg-primary" : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {mode}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
