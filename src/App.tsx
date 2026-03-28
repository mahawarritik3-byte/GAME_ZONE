import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import TicTacToe from "./pages/TicTacToe.tsx";
import SnakeGame from "./pages/SnakeGame.tsx";
import MemoryGame from "./pages/MemoryGame.tsx";
import FlappyBird from "./pages/FlappyBird.tsx";
import CarDodge from "./pages/CarDodge.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/games/tic-tac-toe" element={<TicTacToe />} />
          <Route path="/games/snake" element={<SnakeGame />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/games/flappy-bird" element={<FlappyBird />} />
          <Route path="/games/car-dodge" element={<CarDodge />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
