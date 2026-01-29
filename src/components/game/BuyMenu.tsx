import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart } from "lucide-react";

interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: "pistol" | "smg" | "rifle" | "utility";
  icon: string;
  weight?: string;
}

const shopItems: ShopItem[] = [
  { id: "pistol1", name: "PISTOL", price: 400, type: "pistol", icon: "🔫" },
  { id: "smg1", name: "TACTICAL SMG", price: 1000, type: "smg", icon: "🔫", weight: "5.0KG" },
  { id: "vest_heavy", name: "COLETE PESADO", price: 800, type: "utility", icon: "🛡️" },
  { id: "vest_light", name: "COLETE LEVE", price: 400, type: "utility", icon: "🛡️" },
  { id: "energy", name: "ENERGÉTICO COMUM", price: 200, type: "utility", icon: "🥤" },
];

type ShopCategory = "pistol" | "smg" | "rifle" | "utility";

interface BuyMenuProps {
  money: number;
  timeLeft: number;
  onBuy: (item: ShopItem) => void;
  onClose: () => void;
}

export function BuyMenu({ money, timeLeft, onBuy, onClose }: BuyMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>("pistol");
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null);
  const [cart, setCart] = useState<ShopItem[]>([]);

  const categories: { id: ShopCategory; label: string }[] = [
    { id: "pistol", label: "PISTOLAS" },
    { id: "utility", label: "UTILITÁRIOS" },
  ];

  const filteredItems = shopItems.filter((item) => 
    selectedCategory === "pistol" ? ["pistol", "smg", "rifle"].includes(item.type) : item.type === selectedCategory
  );

  const handleAddToCart = (item: ShopItem) => {
    if (money >= item.price) {
      setCart([...cart, item]);
      onBuy(item);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-8"
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="font-display text-3xl font-bold uppercase tracking-wider"
          >
            Tela de Compra
          </motion.h1>
          
          <div className="flex items-center gap-6">
            <span className="font-display text-2xl text-primary font-bold">${money.toLocaleString()}</span>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 glass-panel p-6">
            {/* Category Tabs */}
            <div className="flex gap-2 mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`btn-gaming text-sm ${
                    selectedCategory === cat.id ? "bg-primary" : "bg-secondary text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Items Grid */}
            <div className="grid grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedItem(item)}
                    className={`item-card flex items-center gap-4 ${
                      selectedItem?.id === item.id ? "selected" : ""
                    } ${money < item.price ? "opacity-50" : ""}`}
                  >
                    <div className="w-16 h-12 bg-secondary/50 rounded flex items-center justify-center text-2xl">
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qtd: 1</p>
                    </div>
                    <span className="font-display text-primary font-bold">${item.price}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Item Preview */}
          <div className="w-72 glass-panel p-6">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="btn-gaming text-center mb-4">
                  <span className="text-sm">{selectedItem.name}</span>
                </div>

                <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center text-6xl mb-4 glow-border">
                  {selectedItem.icon}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">VALOR DO ITEM:</span>
                    <span className="font-display font-bold">${selectedItem.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TIPO DE ITEM:</span>
                    <span className="font-display font-bold uppercase">{selectedItem.type}</span>
                  </div>
                  {selectedItem.weight && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">PESO DO ITEM:</span>
                      <span className="font-display font-bold">{selectedItem.weight}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(selectedItem)}
                  disabled={money < selectedItem.price}
                  className="btn-gaming w-full mt-6 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  COMPRAR
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Selecione um item
              </div>
            )}
          </div>
        </div>

        {/* Timer */}
        <div className="mt-6 text-center">
          <span className="text-muted-foreground">TEMPO DE COMPRA TERMINA EM: </span>
          <span className="font-display text-xl font-bold text-primary">{String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}</span>
        </div>
      </div>
    </motion.div>
  );
}
