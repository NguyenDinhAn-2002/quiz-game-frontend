// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { GameProvider } from "./contexts/GameContext";
import { AuthProvider } from "./contexts/AuthContext";



const queryClient = new QueryClient();

const App = () => {
  
  return (
        <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
        <GameProvider>
        <Toaster />
        <Sonner />
          <AppRoutes />
        </GameProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
        </BrowserRouter>
  );
};

export default App;
