import { useState, useEffect, useCallback, useRef } from "react";
import { games } from "@/data/games";
import GameRules from "@/components/GameRules";
import BackButton from "@/components/BackButton";

type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Pos = { x: number; y: number };

const GRID = 20;
const CELL = 18;
const INITIAL_SPEED = 150;

export default function SnakePage() {
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem("snake-high") || 0));
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 15, y: 15 });
  const [dir, setDir] = useState<Dir>("RIGHT");
  const dirRef = useRef<Dir>("RIGHT");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const game = games.find(g => g.id === "snake")!;

  const spawnFood = useCallback((s: Pos[]): Pos => {
    let f: Pos;
    do { f = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) }; }
    while (s.some(p => p.x === f.x && p.y === f.y));
    return f;
  }, []);

  const resetGame = () => {
    const s = [{ x: 10, y: 10 }];
    setSnake(s);
    setFood(spawnFood(s));
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    if (!started || gameOver) return;

    const handleKey = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: "UP", ArrowDown: "DOWN", ArrowLeft: "LEFT", ArrowRight: "RIGHT" };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
      if (d !== opp[dirRef.current]) { dirRef.current = d; setDir(d); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, gameOver]);

  useEffect(() => {
    if (!started || gameOver) return;
    const speed = Math.max(60, INITIAL_SPEED - score * 3);
    const interval = setInterval(() => {
      setSnake(prev => {
        const head = { ...prev[0] };
        const d = dirRef.current;
        if (d === "UP") head.y--;
        if (d === "DOWN") head.y++;
        if (d === "LEFT") head.x--;
        if (d === "RIGHT") head.x++;

        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID || prev.some(p => p.x === head.x && p.y === head.y)) {
          setGameOver(true);
          setHighScore(h => { const nh = Math.max(h, score); localStorage.setItem("snake-high", String(nh)); return nh; });
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, speed);
    return () => clearInterval(interval);
  }, [started, gameOver, food, score, spawnFood]);

  // Draw
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const size = GRID * CELL;
    ctx.fillStyle = "hsl(240, 12%, 13%)";
    ctx.fillRect(0, 0, size, size);
    // Food
    ctx.fillStyle = "hsl(0, 80%, 55%)";
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2.5, 0, Math.PI * 2);
    ctx.fill();
    // Snake
    snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "hsl(160, 100%, 50%)" : "hsl(160, 80%, 40%)";
      ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2);
    });
  }, [snake, food]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
    let d: Dir;
    if (Math.abs(dx) > Math.abs(dy)) d = dx > 0 ? "RIGHT" : "LEFT";
    else d = dy > 0 ? "DOWN" : "UP";
    if (d !== opp[dirRef.current]) { dirRef.current = d; setDir(d); }
  };

  if (!started) return (
    <>
      <BackButton />
      <GameRules game={game} onStart={() => { resetGame(); setStarted(true); }} />
    </>
  );

  const size = GRID * CELL;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton />
      <h1 className="font-arcade text-sm text-secondary neon-text-purple mb-3">SNAKE</h1>
      <div className="flex gap-6 mb-3 font-arcade text-[10px]">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">Best: {highScore}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="border border-border rounded-lg touch-none"
        style={{ width: Math.min(size, 360), height: Math.min(size, 360) }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="font-arcade text-xs text-destructive mb-3">GAME OVER!</p>
          <button onClick={resetGame} className="px-4 py-2 bg-primary text-primary-foreground font-arcade text-[10px] rounded-lg">
            RETRY
          </button>
        </div>
      )}
      <p className="mt-3 text-muted-foreground text-xs">Swipe or use arrow keys</p>
    </div>
  );
}
