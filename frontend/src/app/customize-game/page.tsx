"use client";

import { useRouter } from "next/navigation";
import { useGame } from "@/app/contexts/GameContext";

export default function CustomizeGamePage() {
  const { playerCount, setPlayerCount } = useGame();
  const router = useRouter();

  const handleStartGame = () => {
    // Navigate to /game (player count is already saved in context)
    router.push('/game');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-8">Customize Your Game</h1>
      
      <label htmlFor="numPlayers" className="text-lg mb-4">
        Number of Players at Table:
      </label>
      
      <input
        id="numPlayers"
        type="number"
        min={2}
        max={9} // Max 9 players for Texas Hold'em
        value={playerCount}
        onChange={(e) => setPlayerCount(Math.max(2, Math.min(9, parseInt(e.target.value, 10) || 2)))}
        className="w-20 p-2 text-center text-black rounded-md border border-gray-400"
      />
      
      <p className="text-sm text-gray-400 mt-2">
        (You vs {playerCount - 1} {playerCount - 1 === 1 ? 'opponent' : 'opponents'})
      </p>

      <button
        onClick={handleStartGame}
        className="mt-6 px-6 py-3 bg-green-500 rounded-lg text-lg font-medium hover:bg-green-600 transition-all"
      >
        Start Game
      </button>
    </div>
  );
}

