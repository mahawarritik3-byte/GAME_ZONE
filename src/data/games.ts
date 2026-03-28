export interface GameInfo {
  id: string;
  title: string;
  emoji: string;
  description: string;
  color: string;
  rules: string[];
  path: string;
}

export const games: GameInfo[] = [
  {
    id: "tic-tac-toe",
    title: "Tic-Tac-Toe",
    emoji: "❌⭕",
    description: "Classic 2-player strategy game. Get 3 in a row to win!",
    color: "neon-green",
    path: "/games/tic-tac-toe",
    rules: [
      "The game is played on a 3×3 grid.",
      "Player 1 is X and Player 2 is O. Players take turns.",
      "Place your mark in any empty square.",
      "The first player to get 3 marks in a row (horizontal, vertical, or diagonal) wins!",
      "If all 9 squares are filled with no winner, the game is a draw.",
      "You can also play against an AI opponent! 🤖",
    ],
  },
  {
    id: "snake",
    title: "Snake Game",
    emoji: "🐍",
    description: "Guide the snake to eat food and grow longer without hitting walls!",
    color: "neon-purple",
    path: "/games/snake",
    rules: [
      "Use arrow keys or swipe to control the snake's direction.",
      "Eat the red food to grow longer and score points.",
      "Don't hit the walls or your own tail — it's game over!",
      "The snake speeds up as you score more points.",
      "Try to beat your high score! 🏆",
    ],
  },
  {
    id: "memory",
    title: "Memory Cards",
    emoji: "🧠",
    description: "Test your memory by matching pairs of cards!",
    color: "neon-orange",
    path: "/games/memory",
    rules: [
      "Cards are placed face down in a grid.",
      "Flip two cards per turn by tapping them.",
      "If they match, they stay face up. If not, they flip back.",
      "Remember card positions to find matches faster!",
      "Match all pairs to win. Try to do it in fewer moves! ⏱️",
    ],
  },
  {
    id: "flappy-bird",
    title: "Flappy Bird",
    emoji: "🐦",
    description: "Tap to fly through gaps between pipes. Don't crash!",
    color: "neon-pink",
    path: "/games/flappy-bird",
    rules: [
      "Tap or click anywhere to make the bird flap upward.",
      "The bird constantly falls due to gravity.",
      "Navigate through the gaps between the pipes.",
      "Hitting a pipe or the ground ends the game.",
      "Each pipe passed scores 1 point. How far can you go? 🌟",
    ],
  },
  {
    id: "car-dodge",
    title: "Car Dodging",
    emoji: "🚗",
    description: "Dodge incoming traffic and survive as long as you can!",
    color: "neon-blue",
    path: "/games/car-dodge",
    rules: [
      "Use arrow keys or swipe left/right to move your car.",
      "Avoid the oncoming cars — a collision ends the game!",
      "Cars come faster as your score increases.",
      "Stay alive as long as possible to get a high score.",
      "Quick reflexes are the key to survival! 🏎️",
    ],
  },
];
