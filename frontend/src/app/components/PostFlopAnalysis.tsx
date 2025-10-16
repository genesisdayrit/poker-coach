'use client';
import React from 'react';
import { evaluateHandStrength, getStrengthColor, getHandEmoji, getBasicAdvice, type HandStrength } from '../utils/handEvaluator';

interface PostFlopAnalysisProps {
  playerHand: Array<{ value: string; suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' }>;
  communityCards: Array<{ value: string; suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' }>;
}

export default function PostFlopAnalysis({ playerHand, communityCards }: PostFlopAnalysisProps) {
  // Debug logging
  console.log('PostFlopAnalysis - playerHand:', playerHand.length, 'communityCards:', communityCards.length);
  
  // Don't show if not enough cards
  if (playerHand.length !== 2 || communityCards.length < 3) {
    console.log('Not enough cards to show analysis');
    return null;
  }

  let handStrength: HandStrength;
  
  try {
    handStrength = evaluateHandStrength(playerHand, communityCards);
    console.log('Hand evaluated:', handStrength);
  } catch (error) {
    console.error('Error evaluating hand:', error);
    // Show error state instead of returning null
    return (
      <div className="w-full max-w-2xl p-4 rounded-lg bg-red-900 shadow-md border border-red-600">
        <p className="text-white">Error evaluating hand strength</p>
        <p className="text-red-200 text-sm">{String(error)}</p>
      </div>
    );
  }

  const emoji = getHandEmoji(handStrength.name);
  const advice = getBasicAdvice(handStrength);

  return (
    <div className="w-full max-w-2xl p-4 rounded-lg bg-slate-700 shadow-md border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg">Hand Strength Analysis</h3>
        <span className="text-2xl">{emoji}</span>
      </div>

      {/* Main Content */}
      <div className="space-y-3">
        {/* Hand Name */}
        <div>
          <p className="text-gray-400 text-xs mb-1">You Have</p>
          <p className="text-white font-bold text-2xl">{handStrength.name}</p>
          <p className="text-gray-300 text-sm">{handStrength.description}</p>
        </div>

        {/* Strength Indicator */}
        <div>
          <p className="text-gray-400 text-xs mb-2">Strength Rating</p>
          <div className="flex items-center gap-3">
            {/* Visual bar */}
            <div className="flex-1 bg-slate-600 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  handStrength.strength === 'nuts' ? 'bg-purple-500' :
                  handStrength.strength === 'very-strong' ? 'bg-green-500' :
                  handStrength.strength === 'strong' ? 'bg-green-400' :
                  handStrength.strength === 'medium' ? 'bg-yellow-500' :
                  handStrength.strength === 'weak' ? 'bg-orange-500' :
                  'bg-red-500'
                }`}
                style={{ 
                  width: `${
                    handStrength.strength === 'nuts' ? 100 :
                    handStrength.strength === 'very-strong' ? 90 :
                    handStrength.strength === 'strong' ? 75 :
                    handStrength.strength === 'medium' ? 55 :
                    handStrength.strength === 'weak' ? 35 :
                    15
                  }%` 
                }}
              />
            </div>
            
            {/* Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getStrengthColor(handStrength.strength)}`}>
              {handStrength.strength.replace('-', ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Hand Rank Progress */}
        <div className="grid grid-cols-10 gap-1 py-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <div
              key={level}
              className={`h-2 rounded ${
                level <= handStrength.rank
                  ? level >= 9 ? 'bg-purple-500' :
                    level >= 7 ? 'bg-green-500' :
                    level >= 4 ? 'bg-yellow-500' :
                    'bg-orange-500'
                  : 'bg-slate-600'
              }`}
              title={
                level === 10 ? 'Royal Flush' :
                level === 9 ? 'Straight Flush' :
                level === 8 ? 'Four of a Kind' :
                level === 7 ? 'Full House' :
                level === 6 ? 'Flush' :
                level === 5 ? 'Straight' :
                level === 4 ? 'Three of a Kind' :
                level === 3 ? 'Two Pair' :
                level === 2 ? 'Pair' :
                'High Card'
              }
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>High Card</span>
          <span>Royal Flush</span>
        </div>

        {/* Advice */}
        <div className="pt-3 border-t border-slate-600">
          <p className="text-gray-400 text-xs mb-1">Basic Strategy</p>
          <p className="text-white font-medium">{advice}</p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4 pt-2 text-xs">
          <div className="flex-1 bg-slate-800 rounded p-2">
            <p className="text-gray-400">Hand Rank</p>
            <p className="text-white font-bold">{handStrength.rank}/10</p>
          </div>
          <div className="flex-1 bg-slate-800 rounded p-2">
            <p className="text-gray-400">Category</p>
            <p className="text-white font-bold capitalize">{handStrength.strength}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

