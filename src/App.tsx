import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LobbyEntryPage from "./pages/LobbyEntryPage";
import LobbyPage from "./pages/LobbyPage";
import BuyPage from "./pages/BuyPage";
import MapBanPage from "./pages/MapBanPage";
import MatchPage from "./pages/MatchPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LobbyEntryPage />} />
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/buy" element={<BuyPage />} />
          <Route path="/mapban" element={<MapBanPage />} />
          <Route path="/match" element={<MatchPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
