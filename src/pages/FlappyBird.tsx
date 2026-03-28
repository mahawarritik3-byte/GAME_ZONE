import { useState, useEffect, useRef, useCallback } from "react";
import { games } from "@/data/games";
import GameRules from "@/components/GameRules";
import BackButton from "@/components/BackButton";

const W = 320;
const H = 480;
const BIRD_SIZE = 20;
const PIPE_W = 50;
const GAP = 120;
const GRAVITY = 0.4;
const FLAP = -6.5;
const PIPE_SPEED = 2;

interface Pipe { x: number; topH: number; }

export default function FlappyBirdPage() {
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("flappy-best") || 0));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const birdY = useRef(H / 2);
  const vel = useRef(0);
  const pipes = useRef<Pipe[]>([]);
  const scoreRef = useRef(0);
  const frameRef = useRef(0);
  const game = games.find(g => g.id === "flappy-bird")!;

  const resetGame = useCallback(() => {
    birdY.current = H / 2;
    vel.current = 0;
    pipes.current = [];
    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    setPlaying(true);
  }, []);

  const flap = useCallback(() => {
    if (gameOver) { resetGame(); return; }
    if (!playing) { setPlaying(true); }
    vel.current = FLAP;
  }, [gameOver, playing, resetGame]);

  useEffect(() => {
    if (!started || !playing || gameOver) return;
    const handleKey = (e: KeyboardEvent) => { if (e.code === "Space") { e.preventDefault(); flap(); } };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [started, playing, gameOver, flap]);

  useEffect(() => {
    if (!started || !playing || gameOver) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const loop = () => {
      vel.current += GRAVITY;
      birdY.current += vel.current;

      // Pipes
      if (frameRef.current % 90 === 0) {
        const topH = 40 + Math.random() * (H - GAP - 80);
        pipes.current.push({ x: W, topH });
      }

      pipes.current = pipes.current.filter(p => p.x > -PIPE_W);
      const birdX = 60;

      for (const p of pipes.current) {
        p.x -= PIPE_SPEED;
        // Score
        if (Math.floor(p.x + PIPE_W) === birdX) {
          scoreRef.current++;
          setScore(scoreRef.current);
        }
        // Collision
        if (birdX + BIRD_SIZE > p.x && birdX < p.x + PIPE_W) {
          if (birdY.current < p.topH || birdY.current + BIRD_SIZE > p.topH + GAP) {
            setGameOver(true);
            setPlaying(false);
            setBest(b => { const n = Math.max(b, scoreRef.current); localStorage.setItem("flappy-best", String(n)); return n; });
            return;
          }
        }
      }

      if (birdY.current + BIRD_SIZE > H || birdY.current < 0) {
        setGameOver(true);
        setPlaying(false);
        setBest(b => { const n = Math.max(b, scoreRef.current); localStorage.setItem("flappy-best", String(n)); return n; });
        return;
      }

      // Draw
      ctx.fillStyle = "hsl(200, 60%, 15%)";
      ctx.fillRect(0, 0, W, H);

      // Pipes
      for (const p of pipes.current) {
        ctx.fillStyle = "hsl(160, 80%, 40%)";
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP);
        ctx.fillStyle = "hsl(160, 100%, 50%)";
        ctx.fillRect(p.x, p.topH - 4, PIPE_W, 4);
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, 4);
      }

      // Bird
      ctx.fillStyle = "hsl(40, 100%, 55%)";
      ctx.beginPath();
      ctx.arc(birdX + BIRD_SIZE / 2, birdY.current + BIRD_SIZE / 2, BIRD_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      frameRef.current++;
      requestAnimationFrame(loop);
    };

    frameRef.current = 0;
    const raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, playing, gameOver]);

  if (!started) return (
    <>
      <BackButton />
      <GameRules game={game} onStart={() => { resetGame(); setStarted(true); }} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton />
      <h1 className="font-arcade text-sm text-neon-pink mb-3" style={{ textShadow: "0 0 10px hsl(330,90%,60%,0.6)" }}>FLAPPY BIRD</h1>
      <div className="flex gap-6 mb-3 font-arcade text-[10px]">
        <span className="text-primary">Score: {score}</span>
        <span className="text-accent">Best: {best}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="border border-border rounded-lg cursor-pointer touch-none"
        style={{ width: Math.min(W, 320), height: Math.min(H, 480) }}
        onClick={flap}
        onTouchStart={(e) => { e.preventDefault(); flap(); }}
      />
      {gameOver && (
        <div className="mt-4 text-center">
          <p className="font-arcade text-xs text-destructive mb-3">GAME OVER!</p>
          <button onClick={resetGame} className="px-4 py-2 bg-primary text-primary-foreground font-arcade text-[10px] rounded-lg">RETRY</button>
        </div>
      )}
      {!gameOver && <p className="mt-3 text-muted-foreground text-xs">Tap or press Space</p>}
    </div>
  );
}
