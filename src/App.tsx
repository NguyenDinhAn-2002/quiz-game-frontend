// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes";
import { GameProvider } from "./context/GameContext";



const queryClient = new QueryClient();

const App = () => {
  
  return (
        <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <GameProvider>
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
