"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomizeGamePage() {
  const [numPlayers, setNumPlayers] = useState(2); // Default number of players
  const router = useRouter();

  const handleStartGame = () => {
    // Navigate to /game with the number of players
    router.push(`/game?players=${numPlayers}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h1 className="text-4xl font-bold mb-8">Customize Your Game</h1>
      
      <label htmlFor="numPlayers" className="text-lg mb-4">
        Number of Players:
      </label>
      
      <input
        id="numPlayers"
        type="number"
        min={2}
        max={10} // Max players for a typical poker game
        value={numPlayers}
        onChange={(e) => setNumPlayers(parseInt(e.target.value, 10))}
        className="w-16 p-2 text-center text-black rounded-md border border-gray-400"
      />

      <button
        onClick={handleStartGame}
        className="mt-6 px-6 py-3 bg-green-500 rounded-lg text-lg font-medium hover:bg-green-600 transition-all"
      >
        Start Game
      </button>
    </div>
  );
}

