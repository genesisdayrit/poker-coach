'use client';
import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import Card from './Card';
import GTORecommendation from './GTORecommendation';
import PostFlopAnalysis from './PostFlopAnalysis';
import WinProbability from './WinProbability';
import type { Position } from '../utils/gtoRanges';

export default function GameTable() {
  const {
    playerHand,
    flop,
    turn,
    river,
    currentGameState,
    getGameStateDescription,
    handleDrawHand,
    handleDrawFlop,
    handleDrawTurn,
    handleDrawRiver,
    handleResetGame
  } = useGame();

  const [aiAdvice, setAiAdvice] = useState('');
  const [isAILoading, setIsAILoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position>('BTN');

  // Clear advice on game state changes
  const handleDrawHandWithReset = () => {
    setAiAdvice('');
    setIsAILoading(false);
    handleDrawHand();
  };

  const handleDrawFlopWithReset = () => {
    setAiAdvice('');
    setIsAILoading(false);
    handleDrawFlop();
  };

  const handleDrawTurnWithReset = () => {
    setAiAdvice('');
    setIsAILoading(false);
    handleDrawTurn();
  };

  const handleDrawRiverWithReset = () => {
    setAiAdvice('');
    setIsAILoading(false);
    handleDrawRiver();
  };

  const handleResetGameWithReset = () => {
    setAiAdvice('');
    setIsAILoading(false);
    handleResetGame();
  };

  const handleGetAIAdvice = async () => {
    setIsAILoading(true);
    setAiAdvice('');

    try {
      const response = await fetch('/api/ai-advice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameState: currentGameState,
          playerHand: playerHand.length > 0 ? getGameStateDescription().split('\n')[1] : '',
          flop: flop.length > 0 ? getGameStateDescription().split('\n')[2] : '',
          turn: turn.length > 0 ? getGameStateDescription().split('\n')[3] : '',
          river: river.length > 0 ? getGameStateDescription().split('\n')[4] : '',
        }),
      });

      if (!response.ok) throw new Error('Failed to get advice');
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode and append the new chunk
        const chunk = decoder.decode(value);
        content += chunk;
        
        // Update the advice with the accumulated content
        setAiAdvice(content);
      }
    } catch (error) {
      console.error('Error getting AI advice:', error);
      setAiAdvice('Sorry, there was an error getting advice. Please try again.');
    } finally {
      setIsAILoading(false);
    }
  };

  const getActionButton = () => {
    if (river.length > 0) {
      return { label: 'Play New Hand', onClick: handleResetGameWithReset };
    } else if (turn.length > 0) {
      return { label: 'Draw River', onClick: handleDrawRiverWithReset };
    } else if (flop.length > 0) {
      return { label: 'Draw Turn', onClick: handleDrawTurnWithReset };
    } else {
      return { label: 'Draw Flop', onClick: handleDrawFlopWithReset };
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
          onClick={handleDrawHandWithReset}
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
          disabled={!playerHand.length}
        >
          Get AI Advice
        </button>
      </div>

      {/* Strategy Advice section */}
      {playerHand.length === 2 && (
        <div className="w-full max-w-2xl space-y-4">
          {/* Pre-Flop: GTO Recommendation */}
          {flop.length === 0 && (
            <GTORecommendation 
              card1={playerHand[0]} 
              card2={playerHand[1]} 
              position={selectedPosition}
              onPositionChange={setSelectedPosition}
            />
          )}

          {/* Post-Flop: Hand Strength Analysis */}
          {flop.length > 0 && (
            <PostFlopAnalysis 
              playerHand={playerHand}
              communityCards={[...flop, ...turn, ...river]}
            />
          )}

          {/* Win Probability (shown at all stages) */}
          <WinProbability 
            playerHand={playerHand}
            communityCards={[...flop, ...turn, ...river]}
            opponentCount={1}
          />
          
          {/* AI Advice (always available) */}
          {(isAILoading || aiAdvice) && (
            <div className="p-4 rounded-lg bg-slate-700 text-white shadow-md border border-slate-600">
              <h3 className="text-white font-bold text-sm mb-2">AI Analysis</h3>
              <div className="text-gray-200">
                {aiAdvice}
                {isAILoading && (
                  <span className="inline-block ml-1 animate-pulse">▋</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
