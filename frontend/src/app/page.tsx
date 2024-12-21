"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-green-700">
      <div className="text-center">
        <h1 className="text-6xl font-serif text-white mb-8 tracking-wide">
          poker-coach
        </h1>
        <Link href="/customize-game">
          <button
            className="px-8 py-4 bg-white text-green-700 rounded-lg font-medium text-lg shadow-md transition-all hover:shadow-lg hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Start Game
          </button>
        </Link>
      </div>
    </div>
  );
}

