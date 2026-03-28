import { useNavigate } from "react-router-dom";
import { GameInfo } from "@/data/games";

const colorMap: Record<string, string> = {
  "neon-green": "neon-border border-neon-green/30 hover:border-neon-green/60",
  "neon-purple": "neon-border-purple border-neon-purple/30 hover:border-neon-purple/60",
  "neon-orange": "border-neon-orange/30 hover:border-neon-orange/60",
  "neon-pink": "border-neon-pink/30 hover:border-neon-pink/60",
  "neon-blue": "border-neon-blue/30 hover:border-neon-blue/60",
};

const glowMap: Record<string, string> = {
  "neon-green": "group-hover:shadow-[0_0_20px_hsl(160,100%,50%,0.3)]",
  "neon-purple": "group-hover:shadow-[0_0_20px_hsl(270,80%,60%,0.3)]",
  "neon-orange": "group-hover:shadow-[0_0_20px_hsl(40,100%,55%,0.3)]",
  "neon-pink": "group-hover:shadow-[0_0_20px_hsl(330,90%,60%,0.3)]",
  "neon-blue": "group-hover:shadow-[0_0_20px_hsl(200,100%,55%,0.3)]",
};

export default function GameCard({ game }: { game: GameInfo }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(game.path)}
      className={`group game-card-hover w-full rounded-lg border bg-card p-5 sm:p-6 text-left transition-all ${colorMap[game.color] || ""} ${glowMap[game.color] || ""}`}
    >
      <div className="text-4xl sm:text-5xl mb-3 animate-float">{game.emoji}</div>
      <h2 className="font-arcade text-xs sm:text-sm text-foreground mb-2 leading-relaxed">
        {game.title}
      </h2>
      <p className="text-muted-foreground text-sm leading-relaxed">{game.description}</p>
      <div className="mt-4 font-arcade text-[10px] text-primary animate-pulse-neon">
        PLAY →
      </div>
    </button>
  );
}
