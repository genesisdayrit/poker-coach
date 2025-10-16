type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export interface Threat {
  handType: string;
  description: string;
  beatsYou: boolean;
  likelihood: 'high' | 'medium' | 'low';
  requiredHoleCards?: string;
  combosCount?: number;
}

export interface ThreatAnalysis {
  threats: Threat[];
  totalBeatingCombos: number;
  yourHandRank: number;
  yourHandName: string;
  summary: string;
}

interface HandStrength {
  rank: number;
  name: string;
  description: string;
  strength: 'nuts' | 'very-strong' | 'strong' | 'medium' | 'weak' | 'very-weak';
}

/**
 * Count suits in a set of cards
 */
function countSuits(cards: Card[]): Map<string, number> {
  const counts = new Map<string, number>();
  cards.forEach(card => {
    counts.set(card.suit, (counts.get(card.suit) || 0) + 1);
  });
  return counts;
}

/**
 * Count ranks in a set of cards
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
 * Get unique ranks from cards
 */
function getUniqueRanks(cards: Card[]): string[] {
  const ranks = cards.map(c => c.value === '10' ? 'T' : c.value);
  return [...new Set(ranks)];
}

/**
 * Check if board has any pairs
 */
function hasPair(cards: Card[]): boolean {
  const rankCounts = countRanks(cards);
  return Array.from(rankCounts.values()).some(count => count >= 2);
}

/**
 * Calculate number of flush combos possible
 */
function calculateFlushCombos(suit: string, boardCount: number, communityCards: Card[]): number {
  // Total cards of this suit in deck: 13
  // Cards of this suit on board: boardCount
  // Remaining in deck: 13 - boardCount
  const remaining = 13 - boardCount;
  
  if (boardCount === 3) {
    // Need 2 cards of this suit
    // C(remaining, 2) = remaining * (remaining - 1) / 2
    return remaining * (remaining - 1) / 2;
  } else if (boardCount === 4) {
    // Need 1 card of this suit
    return remaining;
  }
  
  return 0;
}

/**
 * Find possible straights based on board cards
 */
function findPossibleStraights(communityCards: Card[]): Array<{
  gapsNeeded: number;
  description: string;
  missingCard?: string;
  combos: number;
}> {
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const lowAceOrder = ['5', '4', '3', '2', 'A']; // For wheel straight
  
  const ranks = communityCards.map(c => c.value === '10' ? 'T' : c.value);
  const uniqueRanks = [...new Set(ranks)];
  const results: Array<{
    gapsNeeded: number;
    description: string;
    missingCard?: string;
    combos: number;
  }> = [];

  // Check all possible 5-card windows
  for (let i = 0; i <= rankOrder.length - 5; i++) {
    const window = rankOrder.slice(i, i + 5);
    const matches = window.filter(rank => uniqueRanks.includes(rank));
    const gaps = 5 - matches.length;

    if (matches.length >= 3) {
      const missing = window.filter(rank => !uniqueRanks.includes(rank));
      const highCard = window[0];
      
      if (gaps === 0) {
        results.push({
          gapsNeeded: 0,
          description: `${highCard}-high straight on board`,
          combos: 0
        });
      } else if (gaps === 1) {
        results.push({
          gapsNeeded: 1,
          description: `${highCard}-high straight`,
          missingCard: missing[0],
          combos: 4 // 4 of each rank in deck
        });
      } else if (gaps === 2 && matches.length === 3) {
        results.push({
          gapsNeeded: 2,
          description: `Possible ${highCard}-high straight`,
          combos: 16 // 4 * 4 combos
        });
      }
    }
  }

  // Check wheel (A-2-3-4-5)
  const wheelMatches = lowAceOrder.filter(rank => uniqueRanks.includes(rank));
  const wheelGaps = 5 - wheelMatches.length;
  
  if (wheelMatches.length >= 3) {
    const wheelMissing = lowAceOrder.filter(rank => !uniqueRanks.includes(rank));
    
    if (wheelGaps === 0) {
      results.push({
        gapsNeeded: 0,
        description: 'Wheel (5-high) straight on board',
        combos: 0
      });
    } else if (wheelGaps === 1) {
      results.push({
        gapsNeeded: 1,
        description: 'Wheel straight possible',
        missingCard: wheelMissing[0],
        combos: 4
      });
    }
  }

  return results;
}

/**
 * Check for flush threats
 */
function checkFlushThreats(
  communityCards: Card[],
  yourHandRank: number
): { threats: Threat[] } {
  const suitCounts = countSuits(communityCards);
  const threats: Threat[] = [];
  const flushBeatsYou = yourHandRank < 6; // 6 = Flush rank

  for (const [suit, count] of suitCounts) {
    if (count >= 3) {
      const suitName = suit.charAt(0).toUpperCase() + suit.slice(1);
      
      if (count === 3) {
        const combos = calculateFlushCombos(suit, 3, communityCards);
        threats.push({
          handType: 'Flush',
          description: `${suitName} flush possible (needs 2 ${suit} cards)`,
          beatsYou: flushBeatsYou,
          likelihood: 'medium',
          requiredHoleCards: `Two ${suit} cards`,
          combosCount: combos
        });
      } else if (count === 4) {
        const combos = calculateFlushCombos(suit, 4, communityCards);
        threats.push({
          handType: 'Flush',
          description: `${suitName} flush very likely (needs 1 ${suit} card)`,
          beatsYou: flushBeatsYou,
          likelihood: 'high',
          requiredHoleCards: `Any ${suit} card`,
          combosCount: combos
        });
      } else if (count === 5) {
        threats.push({
          handType: 'Flush',
          description: `${suitName} flush on board - everyone has it`,
          beatsYou: false,
          likelihood: 'high',
          combosCount: 0
        });
      }
    }
  }

  return { threats };
}

/**
 * Check for straight threats
 */
function checkStraightThreats(
  communityCards: Card[],
  yourHandRank: number
): { threats: Threat[] } {
  const threats: Threat[] = [];
  const straightBeatsYou = yourHandRank < 5; // 5 = Straight rank
  const possibleStraights = findPossibleStraights(communityCards);

  for (const straight of possibleStraights) {
    if (straight.gapsNeeded === 0) {
      threats.push({
        handType: 'Straight',
        description: straight.description,
        beatsYou: false,
        likelihood: 'high',
        combosCount: 0
      });
    } else if (straight.gapsNeeded === 1) {
      threats.push({
        handType: 'Straight',
        description: straight.description,
        beatsYou: straightBeatsYou,
        likelihood: 'high',
        requiredHoleCards: `Any ${straight.missingCard}`,
        combosCount: straight.combos
      });
    } else if (straight.gapsNeeded === 2) {
      threats.push({
        handType: 'Straight',
        description: straight.description,
        beatsYou: straightBeatsYou,
        likelihood: 'low',
        requiredHoleCards: 'Two gap cards',
        combosCount: straight.combos
      });
    }
  }

  return { threats };
}

/**
 * Check for paired board threats (full house/quads)
 */
function checkPairedBoardThreats(
  communityCards: Card[],
  yourHandRank: number
): { threats: Threat[] } {
  const threats: Threat[] = [];
  const rankCounts = countRanks(communityCards);

  for (const [rank, count] of rankCounts) {
    const rankName = rank === 'T' ? '10' : rank;
    
    if (count === 2) {
      // Paired board - full house possible
      const fullHouseBeatsYou = yourHandRank < 7; // 7 = Full House
      threats.push({
        handType: 'Full House',
        description: `Paired ${rankName}s on board - full house possible`,
        beatsYou: fullHouseBeatsYou,
        likelihood: 'medium',
        requiredHoleCards: `Any pair or ${rankName}`,
        combosCount: 66 // Approximate: 13 pairs * 6 combos - pairs on board
      });
    } else if (count === 3) {
      // Trips on board
      const fullHouseBeatsYou = yourHandRank < 7;
      const quadsBeatsYou = yourHandRank < 8; // 8 = Four of a Kind
      
      threats.push({
        handType: 'Full House',
        description: `Trip ${rankName}s on board - full house very likely`,
        beatsYou: fullHouseBeatsYou,
        likelihood: 'high',
        requiredHoleCards: 'Any pair',
        combosCount: 78 // 13 pairs * 6 combos
      });
      
      threats.push({
        handType: 'Four of a Kind',
        description: `Trip ${rankName}s on board - quads possible`,
        beatsYou: quadsBeatsYou,
        likelihood: 'low',
        requiredHoleCards: `The last ${rankName}`,
        combosCount: 1
      });
    } else if (count === 4) {
      // Quads on board
      threats.push({
        handType: 'Four of a Kind',
        description: `Quad ${rankName}s on board - everyone has quads`,
        beatsYou: false,
        likelihood: 'high',
        combosCount: 0
      });
    }
  }

  return { threats };
}

/**
 * Check for set threats on unpaired boards
 */
function checkSetThreats(
  communityCards: Card[],
  yourHandRank: number
): { threats: Threat[] } {
  const threats: Threat[] = [];
  const isPaired = hasPair(communityCards);
  const setBeatsYou = yourHandRank < 4; // 4 = Three of a Kind

  if (!isPaired && communityCards.length >= 3) {
    const uniqueRanks = getUniqueRanks(communityCards);
    const displayRanks = uniqueRanks.map(r => r === 'T' ? '10' : r).join(', ');
    
    threats.push({
      handType: 'Set',
      description: 'Pocket pairs could have flopped a set',
      beatsYou: setBeatsYou,
      likelihood: 'medium',
      requiredHoleCards: `Pocket ${displayRanks}`,
      combosCount: uniqueRanks.length * 3 // 3 combos per rank on board
    });
  }

  return { threats };
}

/**
 * Generate threat summary
 */
function generateThreatSummary(threats: Threat[]): string {
  const beatingThreats = threats.filter(t => t.beatsYou);
  
  if (beatingThreats.length === 0) {
    return 'No current threats beat your hand';
  }

  const highThreats = beatingThreats.filter(t => t.likelihood === 'high').length;
  const mediumThreats = beatingThreats.filter(t => t.likelihood === 'medium').length;

  if (highThreats > 0) {
    return `${highThreats} high-likelihood threat${highThreats > 1 ? 's' : ''} beat${highThreats === 1 ? 's' : ''} your hand`;
  } else if (mediumThreats > 0) {
    return `${mediumThreats} possible threat${mediumThreats > 1 ? 's' : ''} beat${mediumThreats === 1 ? 's' : ''} your hand`;
  } else {
    return `${beatingThreats.length} low-likelihood threat${beatingThreats.length > 1 ? 's' : ''}`;
  }
}

/**
 * Main threat analysis function
 * Analyzes board texture to identify possible beating hands
 */
export function analyzePossibleThreats(
  yourHoleCards: Card[],
  communityCards: Card[],
  yourHandStrength: HandStrength
): ThreatAnalysis {
  const threats: Threat[] = [];

  // Detect all threat types
  const flushThreats = checkFlushThreats(communityCards, yourHandStrength.rank);
  threats.push(...flushThreats.threats);

  const straightThreats = checkStraightThreats(communityCards, yourHandStrength.rank);
  threats.push(...straightThreats.threats);

  const pairedBoardThreats = checkPairedBoardThreats(communityCards, yourHandStrength.rank);
  threats.push(...pairedBoardThreats.threats);

  const setThreats = checkSetThreats(communityCards, yourHandStrength.rank);
  threats.push(...setThreats.threats);

  // Calculate total beating combos
  const totalBeatingCombos = threats
    .filter(t => t.beatsYou)
    .reduce((sum, t) => sum + (t.combosCount || 0), 0);

  return {
    threats,
    totalBeatingCombos,
    yourHandRank: yourHandStrength.rank,
    yourHandName: yourHandStrength.name,
    summary: generateThreatSummary(threats)
  };
}

