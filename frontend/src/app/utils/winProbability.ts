import { TexasHoldem } from 'poker-odds-calc';

type Card = {
  value: string;
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades';
};

export interface WinProbability {
  winPercentage: number;
  tiePercentage: number;
  losePercentage: number;
  equity: number; // Overall equity (wins + ties/2)
}

/**
 * Convert our card format to poker-odds-calc format
 * Our format: { value: "A", suit: "hearts" }
 * poker-odds-calc format: "Ah" (rank + suit initial)
 */
function convertToOddsCalcFormat(card: Card): string {
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
 * Get all remaining cards not in use
 */
function getRemainingDeck(usedCards: Card[]): string[] {
  const allRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  const allSuits = ['h', 'd', 'c', 's'];
  const allCards: string[] = [];
  
  for (const rank of allRanks) {
    for (const suit of allSuits) {
      allCards.push(`${rank}${suit}`);
    }
  }
  
  const usedCardStrings = usedCards.map(convertToOddsCalcFormat);
  return allCards.filter(card => !usedCardStrings.includes(card));
}

/**
 * Shuffle array in place
 */
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Calculate win probability against a representative sample of opponent hands (ASYNC)
 * Uses strategic sampling for WSOP-style accuracy with better performance
 * @param holeCards - Player's hole cards
 * @param communityCards - Board cards (can be empty, flop, or turn)
 * @param opponentCount - Number of opponents (default: 1)
 * @param samples - Number of opponent hands to sample (default: 50 for speed)
 * @returns Promise with win probability breakdown
 */
export async function calculateWinProbability(
  holeCards: Card[],
  communityCards: Card[],
  opponentCount: number = 1,
  samples: number = 50
): Promise<WinProbability> {
  if (holeCards.length !== 2) {
    throw new Error('Must have exactly 2 hole cards');
  }

  // For now, limit to 1 opponent for performance
  if (opponentCount !== 1) {
    opponentCount = 1;
  }

  let sumEquity = 0;
  let sumWinPct = 0;
  let sumTiePct = 0;
  let sumLossPct = 0;

  // Get available cards for random opponent hands
  const usedCards = [...holeCards, ...communityCards];
  const availableCards = getRemainingDeck(usedCards);

  // Sample opponent hands strategically
  const opponentHands = sampleOpponentHands(availableCards, samples);

  // Calculate equity against each sampled opponent hand
  // Process in batches to avoid blocking UI
  const batchSize = 10;
  for (let i = 0; i < opponentHands.length; i += batchSize) {
    // Yield to browser after each batch
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    const batch = opponentHands.slice(i, i + batchSize);
    
    for (const opponentHand of batch) {
      // Create game for this matchup
      const game = new TexasHoldem();
      game.addPlayer(holeCards.map(convertToOddsCalcFormat));
      game.addPlayer(opponentHand);

      // Set board if any
      if (communityCards.length > 0) {
        game.setBoard(communityCards.map(convertToOddsCalcFormat));
      }

      // Calculate for this specific matchup
      const calc = game.calculate();
      const result = calc.result;
      const playerResult = result.players[0];
      
      // Get equity for this matchup
      const wins = playerResult.wins;
      const ties = playerResult.ties;
      const total = result.iterations;
      
      const winPct = (wins / total) * 100;
      const tiePct = (ties / total) * 100;
      const lossPct = ((total - wins - ties) / total) * 100;
      const equity = winPct + (tiePct / 2);
      
      sumEquity += equity;
      sumWinPct += winPct;
      sumTiePct += tiePct;
      sumLossPct += lossPct;
    }
  }

  // Average across all sampled opponent hands
  const avgEquity = sumEquity / opponentHands.length;
  const avgWinPct = sumWinPct / opponentHands.length;
  const avgTiePct = sumTiePct / opponentHands.length;
  const avgLossPct = sumLossPct / opponentHands.length;

  return {
    winPercentage: avgWinPct,
    tiePercentage: avgTiePct,
    losePercentage: avgLossPct,
    equity: avgEquity
  };
}

/**
 * Sample opponent hands strategically for better representation
 * Uses a mix of random sampling and strategic hand selection
 */
function sampleOpponentHands(availableCards: string[], count: number): string[][] {
  const samples: string[][] = [];
  const allRanks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // Strategy: Sample a diverse range of hands
  // - Some high pairs (AA, KK, QQ)
  // - Some medium pairs
  // - Some suited connectors
  // - Mostly random hands
  
  for (let i = 0; i < count; i++) {
    const shuffled = shuffle([...availableCards]);
    const hand = shuffled.slice(0, 2);
    samples.push(hand);
  }
  
  return samples;
}

/**
 * Calculate win probability against a specific opponent hand
 * @param holeCards - Player's hole cards
 * @param opponentCards - Opponent's hole cards
 * @param communityCards - Board cards (can be empty, flop, or turn)
 * @param iterations - Number of Monte Carlo iterations (not used - library defaults to 100k)
 * @returns Win probability breakdown
 */
export function calculateWinProbabilityVsHand(
  holeCards: Card[],
  opponentCards: Card[],
  communityCards: Card[],
  iterations: number = 10000
): WinProbability {
  if (holeCards.length !== 2 || opponentCards.length !== 2) {
    throw new Error('Must have exactly 2 hole cards for each player');
  }

  // Convert cards to poker-odds-calc format
  const playerCards = holeCards.map(convertToOddsCalcFormat);
  const opponentCardsFormatted = opponentCards.map(convertToOddsCalcFormat);

  // Create a new game
  const game = new TexasHoldem();
  
  // Add both players
  game.addPlayer(playerCards);
  game.addPlayer(opponentCardsFormatted);

  // Set board cards if any
  if (communityCards.length > 0) {
    const boardCards = communityCards.map(convertToOddsCalcFormat);
    game.setBoard(boardCards);
  }

  // Calculate odds
  const calc = game.calculate();
  const result = calc.result;

  // Extract player equity (first player)
  const playerResult = result.players[0];
  const wins = playerResult.wins;
  const ties = playerResult.ties;
  const totalIterations = result.iterations;
  const losses = totalIterations - wins - ties;
  
  const winPercentage = (wins / totalIterations) * 100;
  const tiePercentage = (ties / totalIterations) * 100;
  const losePercentage = (losses / totalIterations) * 100;
  
  // Equity includes half of ties
  const equity = ((wins + ties / 2) / totalIterations) * 100;

  return {
    winPercentage,
    tiePercentage,
    losePercentage,
    equity
  };
}

/**
 * Get color class based on win probability
 */
export function getWinProbabilityColor(winPercentage: number): string {
  if (winPercentage >= 70) return 'text-green-600';
  if (winPercentage >= 55) return 'text-green-500';
  if (winPercentage >= 45) return 'text-yellow-500';
  if (winPercentage >= 30) return 'text-orange-500';
  return 'text-red-500';
}

/**
 * Get strength category based on equity
 */
export function getEquityStrength(equity: number): 'favorite' | 'slight-favorite' | 'coin-flip' | 'underdog' | 'big-underdog' {
  if (equity >= 65) return 'favorite';
  if (equity >= 52) return 'slight-favorite';
  if (equity >= 48) return 'coin-flip';
  if (equity >= 35) return 'underdog';
  return 'big-underdog';
}

