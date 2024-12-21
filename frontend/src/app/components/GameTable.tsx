'use client';
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import Card from './Card';

export default function GameTable() {
  const {
    playerHand,
    flop,
    turn,
    river,
    handleDrawHand,
    handleDrawFlop,
    handleDrawTurn,
    handleDrawRiver,
    handleResetGame
  } = useGame();

  const [aiAdvice, setAiAdvice] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);

  const handleGetAIAdvice = () => {
    setIsAILoading(true);
    setTimeout(() => {
      setAiAdvice('Consider the possibilities of a straight or flush...');
      setIsAILoading(false);
    }, 2000);
  };

  // Determine the next action based on game state
  const getActionButton = () => {
    if (river.length > 0) {
      return { label: 'Play New Hand', onClick: handleResetGame };
    } else if (turn.length > 0) {
      return { label: 'Draw River', onClick: handleDrawRiver };
    } else if (flop.length > 0) {
      return { label: 'Draw Turn', onClick: handleDrawTurn };
    } else {
      return { label: 'Draw Flop', onClick: handleDrawFlop };
    }
  };

  const { label, onClick } = getActionButton();

  return (
    <div className="flex flex-col items-center min-h-screen bg-slate-800">
      <div className="relative w-[800px] h-[400px] bg-green-700 rounded-full shadow-md border-4 border-gray-600 my-8">
        {/* Community cards container */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2">
          {flop.map((card, index) => (
            <Card key={`flop-${index}`} suit={card.suit} value={card.value} />
          ))}
          {turn.map((card, index) => (
            <Card key={`turn-${index}`} suit={card.suit} value={card.value} />
          ))}
          {river.map((card, index) => (
            <Card key={`river-${index}`} suit={card.suit} value={card.value} />
          ))}
        </div>

        {/* Player's hand container */}
        <div className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 flex gap-2">
          {playerHand.map((card, index) => (
            <Card key={`player-${index}`} suit={card.suit} value={card.value} />
          ))}
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 mt-40 mb-4">
        <button 
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDrawHand}
        >
          Draw Hand
        </button>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onClick}
        >
          {label}
        </button>
        <button 
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGetAIAdvice}
          disabled={!playerHand.length || !flop.length}
        >
          Get AI Advice
        </button>
      </div>

      {/* AI Advice section */}
      {(isAILoading || aiAdvice) && (
        <div className="w-full max-w-md p-4 rounded-lg bg-slate-700 text-white shadow-md">
          {isAILoading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="text-center">{aiAdvice}</div>
          )}
        </div>
      )}
    </div>
  );
}
