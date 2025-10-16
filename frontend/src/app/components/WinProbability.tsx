'use client';
import React, { useEffect, useState } from 'react';
import { 
  calculateWinProbability, 
  getWinProbabilityColor,
  getEquityStrength,
  type WinProbability as WinProbabilityType 
} from '../utils/winProbability';

type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

interface WinProbabilityProps {
  playerHand: Card[];
  communityCards: Card[];
  opponentCount?: number;
}

export default function WinProbability({ 
  playerHand, 
  communityCards, 
  opponentCount = 1 
}: WinProbabilityProps) {
  const [probability, setProbability] = useState<WinProbabilityType | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const calculateProbability = async () => {
      // Clear old probability immediately when cards change
      setProbability(null);
      
      if (playerHand.length !== 2) {
        setIsCalculating(false);
        return;
      }

      // Set calculating flag immediately so UI shows "Calculating..." not "Waiting for cards..."
      setIsCalculating(true);

      // IMPORTANT: Wait for next frame to let cards render first
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (cancelled) return;
      
      try {
        // Run async calculation
        const result = await calculateWinProbability(
          playerHand,
          communityCards,
          opponentCount
        );
        
        // Only update state if component is still mounted and calculation wasn't cancelled
        if (!cancelled) {
          setProbability(result);
        }
      } catch (error) {
        console.error('Error calculating win probability:', error);
        if (!cancelled) {
          setProbability(null);
        }
      } finally {
        if (!cancelled) {
          setIsCalculating(false);
        }
      }
    };

    calculateProbability();

    // Cleanup function to cancel calculation when cards change
    return () => {
      cancelled = true;
    };
  }, [playerHand, communityCards, opponentCount]);

  if (!probability) {
    return (
      <div className="p-4 rounded-lg bg-slate-700 text-white shadow-md border border-slate-600">
        <h3 className="text-white font-bold text-sm mb-2">
          Equity vs {opponentCount} {opponentCount === 1 ? 'Opponent' : 'Opponents'}
        </h3>
        <div className="text-gray-400 text-sm">
          {isCalculating ? 'Calculating...' : 'Waiting for cards...'}
        </div>
      </div>
    );
  }

  const strengthCategory = getEquityStrength(probability.equity);
  const winColor = getWinProbabilityColor(probability.winPercentage);

  const strengthLabels = {
    'favorite': '🎯 Strong Favorite',
    'slight-favorite': '👍 Slight Favorite',
    'coin-flip': '🪙 Coin Flip',
    'underdog': '🎲 Underdog',
    'big-underdog': '⚠️ Big Underdog'
  };

  return (
    <div className="p-4 rounded-lg bg-slate-700 text-white shadow-md border border-slate-600">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold text-sm">
          Equity vs {opponentCount} {opponentCount === 1 ? 'Opponent' : 'Opponents'}
          {isCalculating && <span className="ml-2 text-xs text-yellow-400 animate-pulse">updating...</span>}
        </h3>
        <span className="text-xs text-gray-400">50 samples</span>
      </div>

      {/* Main equity display */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-4xl font-bold ${winColor}`}>
            {probability.equity.toFixed(1)}%
          </span>
          <span className="text-sm text-gray-400">equity</span>
        </div>
        <div className="text-sm text-gray-300 mt-1">
          {strengthLabels[strengthCategory]}
        </div>
      </div>

      {/* Probability breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Win</span>
          <span className="text-sm font-semibold text-green-400">
            {probability.winPercentage.toFixed(1)}%
          </span>
        </div>
        
        {probability.tiePercentage > 0.1 && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Tie</span>
            <span className="text-sm font-semibold text-yellow-400">
              {probability.tiePercentage.toFixed(1)}%
            </span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">Lose</span>
          <span className="text-sm font-semibold text-red-400">
            {probability.losePercentage.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Visual bar */}
      <div className="mt-4 h-2 bg-gray-600 rounded-full overflow-hidden flex">
        <div 
          className="bg-green-500 h-full" 
          style={{ width: `${probability.winPercentage}%` }}
        />
        {probability.tiePercentage > 0.1 && (
          <div 
            className="bg-yellow-500 h-full" 
            style={{ width: `${probability.tiePercentage}%` }}
          />
        )}
        <div 
          className="bg-red-500 h-full" 
          style={{ width: `${probability.losePercentage}%` }}
        />
      </div>
    </div>
  );
}

