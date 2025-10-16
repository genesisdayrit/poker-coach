'use client';
import React from 'react';
import { evaluateHandStrength, getStrengthColor, getHandEmoji, getBasicAdvice, type HandStrength } from '../utils/handEvaluator';
import { calculateOuts, getDrawStrength, getDrawColor, type OutsAnalysis } from '../utils/drawDetector';

interface PostFlopAnalysisProps {
  playerHand: Array<{ value: string; suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' }>;
  communityCards: Array<{ value: string; suit: 'hearts' | 'diamonds' | 'clubs' | 'spades' }>;
}

export default function PostFlopAnalysis({ playerHand, communityCards }: PostFlopAnalysisProps) {
  // Don't show if not enough cards
  if (playerHand.length !== 2 || communityCards.length < 3) {
    return null;
  }

  let handStrength: HandStrength;
  let outsAnalysis: OutsAnalysis;
  
  try {
    handStrength = evaluateHandStrength(playerHand, communityCards);
    outsAnalysis = calculateOuts(playerHand, communityCards);
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
  const drawStrength = getDrawStrength(outsAnalysis.oneCardEquity);
  const hasDraws = outsAnalysis.draws.length > 0;

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

        {/* Outs Calculator */}
        {hasDraws && (
          <div className="pt-3 border-t border-slate-600">
            <div className="flex items-center justify-between mb-2">
              <p className="text-yellow-400 font-bold text-sm">🎯 Outs Calculator</p>
              <div className={`px-2 py-1 rounded text-xs font-semibold ${getDrawColor(drawStrength)}`}>
                {drawStrength.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            {/* Draws List */}
            <div className="space-y-1 mb-3">
              {outsAnalysis.draws.map((draw, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm bg-slate-800 rounded px-2 py-1">
                  <span className="text-gray-300">
                    {draw.type === 'flush-draw' && '💧 '}
                    {draw.type === 'straight-draw' && '📈 '}
                    {draw.type === 'gutshot' && '🎯 '}
                    {draw.type === 'overcard' && '⬆️ '}
                    {draw.description}
                  </span>
                  <span className="text-white font-bold">{draw.outs} outs</span>
                </div>
              ))}
            </div>

            {/* Outs Breakdown */}
            <div className="bg-slate-800 rounded p-2 mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Total Outs</span>
                <span className="text-white font-bold">{outsAnalysis.cleanOuts} clean outs</span>
              </div>
              {outsAnalysis.breakdown.slice(0, 3).map((item, idx) => (
                <div key={idx} className="text-xs text-gray-400">
                  • {item}
                </div>
              ))}
            </div>

            {/* Equity Display */}
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">Next Card Equity</span>
                  <span className="text-white font-bold">~{outsAnalysis.oneCardEquity}%</span>
                </div>
                <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-500 to-green-500 transition-all"
                    style={{ width: `${outsAnalysis.oneCardEquity}%` }}
                  />
                </div>
              </div>

              {communityCards.length === 3 && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">By River (both cards)</span>
                    <span className="text-white font-bold">~{outsAnalysis.riverEquity}%</span>
                  </div>
                  <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all"
                      style={{ width: `${outsAnalysis.riverEquity}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Advice */}
        <div className="pt-3 border-t border-slate-600">
          <p className="text-gray-400 text-xs mb-1">Basic Strategy</p>
          <p className="text-white font-medium">
            {hasDraws && outsAnalysis.oneCardEquity > 25 
              ? `${advice} You have a ${drawStrength.replace('-', ' ')} with ${outsAnalysis.cleanOuts} outs.`
              : advice
            }
          </p>
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
          {hasDraws && (
            <div className="flex-1 bg-slate-800 rounded p-2">
              <p className="text-gray-400">Outs</p>
              <p className="text-yellow-400 font-bold">{outsAnalysis.cleanOuts}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

