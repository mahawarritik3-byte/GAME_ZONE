import { useState, useEffect, useRef, useCallback } from "react";
import { games } from "@/data/games";
import GameRules from "@/components/GameRules";
import BackButton from "@/components/BackButton";

const W = 300;
const H = 500;
const LANES = [60, 120, 180, 240];
const CAR_W = 36;
const CAR_H = 60;
const PLAYER_Y = H - 90;

interface EnemyCar { x: number; y: number; color: string; }

const COLORS = ["hsl(0,80%,55%)", "hsl(40,100%,55%)", "hsl(200,100%,55%)", "hsl(270,80%,60%)"];

export default function CarDodgePage() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("car-best") || 0));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerLane = useRef(1);
  const enemies = useRef<EnemyCar[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const touchStartX = useRef(0);
  const game = games.find(g => g.id === "car-dodge")!;

  const resetGame = useCallback(() => {
    playerLane.current = 1;
    enemies.current = [];
    scoreRef.current = 0;
    frameRef.current = 0;
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!started || !playing || gameOver) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && playerLane.current > 0) { playerLane.current--; e.preventDefault(); }
      if (e.key === "ArrowRight" && playerLane.current < LANES.length - 1) { playerLane.current++; e.preventDefault(); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, playing, gameOver]);

  useEffect(() => {
    if (!started || !playing || gameOver) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      const speed = 3 + Math.floor(scoreRef.current / 5) * 0.5;
      const spawnRate = Math.max(30, 60 - Math.floor(scoreRef.current / 3) * 3);

      if (frameRef.current % spawnRate === 0) {
        const lane = Math.floor(Math.random() * LANES.length);
        enemies.current.push({ x: LANES[lane], y: -CAR_H, color: COLORS[Math.floor(Math.random() * COLORS.length)] });
      }

      const px = LANES[playerLane.current];

      for (const e of enemies.current) {
        e.y += speed;
        // Collision
        if (e.y + CAR_H > PLAYER_Y && e.y < PLAYER_Y + CAR_H &&
            e.x + CAR_W > px && e.x < px + CAR_W) {
          setGameOver(true);
          setPlaying(false);
          setBest(b => { const n = Math.max(b, scoreRef.current); localStorage.setItem("car-best", String(n)); return n; });
          return;
        }
      }

      enemies.current = enemies.current.filter(e => e.y < H);

      if (frameRef.current % 15 === 0) {
        scoreRef.current++;
        setScore(scoreRef.current);
      }

      // Draw road
      ctx.fillStyle = "hsl(0, 0%, 12%)";
      ctx.fillRect(0, 0, W, H);
      // Lane lines
      for (let i = 1; i < LANES.length; i++) {
        ctx.strokeStyle = "hsl(0, 0%, 25%)";
        ctx.setLineDash([20, 15]);
        ctx.beginPath();
        ctx.moveTo(LANES[i] - 12, 0);
        ctx.lineTo(LANES[i] - 12, H);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Enemies
      for (const e of enemies.current) {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, CAR_W, CAR_H);
        ctx.fillStyle = "hsl(0,0%,20%)";
        ctx.fillRect(e.x + 4, e.y + 4, CAR_W - 8, 12);
        ctx.fillRect(e.x + 4, e.y + CAR_H - 16, CAR_W - 8, 12);
      }

      // Player
      ctx.fillStyle = "hsl(160, 100%, 50%)";
      ctx.fillRect(px, PLAYER_Y, CAR_W, CAR_H);
      ctx.fillStyle = "hsl(160, 80%, 35%)";
      ctx.fillRect(px + 4, PLAYER_Y + 4, CAR_W - 8, 12);
      ctx.fillRect(px + 4, PLAYER_Y + CAR_H - 16, CAR_W - 8, 12);

      frameRef.current++;
      requestAnimationFrame(loop);
    };

    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, playing, gameOver]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 30) {
      if (dx < 0 && playerLane.current > 0) playerLane.current--;
      if (dx > 0 && playerLane.current < LANES.length - 1) playerLane.current++;
    }
  };

  if (!started) return (
    <>
      <BackButton />
      <GameRules game={game} onStart={() => { resetGame(); setStarted(true); }} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton />
      <h1 className="font-arcade text-sm text-neon-blue mb-3" style={{ textShadow: "0 0 10px hsl(200,100%,55%,0.6)" }}>CAR DODGE</h1>
      <div className="flex gap-6 mb-3 font-arcade text-[10px]">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">Best: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border border-border rounded-lg touch-none"
        style={{ width: Math.min(W, 300), height: Math.min(H, 500) }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="font-arcade text-xs text-destructive mb-3">CRASHED! 💥</p>
          <button onClick={resetGame} className="px-4 py-2 bg-primary text-primary-foreground font-arcade text-[10px] rounded-lg">RETRY</button>
        </div>
      )}
      {!gameOver && <p className="mt-3 text-muted-foreground text-xs">Swipe or use ← → keys</p>}
    </div>
  );
}
