type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export interface Draw {
  type: 'flush-draw' | 'straight-draw' | 'gutshot' | 'overcard' | 'pair-draw' | 'two-pair-draw';
  outs: number;
  description: string;
  cards?: string[]; // The actual out cards
}

export interface OutsAnalysis {
  draws: Draw[];
  totalOuts: number;
  cleanOuts: number; // After removing duplicates
  turnEquity: number; // Percentage
  riverEquity: number; // Percentage from flop
  oneCardEquity: number; // Just next card
  breakdown: string[];
}

/**
 * Detect flush draws
 */
export function detectFlushDraw(holeCards: Card[], communityCards: Card[]): Draw | null {
  const allCards = [...holeCards, ...communityCards];
  const suitCounts = new Map<string, { count: number; hasPlayerCard: boolean }>();
  
  // Count suits
  allCards.forEach(card => {
    if (!suitCounts.has(card.suit)) {
      suitCounts.set(card.suit, { count: 0, hasPlayerCard: false });
    }
    const data = suitCounts.get(card.suit)!;
    data.count++;
    if (holeCards.includes(card)) {
      data.hasPlayerCard = true;
    }
  });
  
  // Check for 4-card flush draw
  for (const [suit, data] of suitCounts) {
    if (data.count === 4 && data.hasPlayerCard) {
      return {
        type: 'flush-draw',
        outs: 9, // 13 cards in suit - 4 seen = 9
        description: `${suit.charAt(0).toUpperCase() + suit.slice(1)} flush draw`
      };
    }
  }
  
  return null;
}

/**
 * Detect straight draws
 */
export function detectStraightDraws(holeCards: Card[], communityCards: Card[]): Draw[] {
  const draws: Draw[] = [];
  const allCards = [...holeCards, ...communityCards];
  
  // Convert to rank values
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'A']; // A can be low
  const ranks = allCards.map(c => c.value === '10' ? 'T' : c.value);
  const uniqueRanks = [...new Set(ranks)].sort((a, b) => rankOrder.indexOf(a) - rankOrder.indexOf(b));
  
  // Check for open-ended straight draw (4 consecutive cards)
  for (let i = 0; i < rankOrder.length - 4; i++) {
    const sequence = rankOrder.slice(i, i + 5);
    const matches = sequence.filter(rank => uniqueRanks.includes(rank));
    
    if (matches.length === 4) {
      // Check if we have hole cards in this sequence
      const holeRanks = holeCards.map(c => c.value === '10' ? 'T' : c.value);
      const hasHoleCard = sequence.some(rank => holeRanks.includes(rank));
      
      if (hasHoleCard) {
        // Open-ended if missing first or last card
        const missingRank = sequence.find(rank => !uniqueRanks.includes(rank));
        if (missingRank === sequence[0] || missingRank === sequence[4]) {
          draws.push({
            type: 'straight-draw',
            outs: 8,
            description: `Open-ended straight draw`
          });
          break; // Only count one OESD
        }
      }
    }
  }
  
  // Check for gutshot (inside straight draw)
  if (draws.length === 0) { // Only if we don't have OESD
    for (let i = 0; i < rankOrder.length - 4; i++) {
      const sequence = rankOrder.slice(i, i + 5);
      const matches = sequence.filter(rank => uniqueRanks.includes(rank));
      
      if (matches.length === 4) {
        const holeRanks = holeCards.map(c => c.value === '10' ? 'T' : c.value);
        const hasHoleCard = sequence.some(rank => holeRanks.includes(rank));
        
        if (hasHoleCard) {
          const missingRank = sequence.find(rank => !uniqueRanks.includes(rank));
          // Gutshot if missing a middle card
          if (missingRank !== sequence[0] && missingRank !== sequence[4]) {
            draws.push({
              type: 'gutshot',
              outs: 4,
              description: `Gutshot straight draw (${missingRank})`
            });
            break;
          }
        }
      }
    }
  }
  
  return draws;
}

/**
 * Detect overcard outs (cards that would give you top pair)
 */
export function detectOvercards(holeCards: Card[], communityCards: Card[]): Draw[] {
  const draws: Draw[] = [];
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // Find highest community card
  const boardRanks = communityCards.map(c => c.value === '10' ? 'T' : c.value);
  const highestBoardIdx = Math.min(...boardRanks.map(r => rankOrder.indexOf(r)));
  
  // Check each hole card
  holeCards.forEach(card => {
    const cardRank = card.value === '10' ? 'T' : card.value;
    const cardIdx = rankOrder.indexOf(cardRank);
    
    // If hole card is higher than highest board card, it's an overcard
    if (cardIdx < highestBoardIdx && !boardRanks.includes(cardRank)) {
      draws.push({
        type: 'overcard',
        outs: 3, // 3 more of that rank in deck (4 total - 1 in hand)
        description: `Overcard ${cardRank} (for top pair)`
      });
    }
  });
  
  return draws;
}

/**
 * Detect pair improvement outs (if you have a pair, outs to trips)
 */
export function detectPairImprovement(holeCards: Card[], communityCards: Card[]): Draw | null {
  const holeRanks = holeCards.map(c => c.value === '10' ? 'T' : c.value);
  
  // Pocket pair
  if (holeRanks[0] === holeRanks[1]) {
    return {
      type: 'pair-draw',
      outs: 2, // 2 more cards to make trips
      description: `Set draw (pair of ${holeRanks[0]}s)`
    };
  }
  
  // Check if we paired the board
  const boardRanks = communityCards.map(c => c.value === '10' ? 'T' : c.value);
  for (const holeRank of holeRanks) {
    if (boardRanks.includes(holeRank)) {
      return {
        type: 'pair-draw',
        outs: 2, // 2 more cards to make trips
        description: `Trips draw (paired ${holeRank})`
      };
    }
  }
  
  return null;
}

/**
 * Calculate total outs with duplicates removed
 */
export function calculateOuts(holeCards: Card[], communityCards: Card[]): OutsAnalysis {
  const draws: Draw[] = [];
  const breakdown: string[] = [];
  
  // Detect all draw types
  const flushDraw = detectFlushDraw(holeCards, communityCards);
  if (flushDraw) {
    draws.push(flushDraw);
    breakdown.push(`${flushDraw.outs} flush outs`);
  }
  
  const straightDraws = detectStraightDraws(holeCards, communityCards);
  straightDraws.forEach(draw => {
    draws.push(draw);
    breakdown.push(`${draw.outs} straight outs`);
  });
  
  const overcards = detectOvercards(holeCards, communityCards);
  overcards.forEach(draw => {
    draws.push(draw);
    breakdown.push(`${draw.outs} overcard outs (${draw.description.split(' ')[1]})`);
  });
  
  const pairDraw = detectPairImprovement(holeCards, communityCards);
  if (pairDraw) {
    draws.push(pairDraw);
    breakdown.push(`${pairDraw.outs} pair improvement outs`);
  }
  
  // Calculate total outs (raw sum)
  const totalOuts = draws.reduce((sum, draw) => sum + draw.outs, 0);
  
  // Estimate clean outs (remove some duplicates)
  // This is simplified - real calculation would check actual card overlap
  let cleanOuts = totalOuts;
  
  // If we have both flush draw and straight draw, likely 1-2 cards overlap
  if (flushDraw && straightDraws.length > 0) {
    cleanOuts -= 1; // Rough approximation
    breakdown.push(`-1 duplicate (flush + straight)`);
  }
  
  // Calculate equity using Rule of 4 and 2
  const street = communityCards.length === 3 ? 'flop' : 'turn';
  const oneCardEquity = Math.min((cleanOuts * 2) + 2, 100);
  const turnEquity = street === 'flop' ? oneCardEquity : 0;
  const riverEquity = street === 'flop' ? Math.min((cleanOuts * 4), 100) : oneCardEquity;
  
  return {
    draws,
    totalOuts,
    cleanOuts,
    turnEquity: street === 'flop' ? oneCardEquity : 0,
    riverEquity: street === 'flop' ? Math.min(cleanOuts * 4, 100) : oneCardEquity,
    oneCardEquity,
    breakdown
  };
}

/**
 * Get draw strength category based on equity
 */
export function getDrawStrength(equity: number): 'monster-draw' | 'strong-draw' | 'medium-draw' | 'weak-draw' | 'no-draw' {
  if (equity >= 60) return 'monster-draw';
  if (equity >= 40) return 'strong-draw';
  if (equity >= 25) return 'medium-draw';
  if (equity >= 15) return 'weak-draw';
  return 'no-draw';
}

/**
 * Get color for draw strength
 */
export function getDrawColor(strength: string): string {
  const colors = {
    'monster-draw': 'bg-purple-600 text-white',
    'strong-draw': 'bg-green-600 text-white',
    'medium-draw': 'bg-yellow-500 text-white',
    'weak-draw': 'bg-orange-500 text-white',
    'no-draw': 'bg-gray-600 text-white'
  };
  return colors[strength as keyof typeof colors] || colors['no-draw'];
}

