import { useState, useCallback } from "react";
import { games } from "@/data/games";
import GameRules from "@/components/GameRules";
import BackButton from "@/components/BackButton";

type Cell = "X" | "O" | null;
type Mode = "pvp" | "ai";

const WIN_COMBOS = [
  [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6],
];

function checkWinner(board: Cell[]): Cell {
  for (const [a,b,c] of WIN_COMBOS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return null;
}

function minimax(board: Cell[], isMax: boolean): number {
  const winner = checkWinner(board);
  if (winner === "O") return 10;
  if (winner === "X") return -10;
  if (board.every(c => c !== null)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = null;
      }
    }
    return best;
  }
}

function aiMove(board: Cell[]): number {
  let bestVal = -Infinity;
  let bestMove = -1;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = "O";
      const val = minimax(board, false);
      board[i] = null;
      if (val > bestVal) { bestVal = val; bestMove = i; }
    }
  }
  return bestMove;
}

export default function TicTacToePage() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState<Mode>("pvp");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const game = games.find(g => g.id === "tic-tac-toe")!;

  const winner = checkWinner(board);
  const isDraw = !winner && board.every(c => c !== null);

  const handleClick = useCallback((i: number) => {
    if (board[i] || winner || isDraw) return;
    const newBoard = [...board];
    newBoard[i] = isXTurn ? "X" : "O";
    setBoard(newBoard);

    const w = checkWinner(newBoard);
    if (w) { setScores(s => ({ ...s, [w]: s[w as "X"|"O"] + 1 })); return; }
    if (newBoard.every(c => c !== null)) { setScores(s => ({ ...s, draws: s.draws + 1 })); return; }

    if (mode === "ai" && isXTurn) {
      const move = aiMove([...newBoard]);
      if (move >= 0) {
        newBoard[move] = "O";
        setBoard([...newBoard]);
        const w2 = checkWinner(newBoard);
        if (w2) setScores(s => ({ ...s, O: s.O + 1 }));
        else if (newBoard.every(c => c !== null)) setScores(s => ({ ...s, draws: s.draws + 1 }));
      }
    } else {
      setIsXTurn(!isXTurn);
    }
  }, [board, isXTurn, winner, isDraw, mode]);

  const reset = () => { setBoard(Array(9).fill(null)); setIsXTurn(true); };

  if (!started) return (
    <>
      <BackButton />
      <GameRules game={game} onStart={() => setStarted(true)} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <BackButton />
      <h1 className="font-arcade text-sm text-primary neon-text mb-4">TIC-TAC-TOE</h1>

      <div className="flex gap-3 mb-4">
        <button onClick={() => { setMode("pvp"); reset(); }} className={`px-3 py-1.5 rounded text-xs font-arcade transition-colors ${mode === "pvp" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>2 PLAYER</button>
        <button onClick={() => { setMode("ai"); reset(); }} className={`px-3 py-1.5 rounded text-xs font-arcade transition-colors ${mode === "ai" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>VS AI 🤖</button>
      </div>

      <div className="flex gap-6 mb-4 font-arcade text-[10px]">
        <span className="text-neon-green">X: {scores.X}</span>
        <span className="text-muted-foreground">Draw: {scores.draws}</span>
        <span className="text-neon-purple">O: {scores.O}</span>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {board.map((cell, i) => (
          <button key={i} onClick={() => handleClick(i)}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-card border border-border rounded-lg flex items-center justify-center text-3xl sm:text-4xl font-bold transition-all hover:border-primary/50 active:scale-95"
          >
            {cell === "X" && <span className="text-neon-green">✕</span>}
            {cell === "O" && <span className="text-neon-purple">○</span>}
          </button>
        ))}
      </div>

      {(winner || isDraw) && (
        <div className="text-center mb-4">
          <p className="font-arcade text-xs mb-3 text-accent">
            {winner ? `${winner} WINS! 🎉` : "IT'S A DRAW! 🤝"}
          </p>
          <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground font-arcade text-[10px] rounded-lg">
            PLAY AGAIN
          </button>
        </div>
      )}

      {!winner && !isDraw && (
        <p className="font-arcade text-[10px] text-muted-foreground">
          {mode === "ai" ? "YOUR TURN (X)" : `${isXTurn ? "X" : "O"}'S TURN`}
        </p>
      )}
    </div>
  );
}
