import { useState, useEffect } from "react";
import { games } from "@/data/games";
import GameRules from "@/components/GameRules";
import BackButton from "@/components/BackButton";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍓", "🌟", "🎯", "🔥"];

interface Card {
  id: number;
  emoji: string;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): Card[] {
  const pairs = shuffle(EMOJIS).slice(0, 8);
  return shuffle([...pairs, ...pairs].map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false })));
}

export default function MemoryPage() {
  const [started, setStarted] = useState(false);
  const [cards, setCards] = useState<Card[]>(createCards);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const game = games.find(g => g.id === "memory")!;

  const allMatched = cards.every(c => c.matched);

  const handleFlip = (i: number) => {
    if (locked || cards[i].flipped || cards[i].matched || selected.length >= 2) return;
    const newCards = [...cards];
    newCards[i] = { ...newCards[i], flipped: true };
    setCards(newCards);
    setSelected(prev => [...prev, i]);
  };

  useEffect(() => {
    if (selected.length !== 2) return;
    setMoves(m => m + 1);
    const [a, b] = selected;
    if (cards[a].emoji === cards[b].emoji) {
      setCards(prev => prev.map((c, i) => (i === a || i === b) ? { ...c, matched: true } : c));
      setSelected([]);
    } else {
      setLocked(true);
      setTimeout(() => {
        setCards(prev => prev.map((c, i) => (i === a || i === b) ? { ...c, flipped: false } : c));
        setSelected([]);
        setLocked(false);
      }, 800);
    }
  }, [selected, cards]);

  const reset = () => { setCards(createCards()); setSelected([]); setMoves(0); setLocked(false); };

  if (!started) return (
    <>
      <BackButton />
      <GameRules game={game} onStart={() => setStarted(true)} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton />
      <h1 className="font-arcade text-sm text-accent mb-3">MEMORY</h1>
      <p className="font-arcade text-[10px] text-muted-foreground mb-4">Moves: {moves}</p>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-xs sm:max-w-sm">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleFlip(i)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg text-2xl sm:text-3xl flex items-center justify-center transition-all duration-300 ${
              card.flipped || card.matched
                ? "bg-card border border-accent/40 scale-100"
                : "bg-muted border border-border hover:border-accent/30 hover:scale-105"
            } ${card.matched ? "opacity-70" : ""}`}
          >
            {card.flipped || card.matched ? card.emoji : "?"}
          </button>
        ))}
      </div>

      {allMatched && (
        <div className="mt-6 text-center">
          <p className="font-arcade text-xs text-primary neon-text mb-3">YOU WIN! 🎉 ({moves} moves)</p>
          <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground font-arcade text-[10px] rounded-lg">
            PLAY AGAIN
          </button>
        </div>
      )}
    </div>
  );
}
