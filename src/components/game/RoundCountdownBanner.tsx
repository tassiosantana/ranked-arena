import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface RoundCountdownBannerProps {
  seconds: number;
}

export function RoundCountdownBanner({ seconds }: RoundCountdownBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="fixed inset-0 flex items-center justify-center z-40 px-4 pointer-events-none"
    >
      <div className="bg-card/95 backdrop-blur-md rounded-xl border border-primary/50 shadow-xl px-6 py-4 flex items-center justify-center gap-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-7 h-7 text-primary" />
        </div>
        <p className="font-display font-bold text-lg sm:text-xl text-center uppercase tracking-wide text-foreground">
          O round irá iniciar em {seconds} segundo{seconds !== 1 ? "s" : ""}
        </p>
      </div>
    </motion.div>
  );
}
