import { Threat } from './threatDetector';

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

export interface DangerousCard {
  card: string;
  cardObj: Card;
  threats: string[];
  newThreatsCreated: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  impactOnEquity: number;
}

export interface DangerousCardsAnalysis {
  dangerousCards: DangerousCard[];
  scaryCards: DangerousCard[];
  safeCards: string[];
  summary: string;
}

/**
 * Get all remaining cards not currently in play
 */
function getRemainingCards(yourHoleCards: Card[], communityCards: Card[]): Card[] {
  const allRanks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
  const allSuits: Array<'hearts' | 'diamonds' | 'clubs' | 'spades'> = ['hearts', 'diamonds', 'clubs', 'spades'];
  const allCards: Card[] = [];

  for (const rank of allRanks) {
    for (const suit of allSuits) {
      allCards.push({ value: rank, suit });
    }
  }

  const usedCards = [...yourHoleCards, ...communityCards];
  return allCards.filter(card => {
    return !usedCards.some(used => 
      used.value === card.value && used.suit === card.suit
    );
  });
}

/**
 * Format card for display
 */
function formatCard(card: Card): string {
  const suitSymbols: Record<string, string> = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };
  return `${card.value}${suitSymbols[card.suit]}`;
}

/**
 * Count suits in cards
 */
function countSuits(cards: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  cards.forEach(card => {
    counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
  });
  return counts;
}

/**
 * Count ranks in cards
 */
function countRanks(cards: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  cards.forEach(card => {
    const rank = card.value === '10' ? 'T' : card.value;
    counts.set(rank, (counts.get(rank) || 0) + 1);
  });
  return counts;
}

/**
 * Check if adding a card completes a flush
 */
function completesFlush(card: Card, board: Card[]): boolean {
  const newBoard = [...board, card];
  const suitCounts = countSuits(newBoard);
  return Array.from(suitCounts.values()).some(count => count >= 5);
}

/**
 * Check if ranks can form a straight
 */
function hasStraight(ranks: string[]): boolean {
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'A'];
  const uniqueRanks = [...new Set(ranks)];

  // Check regular straights
  for (let i = 0; i <= rankOrder.length - 5; i++) {
    const window = rankOrder.slice(i, i + 5);
    const matches = window.filter(rank => uniqueRanks.includes(rank));
    if (matches.length === 5) return true;
  }

  return false;
}

/**
 * Check if adding a card completes a straight
 */
function completesStraight(card: Card, board: Card[]): boolean {
  const newBoard = [...board, card];
  const ranks = newBoard.map(c => c.value === '10' ? 'T' : c.value);
  return hasStraight(ranks);
}

/**
 * Check if card pairs the board
 */
function pairsBoard(card: Card, board: Card[]): boolean {
  const cardRank = card.value === '10' ? 'T' : card.value;
  const boardRanks = board.map(c => c.value === '10' ? 'T' : c.value);
  return boardRanks.includes(cardRank);
}

/**
 * Check if adding a card creates a new straight draw possibility
 */
function createsStraightDraw(card: Card, newBoard: Card[]): boolean {
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const ranks = newBoard.map(c => c.value === '10' ? 'T' : c.value);
  const uniqueRanks = [...new Set(ranks)];

  // Check if there are now 4 cards to a straight
  for (let i = 0; i <= rankOrder.length - 5; i++) {
    const window = rankOrder.slice(i, i + 5);
    const matches = window.filter(rank => uniqueRanks.includes(rank));
    if (matches.length === 4) return true;
  }

  return false;
}

/**
 * Check if adding a card creates a new flush draw possibility
 */
function createsFlushDraw(card: Card, newBoard: Card[]): boolean {
  const suitCounts = countSuits(newBoard);
  return Array.from(suitCounts.values()).some(count => count === 4);
}

/**
 * Estimate equity drop if this card comes
 */
function estimateEquityDrop(threats: string[], handStrength: HandStrength): number {
  let drop = 0;

  threats.forEach(threat => {
    if (threat.includes('Completes') && threat.includes('flush')) drop += 30;
    if (threat.includes('Completes') && threat.includes('straight')) drop += 25;
    if (threat.includes('Pairs board')) drop += 15;
    if (threat.includes('Creates') && threat.includes('flush draw')) drop += 8;
    if (threat.includes('Creates') && threat.includes('straight draw')) drop += 8;
  });

  // Adjust based on hand strength
  if (handStrength.strength === 'nuts' || handStrength.strength === 'very-strong') {
    drop *= 0.6;
  } else if (handStrength.strength === 'medium') {
    drop *= 1.1;
  } else if (handStrength.strength === 'weak' || handStrength.strength === 'very-weak') {
    drop *= 1.3;
  }

  return Math.min(Math.round(drop), 100);
}

/**
 * Determine risk level based on threats
 */
function determineRiskLevel(threats: string[]): DangerousCard['riskLevel'] {
  const hasCritical = threats.some(t => 
    t.includes('Completes flush') || t.includes('Completes straight')
  );
  const hasHigh = threats.some(t => 
    t.includes('Pairs board') && !t.includes('Creates')
  );
  const hasMedium = threats.some(t => 
    t.includes('Creates')
  );

  if (hasCritical) return 'critical';
  if (hasHigh) return 'high';
  if (hasMedium) return 'medium';
  return 'low';
}

/**
 * Generate summary of dangerous cards
 */
function generateDangerousSummary(scaryCards: DangerousCard[], totalDangerous: number): string {
  if (scaryCards.length === 0) {
    if (totalDangerous === 0) {
      return 'No particularly dangerous cards to worry about';
    }
    return `${totalDangerous} cards create minor threats`;
  }

  const critical = scaryCards.filter(c => c.riskLevel === 'critical').length;
  const high = scaryCards.filter(c => c.riskLevel === 'high').length;

  if (critical > 0) {
    return `${critical} critical card${critical > 1 ? 's' : ''} would complete draws against you`;
  }
  if (high > 0) {
    return `${high} dangerous card${high > 1 ? 's' : ''} to watch out for`;
  }
  return `${scaryCards.length} card${scaryCards.length > 1 ? 's' : ''} create significant threats`;
}

/**
 * Main function to identify dangerous turn/river cards
 */
export function identifyDangerousCards(
  yourHoleCards: Card[],
  communityCards: Card[],
  yourHandStrength: HandStrength,
  currentThreats: Threat[]
): DangerousCardsAnalysis {
  // Don't analyze if we're on the river already
  if (communityCards.length >= 5) {
    return {
      dangerousCards: [],
      scaryCards: [],
      safeCards: [],
      summary: 'All cards dealt - no future threats'
    };
  }

  const remainingCards = getRemainingCards(yourHoleCards, communityCards);
  const dangerousCards: DangerousCard[] = [];

  for (const card of remainingCards) {
    const newBoard = [...communityCards, card];
    const threats: string[] = [];

    // Check what this card completes or creates
    if (completesFlush(card, communityCards)) {
      const suitName = card.suit.charAt(0).toUpperCase() + card.suit.slice(1);
      threats.push(`Completes ${suitName} flush`);
    }

    if (completesStraight(card, communityCards)) {
      threats.push(`Completes straight`);
    }

    if (pairsBoard(card, communityCards)) {
      threats.push(`Pairs board (full house risk)`);
    }

    if (createsStraightDraw(card, newBoard)) {
      threats.push(`Creates new straight draw`);
    }

    if (createsFlushDraw(card, newBoard)) {
      threats.push(`Creates new flush draw`);
    }

    // Only add if it creates threats
    if (threats.length > 0) {
      const riskLevel = determineRiskLevel(threats);
      const impact = estimateEquityDrop(threats, yourHandStrength);

      dangerousCards.push({
        card: formatCard(card),
        cardObj: card,
        threats,
        newThreatsCreated: threats.length,
        riskLevel,
        impactOnEquity: impact
      });
    }
  }

  // Sort by risk level and impact
  const riskOrder = { critical: 4, high: 3, medium: 2, low: 1 };
  dangerousCards.sort((a, b) => {
    const riskDiff = riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
    if (riskDiff !== 0) return riskDiff;
    return b.impactOnEquity - a.impactOnEquity;
  });

  const scaryCards = dangerousCards.filter(c => 
    c.riskLevel === 'critical' || c.riskLevel === 'high'
  );

  const safeCards = remainingCards
    .filter(c => !dangerousCards.find(dc => 
      dc.cardObj.value === c.value && dc.cardObj.suit === c.suit
    ))
    .map(formatCard);

  return {
    dangerousCards,
    scaryCards,
    safeCards,
    summary: generateDangerousSummary(scaryCards, dangerousCards.length)
  };
}

