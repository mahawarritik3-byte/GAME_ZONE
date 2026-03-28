import { GameInfo } from "@/data/games";

interface GameRulesProps {
  game: GameInfo;
  onStart: () => void;
}

export default function GameRules({ game, onStart }: GameRulesProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-card border border-border rounded-lg p-6 sm:p-8 neon-border">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{game.emoji}</div>
          <h1 className="font-arcade text-sm sm:text-base text-primary neon-text leading-relaxed">
            {game.title}
          </h1>
        </div>

        <div className="mb-6">
          <h2 className="font-arcade text-[10px] text-accent mb-4 uppercase tracking-wider">
            📜 Rules
          </h2>
          <ul className="space-y-3">
            {game.rules.map((rule, i) => (
              <li key={i} className="flex gap-3 text-sm text-foreground/80">
                <span className="text-primary font-arcade text-[10px] mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                <span className="leading-relaxed">{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onStart}
          className="w-full py-3 px-6 bg-primary text-primary-foreground font-arcade text-xs rounded-lg hover:opacity-90 transition-opacity neon-border"
        >
          START GAME
        </button>
      </div>
    </div>
  );
}
