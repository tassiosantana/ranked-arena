import { motion, AnimatePresence } from "framer-motion";
import { Crosshair } from "lucide-react";

interface DuelDisplayProps {
  duels: {
    id: string;
    playerA: { id: number; name: string };
    playerB: { id: number; name: string };
  }[];
}

export function DuelDisplay({ duels }: DuelDisplayProps) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 space-y-3">
      <AnimatePresence>
        {duels.map((duel, index) => (
          <motion.div
            key={duel.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 glass-panel p-3 glow-border-intense"
          >
            {/* Player A */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary flex items-center justify-center">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <span className="text-primary font-bold">#{duel.playerA.id}</span>
                <span className="ml-2 font-semibold">{duel.playerA.name}</span>
              </div>
            </div>

            {/* Weapon Icon */}
            <div className="px-2 flex items-center">
              <Crosshair className="w-5 h-5 text-primary" />
            </div>

            {/* Player B */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">#{duel.playerB.id}</span>
              <span className="text-muted-foreground">{duel.playerB.name}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
