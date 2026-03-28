import { games } from "@/data/games";
import GameCard from "@/components/GameCard";

export default function Index() {
  return (
    <div className="min-h-screen scanlines">
      <div className="container py-8 sm:py-12">
        <header className="text-center mb-10 sm:mb-14">
          <h1 className="font-arcade text-lg sm:text-2xl text-primary neon-text mb-3 leading-relaxed">
            🎮 GAME ZONE
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            Pick a game and start playing. Have fun!
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>

       <footer className="text-center mt-12 text-muted-foreground text-xs font-arcade">
  LEVEL UP YOUR FUN 🚀 | MADE BY RITIK | VISIT PORTFOLIO :{" "}
  <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
    Click Here
  </a>
</footer>
      </div>
    </div>
  );
}
