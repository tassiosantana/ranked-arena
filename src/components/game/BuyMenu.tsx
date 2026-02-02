import { useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Shield,
  Zap,
  Wrench,
  Crosshair,
  CircleDot,
  Bomb,
  Flame,
  type LucideIcon,
} from "lucide-react";

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: "equipment" | "pistols" | "smgs" | "midtier" | "rifles" | "grenades";
  icon: LucideIcon;
  shortcut?: number;
}

const COLUMNS: { id: string; label: string; sublabel?: string; categories: ShopItem["category"][] }[] = [
  { id: "1", label: "Equipment", categories: ["equipment"] },
  { id: "2", label: "Pistols", categories: ["pistols"] },
  { id: "3", label: "SMGs", categories: ["smgs"] },
  { id: "4", label: "Mid-Tier", sublabel: "Rifles", categories: ["midtier", "rifles"] },
  { id: "5", label: "Grenades", categories: ["grenades"] },
];

const SHOP_ITEMS: ShopItem[] = [
  // Equipment
  { id: "kevlar", name: "Kevlar Vest", price: 650, category: "equipment", icon: Shield, shortcut: 1 },
  { id: "kevlar_helmet", name: "Kevlar + Helmet", price: 1000, category: "equipment", icon: Shield, shortcut: 2 },
  { id: "zeus", name: "Zeus x27", price: 200, category: "equipment", icon: Zap, shortcut: 3 },
  { id: "defuse", name: "Defuse Kit", price: 400, category: "equipment", icon: Wrench, shortcut: 4 },
  { id: "usps", name: "USP-S", price: 200, category: "equipment", icon: CircleDot, shortcut: 5 },
  // Pistols
  { id: "p250", name: "P250", price: 300, category: "pistols", icon: CircleDot, shortcut: 1 },
  { id: "dual", name: "Dual Berettas", price: 500, category: "pistols", icon: CircleDot, shortcut: 2 },
  { id: "fiveseven", name: "Five-SeveN", price: 500, category: "pistols", icon: CircleDot, shortcut: 3 },
  { id: "cz75", name: "CZ75-Auto", price: 500, category: "pistols", icon: CircleDot, shortcut: 4 },
  { id: "r8", name: "R8 Revolver", price: 600, category: "pistols", icon: CircleDot, shortcut: 5 },
  { id: "deagle", name: "Desert Eagle", price: 700, category: "pistols", icon: CircleDot, shortcut: 6 },
  // SMGs
  { id: "ump", name: "UMP-45", price: 1200, category: "smgs", icon: Crosshair, shortcut: 1 },
  { id: "mp9", name: "MP9", price: 1250, category: "smgs", icon: Crosshair, shortcut: 2 },
  { id: "bizon", name: "PP-Bizon", price: 1400, category: "smgs", icon: Crosshair, shortcut: 3 },
  { id: "mp7", name: "MP7", price: 1500, category: "smgs", icon: Crosshair, shortcut: 4 },
  { id: "mp5", name: "MP5-SD", price: 1500, category: "smgs", icon: Crosshair, shortcut: 5 },
  { id: "p90", name: "P90", price: 2350, category: "smgs", icon: Crosshair, shortcut: 6 },
  // Mid-Tier
  { id: "nova", name: "Nova", price: 1050, category: "midtier", icon: Crosshair, shortcut: 1 },
  { id: "mag7", name: "MAG-7", price: 1300, category: "midtier", icon: Crosshair, shortcut: 2 },
  { id: "xm1014", name: "XM1014", price: 2000, category: "midtier", icon: Crosshair, shortcut: 3 },
  { id: "ssg08", name: "SSG 08", price: 1700, category: "midtier", icon: Crosshair, shortcut: 4 },
  { id: "negev", name: "Negev", price: 1700, category: "midtier", icon: Crosshair, shortcut: 5 },
  { id: "m249", name: "M249", price: 5200, category: "midtier", icon: Crosshair, shortcut: 6 },
  // Rifles
  { id: "famas", name: "FAMAS", price: 2050, category: "rifles", icon: Crosshair, shortcut: 1 },
  { id: "m4a1s", name: "M4A1-S", price: 2900, category: "rifles", icon: Crosshair, shortcut: 2 },
  { id: "m4a4", name: "M4A4", price: 3100, category: "rifles", icon: Crosshair, shortcut: 3 },
  { id: "aug", name: "AUG", price: 3300, category: "rifles", icon: Crosshair, shortcut: 4 },
  { id: "awp", name: "AWP", price: 4750, category: "rifles", icon: Crosshair, shortcut: 5 },
  { id: "scar20", name: "SCAR-20", price: 5000, category: "rifles", icon: Crosshair, shortcut: 6 },
  // Grenades
  { id: "flash", name: "Flashbang", price: 200, category: "grenades", icon: Bomb, shortcut: 1 },
  { id: "smoke", name: "Smoke Grenade", price: 300, category: "grenades", icon: Bomb, shortcut: 2 },
  { id: "he", name: "High Explosive", price: 300, category: "grenades", icon: Bomb, shortcut: 3 },
  { id: "incendiary", name: "Incendiary", price: 600, category: "grenades", icon: Flame, shortcut: 4 },
  { id: "decoy", name: "Decoy", price: 50, category: "grenades", icon: Bomb, shortcut: 5 },
  { id: "molotov", name: "Molotov", price: 600, category: "grenades", icon: Flame, shortcut: 6 },
];

function formatBuyTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface BuyMenuProps {
  money: number;
  timeLeft: number;
  onBuy: (item: ShopItem) => void;
  onClose: () => void;
}

export function BuyMenu({ money, timeLeft, onBuy, onClose }: BuyMenuProps) {
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);

  const getItemsForColumn = (column: typeof COLUMNS[0]) => {
    return SHOP_ITEMS.filter((item) => column.categories.includes(item.category));
  };

  const handleBuy = (item: ShopItem) => {
    if (money >= item.price) {
      onBuy(item);
      setSelectedItem(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/50 backdrop-blur-[2px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="flex flex-col w-full max-w-4xl max-h-[85vh] rounded-lg border border-border bg-card/95 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar compacta: dinheiro | Tempo | Fechar */}
        <div className="grid grid-cols-3 items-center gap-2 px-3 py-2 border-b border-border shrink-0 bg-muted/30">
          <div className="font-display text-base font-bold text-primary">
            ${money.toLocaleString()}
          </div>
          <div className="text-center">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">
              Tempo restante
            </p>
            <p className="font-display text-sm font-bold text-primary tabular-nums">
              {formatBuyTime(timeLeft)}
            </p>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="w-7 h-7 rounded bg-secondary/80 hover:bg-destructive/20 flex items-center justify-center transition-colors border border-border"
              aria-label="Fechar"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Grid 5 colunas - compacto */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 p-2 min-h-0 overflow-auto scrollbar-menu">
          {COLUMNS.map((col) => {
            const items = getItemsForColumn(col);
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col rounded border border-border/80 bg-card/60 overflow-hidden min-w-0"
              >
                <div className="px-2 py-1.5 bg-muted/40 border-b border-border/60 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-primary text-[10px]">{col.id}</span>
                    <div className="min-w-0">
                      <p className="font-display font-bold text-[10px] uppercase truncate">{col.label}</p>
                      {col.sublabel && (
                        <p className="text-[9px] text-muted-foreground uppercase truncate">{col.sublabel}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[320px] scrollbar-menu">
                  {items.map((item) => {
                    const canBuy = money >= item.price;
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          if (canBuy) handleBuy(item);
                        }}
                        className={`w-full flex items-center gap-2 py-1.5 px-2 rounded border text-left transition-colors ${
                          isSelected
                            ? "border-primary bg-primary/20"
                            : canBuy
                              ? "border-border/40 hover:border-primary/50 hover:bg-muted/20"
                              : "border-border/30 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        <span className="text-[10px] font-mono text-muted-foreground w-4 shrink-0">
                          {item.shortcut ?? ""}
                        </span>
                        <div className="w-8 h-8 rounded bg-muted/50 flex items-center justify-center shrink-0">
                          <item.icon className="w-4 h-4 text-foreground/80" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold truncate leading-tight">{item.name}</p>
                          <p className="font-display text-[10px] font-bold text-primary">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-[9px] text-muted-foreground py-1.5 border-t border-border/60">
          Clique para comprar • Saldo: ${money.toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
}
