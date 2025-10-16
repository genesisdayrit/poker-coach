'use client';
import React, { useState } from 'react';
import { analyzePossibleThreats, Threat } from '../utils/threatDetector';
import { identifyDangerousCards, DangerousCard } from '../utils/dangerousCardsDetector';

type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

interface HandStrength {
  rank: number;
  name: string;
  description: string;
  strength: 'nuts' | 'very-strong' | 'strong' | 'medium' | 'weak' | 'very-weak';
}

interface ThreatAnalysisProps {
  holeCards: Card[];
  communityCards: Card[];
  handStrength: HandStrength;
}

export default function ThreatAnalysis({ 
  holeCards, 
  communityCards, 
  handStrength 
}: ThreatAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Analyze current threats
  const threatAnalysis = analyzePossibleThreats(
    holeCards, 
    communityCards, 
    handStrength
  );
  
  // Only show dangerous cards if not on river
  const dangerousCardsAnalysis = communityCards.length < 5 
    ? identifyDangerousCards(
        holeCards, 
        communityCards, 
        handStrength, 
        threatAnalysis.threats
      )
    : null;

  // Count threats for preview
  const beatingThreatsCount = threatAnalysis.threats.filter(t => t.beatsYou).length;
  const scaryCardsCount = dangerousCardsAnalysis?.scaryCards.length || 0;

  return (
    <div className="rounded-lg bg-slate-700 shadow-md border border-slate-600">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-600 transition-colors rounded-lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">🛡️</span>
          <h3 className="text-white font-bold text-lg">Threat Analysis</h3>
          {!isExpanded && beatingThreatsCount > 0 && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded font-semibold">
              {beatingThreatsCount} threat{beatingThreatsCount > 1 ? 's' : ''}
            </span>
          )}
          {!isExpanded && scaryCardsCount > 0 && (
            <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded font-semibold ml-1">
              {scaryCardsCount} card{scaryCardsCount > 1 ? 's' : ''} to watch
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          {/* Current Threats Section */}
          <div className="mb-4">
            <h4 className="text-gray-400 text-xs mb-2">
              POSSIBLE BEATING HANDS
            </h4>
            
            {threatAnalysis.threats.length === 0 ? (
              <div className="bg-slate-800 rounded-lg p-3 border border-green-600">
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <span className="text-lg">✅</span>
                  No apparent threats on this board
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {threatAnalysis.threats.map((threat, idx) => (
                  <ThreatCard key={idx} threat={threat} />
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-2">
              {threatAnalysis.summary}
            </p>
          </div>

          {/* Dangerous Cards Section (not on river) */}
          {dangerousCardsAnalysis && dangerousCardsAnalysis.scaryCards.length > 0 && (
            <div className="border-t border-slate-600 pt-4">
              <h4 className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                CARDS TO WATCH OUT FOR
              </h4>
              
              <div className="space-y-2">
                {dangerousCardsAnalysis.scaryCards.slice(0, 6).map((dangerousCard, idx) => (
                  <DangerousCardDisplay key={idx} dangerousCard={dangerousCard} />
                ))}
              </div>
              
              <p className="text-xs text-gray-400 mt-2">
                {dangerousCardsAnalysis.summary}
              </p>
            </div>
          )}

          {/* Safe Cards Info */}
          {dangerousCardsAnalysis && dangerousCardsAnalysis.safeCards.length > 0 && 
           dangerousCardsAnalysis.scaryCards.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-600">
              <p className="text-xs text-gray-400">
                <span className="font-semibold text-green-400">
                  {dangerousCardsAnalysis.safeCards.length} safe cards
                </span>
                {' '}don&apos;t create major threats
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Sub-component for displaying individual threats
function ThreatCard({ threat }: { threat: Threat }) {
  const getBgColor = () => {
    if (!threat.beatsYou) return 'bg-slate-800 border-blue-500';
    if (threat.likelihood === 'high') return 'bg-slate-800 border-red-500';
    if (threat.likelihood === 'medium') return 'bg-slate-800 border-orange-500';
    return 'bg-slate-800 border-yellow-500';
  };

  const getIcon = () => {
    if (!threat.beatsYou) return 'ℹ️';
    if (threat.likelihood === 'high') return '🚨';
    if (threat.likelihood === 'medium') return '⚠️';
    return '💡';
  };

  const getLikelihoodBadge = () => {
    if (threat.likelihood === 'high') {
      return 'bg-red-500 text-white';
    } else if (threat.likelihood === 'medium') {
      return 'bg-orange-500 text-white';
    }
    return 'bg-yellow-500 text-white';
  };

  return (
    <div className={`${getBgColor()} border rounded-lg p-2.5`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base">{getIcon()}</span>
            <span className="font-bold text-white text-sm">{threat.handType}</span>
            {threat.beatsYou && (
              <span className="text-xs bg-red-600 text-white px-1.5 py-0.5 rounded font-semibold">
                Beats You
              </span>
            )}
            <span className={`text-xs ${getLikelihoodBadge()} px-1.5 py-0.5 rounded font-semibold uppercase`}>
              {threat.likelihood}
            </span>
          </div>
          <p className="text-xs text-gray-300 mt-1 leading-relaxed">{threat.description}</p>
          {threat.requiredHoleCards && (
            <p className="text-xs text-gray-500 mt-0.5 italic">
              Requires: {threat.requiredHoleCards}
            </p>
          )}
        </div>
        {threat.combosCount !== undefined && threat.combosCount > 0 && (
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400 font-medium">{threat.combosCount} combos</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Sub-component for displaying dangerous cards
function DangerousCardDisplay({ dangerousCard }: { dangerousCard: DangerousCard }) {
  const getRiskColor = () => {
    switch (dangerousCard.riskLevel) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getRiskLabel = () => {
    switch (dangerousCard.riskLevel) {
      case 'critical': return 'CRITICAL';
      case 'high': return 'HIGH';
      case 'medium': return 'MEDIUM';
      default: return 'LOW';
    }
  };

  return (
    <div className="flex items-start gap-2 bg-slate-800 rounded-lg p-2.5">
      <div className={`${getRiskColor()} w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold flex-shrink-0`}>
        {dangerousCard.card}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs ${getRiskColor()} px-1.5 py-0.5 rounded font-semibold`}>
            {getRiskLabel()}
          </span>
        </div>
        <ul className="text-xs text-gray-300 space-y-0.5">
          {dangerousCard.threats.map((threat, idx) => (
            <li key={idx} className="leading-snug">• {threat}</li>
          ))}
        </ul>
        {dangerousCard.impactOnEquity > 0 && (
          <p className="text-xs text-red-400 mt-1 font-semibold">
            ~{dangerousCard.impactOnEquity}% equity drop
          </p>
        )}
      </div>
    </div>
  );
}

