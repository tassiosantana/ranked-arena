import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, UserPlus, LogIn, X, Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TeamCreationProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTeam: () => void;
  onJoinTeam: (teamCode: string) => void;
  teamCode?: string;
}

export function TeamCreation({ isOpen, onClose, onCreateTeam, onJoinTeam, teamCode }: TeamCreationProps) {
  const [mode, setMode] = useState<"select" | "create" | "join">("select");
  const [joinCode, setJoinCode] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    if (teamCode) {
      navigator.clipboard.writeText(teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    if (joinCode.trim()) {
      onJoinTeam(joinCode.trim());
      setJoinCode("");
      setMode("select");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            GERENCIAR TIME
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {mode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onCreateTeam();
                  setMode("create");
                }}
                className="w-full p-4 bg-primary/20 border-2 border-primary rounded flex items-center gap-4 hover:bg-primary/30 transition-colors"
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold">CRIAR TIME</p>
                  <p className="text-sm text-muted-foreground">Crie um lobby e convide jogadores</p>
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setMode("join")}
                className="w-full p-4 bg-secondary border-2 border-border rounded flex items-center gap-4 hover:border-primary/50 transition-colors"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center border border-border">
                  <LogIn className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-display font-bold">ENTRAR EM TIME</p>
                  <p className="text-sm text-muted-foreground">Entre com código do time</p>
                </div>
              </motion.button>
            </motion.div>
          )}

          {mode === "create" && teamCode && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Código do seu time:</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="px-6 py-3 bg-secondary rounded-lg font-display text-2xl tracking-widest">
                    {teamCode}
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="p-3 bg-primary rounded-lg hover:bg-primary/80 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-5 h-5 text-primary-foreground" />
                    ) : (
                      <Copy className="w-5 h-5 text-primary-foreground" />
                    )}
                  </button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Compartilhe este código com seus amigos
                </p>
              </div>

              <button
                onClick={() => setMode("select")}
                className="w-full btn-gaming-outline"
              >
                VOLTAR
              </button>
            </motion.div>
          )}

          {mode === "join" && (
            <motion.div
              key="join"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Código do time:
                </label>
                <Input
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="Ex: ABC123"
                  className="font-display text-lg tracking-widest text-center uppercase"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setMode("select")}
                  className="flex-1 btn-gaming-outline"
                >
                  VOLTAR
                </button>
                <button
                  onClick={handleJoin}
                  disabled={!joinCode.trim()}
                  className="flex-1 btn-gaming disabled:opacity-50"
                >
                  ENTRAR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
