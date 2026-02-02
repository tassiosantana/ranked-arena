import { motion } from "framer-motion";
import { type LucideIcon, PackageX } from "lucide-react";

export interface WeaponSlotItem {
  name: string;
  icon: LucideIcon;
}

interface WeaponSelectorProps {
  /** Slots 1 (primária), 2 (pistola), 3 (faca). null = slot vazio. */
  slots: (WeaponSlotItem | null)[];
}

export function WeaponSelector({ slots }: WeaponSelectorProps) {
  const displaySlots = [slots[0] ?? null, slots[1] ?? null, slots[2] ?? null];

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
      {displaySlots.map((item, i) => {
        const slotNum = i + 1;
        const isEmpty = !item;
        return (
          <motion.div
            key={slotNum}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-lg border shadow-lg p-3 flex items-center gap-3 min-w-[140px] ${
              isEmpty
                ? "bg-card/50 border-border/50 border-dashed"
                : "bg-card/90 backdrop-blur-md border-border/80"
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-team-a/80 flex items-center justify-center shrink-0">
              <span className="font-display text-sm font-bold text-white">{slotNum}</span>
            </div>
            <div className="w-px h-8 bg-border shrink-0" />
            <div className="flex flex-col items-start min-w-0 flex-1">
              {isEmpty ? (
                <>
                  <PackageX className="w-5 h-5 text-muted-foreground/60 mb-0.5" />
                  <span className="font-display text-xs text-muted-foreground italic">Vazio</span>
                </>
              ) : (
                <>
                  <item.icon className="w-5 h-5 text-muted-foreground mb-0.5" />
                  <span className="font-display font-semibold text-sm text-foreground truncate">
                    {item.name}
                  </span>
                </>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
