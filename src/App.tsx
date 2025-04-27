// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { useEffect } from "react";
import { getSocket } from "@/socket";
import Game from "./pages/Game";
import { GameProvider } from "./contexts/GameContext";
import { SocketInitializer } from "./components/SocketInitializer";

const queryClient = new QueryClient();

const App = () => {
  
  return (
        <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
        <SocketInitializer />
        <Toaster />
        <Sonner />
          <AppRoutes />
        </GameProvider>
      </TooltipProvider>
    </QueryClientProvider>
        </BrowserRouter>
  );
};

export default App;
