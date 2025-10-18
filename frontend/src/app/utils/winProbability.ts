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

export interface ProgressCallback {
  (completed: number, total: number): void;
}

/**
 * Calculate win probability against a representative sample of opponent hands (ASYNC)
 * Uses strategic sampling for WSOP-style accuracy with better performance
 * @param holeCards - Player's hole cards
 * @param communityCards - Board cards (can be empty, flop, or turn)
 * @param opponentCount - Number of opponents (default: 1)
 * @param samples - Number of opponent hands to sample (default: 50 for speed)
 * @param onProgress - Optional callback to report progress (completed, total)
 * @returns Promise with win probability breakdown
 */
export async function calculateWinProbability(
  holeCards: Card[],
  communityCards: Card[],
  opponentCount: number = 1,
  samples: number = 50,
  onProgress?: ProgressCallback
): Promise<WinProbability> {
  if (holeCards.length !== 2) {
    throw new Error('Must have exactly 2 hole cards');
  }

  // Validate opponent count
  if (opponentCount < 1 || opponentCount > 8) {
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
  const opponentHandSets = sampleMultipleOpponentHands(availableCards, samples, opponentCount);

  // Report initial progress
  if (onProgress) {
    onProgress(0, opponentHandSets.length);
  }

  // Calculate equity against each sampled set of opponent hands
  // Process in batches to avoid blocking UI
  const batchSize = 10;
  let completedSamples = 0;
  
  for (let i = 0; i < opponentHandSets.length; i += batchSize) {
    // Yield to browser after each batch
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    const batch = opponentHandSets.slice(i, i + batchSize);
    
    for (const opponentHands of batch) {
      // Create game for this matchup
      const game = new TexasHoldem();
      game.addPlayer(holeCards.map(convertToOddsCalcFormat));
      
      // Add all opponent hands
      for (const oppHand of opponentHands) {
        game.addPlayer(oppHand);
      }

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
      
      // Report progress after EACH sample completes (fluid updates)
      completedSamples++;
      if (onProgress) {
        onProgress(completedSamples, opponentHandSets.length);
      }
    }
  }

  // Average across all sampled scenarios
  const avgEquity = sumEquity / opponentHandSets.length;
  const avgWinPct = sumWinPct / opponentHandSets.length;
  const avgTiePct = sumTiePct / opponentHandSets.length;
  const avgLossPct = sumLossPct / opponentHandSets.length;

  return {
    winPercentage: avgWinPct,
    tiePercentage: avgTiePct,
    losePercentage: avgLossPct,
    equity: avgEquity
  };
}

/**
 * Sample multiple opponent hands for multi-player scenarios
 * @param availableCards - Cards available to deal
 * @param sampleCount - Number of different scenarios to sample
 * @param opponentCount - Number of opponents in each scenario
 * @returns Array of scenarios, each containing multiple opponent hands
 */
function sampleMultipleOpponentHands(
  availableCards: string[], 
  sampleCount: number, 
  opponentCount: number
): string[][][] {
  const scenarios: string[][][] = [];
  
  for (let i = 0; i < sampleCount; i++) {
    const shuffled = shuffle([...availableCards]);
    const opponentHands: string[][] = [];
    
    // Deal cards to each opponent (2 cards each)
    for (let j = 0; j < opponentCount; j++) {
      const startIdx = j * 2;
      const hand = shuffled.slice(startIdx, startIdx + 2);
      opponentHands.push(hand);
    }
    
    scenarios.push(opponentHands);
  }
  
  return scenarios;
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

