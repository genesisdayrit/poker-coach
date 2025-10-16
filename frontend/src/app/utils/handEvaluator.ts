import { Hand } from 'pokersolver';

type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export interface HandStrength {
  rank: number; // 1-10 (higher is better)
  name: string; // "Royal Flush", "Pair", etc.
  description: string; // Full description with kickers
  strength: 'nuts' | 'very-strong' | 'strong' | 'medium' | 'weak' | 'very-weak';
}

/**
 * Convert our card format to pokersolver format
 * Our format: { value: "A", suit: "hearts" }
 * Pokersolver format: "Ah" (rank + suit initial)
 */
function convertToPokersolverFormat(card: Card): string {
  const suitMap = {
    hearts: 'h',
    diamonds: 'd',
    clubs: 'c',
    spades: 's'
  };
  
  const rank = card.value === '10' ? 'T' : card.value;
  const suit = suitMap[card.suit];
  
  return `${rank}${suit}`;
}

/**
 * Determine relative strength category based on hand rank
 */
function categorizeStrength(handName: string): HandStrength['strength'] {
  const name = handName.toLowerCase();
  
  // Absolute monsters
  if (name.includes('royal flush')) return 'nuts';
  if (name.includes('straight flush')) return 'nuts';
  if (name.includes('four of a kind')) return 'very-strong';
  if (name.includes('full house')) return 'very-strong';
  
  // Strong hands
  if (name.includes('flush')) return 'strong';
  if (name.includes('straight')) return 'strong';
  if (name.includes('three of a kind')) return 'strong';
  
  // Medium hands
  if (name.includes('two pair')) return 'medium';
  if (name.includes('pair')) {
    // Check if it's a high pair (TT+) or top pair on board
    const pairRank = handName.match(/Pair, (\w+)/)?.[1];
    const highRanks = ['Ace', 'King', 'Queen', 'Jack', 'Ten'];
    if (pairRank && highRanks.includes(pairRank)) {
      return 'medium';
    }
    return 'weak';
  }
  
  // Weak hands
  return 'very-weak';
}

/**
 * Evaluate hand strength given hole cards and community cards
 */
export function evaluateHandStrength(
  holeCards: Card[],
  communityCards: Card[]
): HandStrength {
  if (holeCards.length !== 2 || communityCards.length < 3) {
    throw new Error('Invalid hand: need 2 hole cards and at least 3 community cards');
  }
  
  // Convert all cards to pokersolver format
  const allCardsFormatted = [
    ...holeCards.map(convertToPokersolverFormat),
    ...communityCards.map(convertToPokersolverFormat)
  ];
  
  // Solve the hand
  const solvedHand = Hand.solve(allCardsFormatted);
  
  // Map pokersolver rank to our 1-10 scale
  const rankMap: Record<string, number> = {
    'Royal Flush': 10,
    'Straight Flush': 9,
    'Four of a Kind': 8,
    'Full House': 7,
    'Flush': 6,
    'Straight': 5,
    'Three of a Kind': 4,
    'Two Pair': 3,
    'Pair': 2,
    'High Card': 1
  };
  
  const rank = rankMap[solvedHand.name] || 1;
  const strength = categorizeStrength(solvedHand.name);
  
  return {
    rank,
    name: solvedHand.name,
    description: solvedHand.descr,
    strength
  };
}

/**
 * Get color for strength visualization
 */
export function getStrengthColor(strength: HandStrength['strength']): string {
  const colors = {
    'nuts': 'bg-purple-600 text-white',
    'very-strong': 'bg-green-600 text-white',
    'strong': 'bg-green-500 text-white',
    'medium': 'bg-yellow-500 text-white',
    'weak': 'bg-orange-500 text-white',
    'very-weak': 'bg-red-500 text-white'
  };
  return colors[strength] || colors['very-weak'];
}

/**
 * Get emoji for hand type
 */
export function getHandEmoji(name: string): string {
  if (name.includes('Royal Flush')) return '👑';
  if (name.includes('Straight Flush')) return '💎';
  if (name.includes('Four of a Kind')) return '🔥';
  if (name.includes('Full House')) return '🏠';
  if (name.includes('Flush')) return '💧';
  if (name.includes('Straight')) return '📈';
  if (name.includes('Three of a Kind')) return '🎯';
  if (name.includes('Two Pair')) return '👯';
  if (name.includes('Pair')) return '🤝';
  return '🃏';
}

/**
 * Get basic playing advice based on hand strength
 */
export function getBasicAdvice(strength: HandStrength): string {
  switch (strength.strength) {
    case 'nuts':
      return 'The nuts! Maximize value with big bets';
    case 'very-strong':
      return 'Very strong hand - bet for value';
    case 'strong':
      return 'Strong hand - continue betting';
    case 'medium':
      return 'Medium strength - consider pot control';
    case 'weak':
      return 'Weak hand - proceed with caution';
    case 'very-weak':
      return 'Very weak - consider checking or folding';
    default:
      return 'Evaluate based on position and opponents';
  }
}

