import { Bomb } from "lucide-react";

export type GameType = "bomb";

interface GameTypeSelectorProps {
  selectedType: GameType;
  onSelectType: (type: GameType) => void;
}

export function GameTypeSelector({ selectedType, onSelectType }: GameTypeSelectorProps) {
  return (
    <div className="flex gap-3">
      <div
        className="flex-1 flex items-center justify-center gap-3 p-4 border-2 border-primary bg-primary/20 text-primary rounded transition-all duration-200"
        aria-label="Modo: Competitivo"
      >
        <Bomb className="w-6 h-6" />
        <div className="text-left">
          <p className="font-display font-bold text-sm">Modo Competitivo</p>
          <p className="text-xs opacity-70">Modo Competitivo</p>
        </div>
      </div>
    </div>
  );
}
