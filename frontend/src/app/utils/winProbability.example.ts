/**
 * Win Probability Calculator - Usage Examples
 * 
 * This file demonstrates how to use the win probability calculator
 * in different scenarios.
 */

import { calculateWinProbability, calculateWinProbabilityVsHand } from './winProbability';

// Example cards (using your Card type)
const exampleCards = {
  aceHearts: { value: 'A', suit: 'hearts' as const },
  kingHearts: { value: 'K', suit: 'hearts' as const },
  queenHearts: { value: 'Q', suit: 'hearts' as const },
  jackHearts: { value: 'J', suit: 'hearts' as const },
  twoClubs: { value: '2', suit: 'clubs' as const },
  sevenSpades: { value: '7', suit: 'spades' as const },
  nineSpades: { value: '9', suit: 'spades' as const },
  eightDiamonds: { value: '8', suit: 'diamonds' as const },
};

// Example 1: Pre-flop probability
// AKs (Ace-King suited) vs 1 random opponent
export function example1_PreFlop() {
  const holeCards = [exampleCards.aceHearts, exampleCards.kingHearts];
  const communityCards: any[] = []; // No flop yet
  
  const result = calculateWinProbability(holeCards, communityCards, 1);
  console.log('Pre-flop AKs equity:', result.equity + '%');
  // Expected: ~66% against random hand
}

// Example 2: Flop probability
// AKs on Q-J-2 flop (straight draw + overcards)
export function example2_FlopDraw() {
  const holeCards = [exampleCards.aceHearts, exampleCards.kingHearts];
  const flop = [
    exampleCards.queenHearts,
    exampleCards.jackHearts,
    exampleCards.twoClubs
  ];
  
  const result = calculateWinProbability(holeCards, flop, 1);
  console.log('Flop with straight draw:', result.winPercentage + '%');
}

// Example 3: Multiple opponents
// Calculate equity vs 3 opponents
export function example3_MultipleOpponents() {
  const holeCards = [exampleCards.aceHearts, exampleCards.kingHearts];
  const flop = [
    exampleCards.queenHearts,
    exampleCards.jackHearts,
    exampleCards.twoClubs
  ];
  
  const result = calculateWinProbability(holeCards, flop, 3);
  console.log('Equity vs 3 opponents:', result.equity + '%');
}

// Example 4: Head-to-head vs specific hand
// AKs vs 77 (pocket sevens)
export function example4_SpecificMatchup() {
  const myHand = [exampleCards.aceHearts, exampleCards.kingHearts];
  const opponentHand = [exampleCards.sevenSpades, { value: '7', suit: 'diamonds' as const }];
  const flop: any[] = [];
  
  const result = calculateWinProbabilityVsHand(myHand, opponentHand, flop);
  console.log('AKs vs 77 pre-flop:', result.equity + '%');
  // Expected: ~47% (77 is slight favorite pre-flop)
}

// Example 5: Turn card analysis
// Check equity changes from flop to turn
export function example5_TurnAnalysis() {
  const holeCards = [exampleCards.aceHearts, exampleCards.kingHearts];
  const flop = [
    exampleCards.queenHearts,
    exampleCards.jackHearts,
    exampleCards.twoClubs
  ];
  
  // Equity on flop
  const flopEquity = calculateWinProbability(holeCards, flop, 1);
  
  // Add turn card
  const turn = [...flop, exampleCards.nineSpades];
  const turnEquity = calculateWinProbability(holeCards, turn, 1);
  
  console.log('Equity change from flop to turn:');
  console.log('  Flop:', flopEquity.equity + '%');
  console.log('  Turn:', turnEquity.equity + '%');
  console.log('  Difference:', (turnEquity.equity - flopEquity.equity).toFixed(1) + '%');
}

// Example 6: Using lower iterations for faster calculation
// Useful for real-time updates where speed matters
export function example6_FastCalculation() {
  const holeCards = [exampleCards.aceHearts, exampleCards.kingHearts];
  const flop = [
    exampleCards.queenHearts,
    exampleCards.jackHearts,
    exampleCards.twoClubs
  ];
  
  // Use 1000 iterations instead of default 10000
  const result = calculateWinProbability(holeCards, flop, 1, 1000);
  console.log('Quick calculation (1k iterations):', result.equity + '%');
  // Less accurate but much faster
}

/*
 * Integration Tips:
 * 
 * 1. Use useEffect to recalculate when cards change
 * 2. Run calculations in setTimeout to avoid blocking UI
 * 3. Use 10,000 iterations for accuracy (default)
 * 4. Use 1,000-5,000 iterations if you need speed
 * 5. Consider debouncing rapid updates
 * 
 * Performance Notes:
 * - 1,000 iterations: ~10ms (fast, less accurate)
 * - 5,000 iterations: ~50ms (balanced)
 * - 10,000 iterations: ~100ms (accurate, recommended)
 * - 50,000 iterations: ~500ms (very accurate, overkill)
 */

