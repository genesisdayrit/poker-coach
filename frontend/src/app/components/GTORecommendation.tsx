'use client';
import React from 'react';
import { getGTORecommendation, normalizeHand, getHandColor, type Position } from '../utils/gtoRanges';

interface GTORecommendationProps {
  card1: { value: string; suit: string };
  card2: { value: string; suit: string };
  position: Position;
  onPositionChange: (position: Position) => void;
}

export default function GTORecommendation({ card1, card2, position, onPositionChange }: GTORecommendationProps) {
  const recommendation = getGTORecommendation(card1, card2, position);
  const handNotation = normalizeHand(card1, card2);
  const bgColor = getHandColor(recommendation.category);
  
  const positions: Position[] = ['UTG', 'MP', 'CO', 'BTN', 'SB', 'BB'];
  
  // Get action color
  const getActionColor = (action: string) => {
    switch (action) {
      case 'raise': return 'text-green-400';
      case 'call': return 'text-yellow-400';
      case 'fold': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };
  
  // Get action icon
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'raise': return '↑';
      case 'call': return '→';
      case 'fold': return '✕';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-2xl p-4 rounded-lg bg-slate-700 shadow-md border border-slate-600">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-lg">GTO Recommendation</h3>
        
        {/* Position Selector */}
        <div className="flex items-center gap-2">
          <label className="text-gray-400 text-sm">Position:</label>
          <select 
            value={position} 
            onChange={(e) => onPositionChange(e.target.value as Position)}
            className="bg-slate-600 text-white px-3 py-1 rounded border border-slate-500 focus:border-blue-500 focus:outline-none text-sm font-medium"
          >
            {positions.map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column - Hand & Action */}
        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Your Hand</p>
            <p className="text-white font-bold text-2xl">{handNotation}</p>
          </div>
          
          <div>
            <p className="text-gray-400 text-xs mb-1">Action</p>
            <p className={`font-bold text-2xl uppercase ${getActionColor(recommendation.action)}`}>
              {getActionIcon(recommendation.action)} {recommendation.action}
            </p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="space-y-3">
          <div>
            <p className="text-gray-400 text-xs mb-1">Frequency</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-slate-600 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${
                    recommendation.action === 'raise' ? 'bg-green-500' :
                    recommendation.action === 'call' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${recommendation.frequency}%` }}
                />
              </div>
              <span className="text-white font-bold text-sm w-12">{recommendation.frequency}%</span>
            </div>
          </div>

          {recommendation.raiseSize && (
            <div>
              <p className="text-gray-400 text-xs mb-1">Raise Size</p>
              <p className="text-white font-bold text-xl">{recommendation.raiseSize}BB</p>
            </div>
          )}

          <div>
            <p className="text-gray-400 text-xs mb-1">Category</p>
            <div 
              className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: bgColor }}
            >
              {recommendation.category || 'fold'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 pt-3 border-t border-slate-600">
        <p className="text-gray-400 text-xs">
          {recommendation.action === 'raise' && recommendation.frequency === 100 && (
            <>💡 <strong className="text-white">Strong hand</strong> - Always raise from this position</>
          )}
          {recommendation.action === 'raise' && recommendation.frequency < 100 && (
            <>💡 <strong className="text-white">Mixed strategy</strong> - Raise {recommendation.frequency}% of the time</>
          )}
          {recommendation.action === 'call' && (
            <>💡 <strong className="text-white">Defending hand</strong> - Call to see the flop</>
          )}
          {recommendation.action === 'fold' && (
            <>💡 <strong className="text-white">Weak for this position</strong> - Fold and wait for better spots</>
          )}
        </p>
      </div>
    </div>
  );
}

