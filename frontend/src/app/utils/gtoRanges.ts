/**
 * GTO (Game Theory Optimal) Hand Ranges
 * Based on standard 6-max cash game ranges at 100BB
 */

export type Action = 'raise' | 'call' | 'fold';
export type Position = 'UTG' | 'MP' | 'CO' | 'BTN' | 'SB' | 'BB';

export interface HandRecommendation {
  action: Action;
  frequency: number; // 0-100 percentage
  raiseSize?: number; // BB multiplier
  category?: 'premium' | 'strong' | 'playable' | 'marginal' | 'fold';
}

// Compact range notation: each string is hand, action frequency
// Format: "AA:r100:2.5" = AA, raise 100%, 2.5BB size
type RangeMap = Record<string, HandRecommendation>;

// Helper to create recommendation
const r = (action: Action, freq: number, size?: number, cat?: HandRecommendation['category']): HandRecommendation => ({
  action, frequency: freq, raiseSize: size, category: cat
});

// All 169 possible starting hands (kept for reference/future use)
// const ALL_HANDS = [
//   // Pairs
//   'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', '77', '66', '55', '44', '33', '22',
//   // ... (full list commented out to avoid unused variable warning)
// ];

export const GTO_RANGES: Record<Position, RangeMap> = {
  UTG: {
    // Premium
    'AA': r('raise', 100, 2.5, 'premium'), 'KK': r('raise', 100, 2.5, 'premium'),
    'QQ': r('raise', 100, 2.5, 'premium'), 'JJ': r('raise', 100, 2.5, 'premium'),
    'AKs': r('raise', 100, 2.5, 'premium'), 'AKo': r('raise', 100, 2.5, 'premium'),
    // Strong
    'TT': r('raise', 100, 2.5, 'strong'), '99': r('raise', 100, 2.5, 'strong'),
    'AQs': r('raise', 100, 2.5, 'strong'), 'AJs': r('raise', 100, 2.5, 'strong'),
    'ATs': r('raise', 100, 2.5, 'strong'), 'KQs': r('raise', 100, 2.5, 'strong'),
    'AQo': r('raise', 100, 2.5, 'strong'),
    // Playable
    '88': r('raise', 100, 2.5, 'playable'), '77': r('raise', 80, 2.5, 'playable'),
    'KJs': r('raise', 100, 2.5, 'playable'), 'KTs': r('raise', 80, 2.5, 'playable'),
    'QJs': r('raise', 100, 2.5, 'playable'), 'JTs': r('raise', 100, 2.5, 'playable'),
    'AJo': r('raise', 100, 2.5, 'playable'), 'KQo': r('raise', 100, 2.5, 'playable'),
    // Marginal
    '66': r('raise', 60, 2.5, 'marginal'), 'QTs': r('raise', 60, 2.5, 'marginal'),
    'A9s': r('raise', 50, 2.5, 'marginal'), 'ATo': r('raise', 80, 2.5, 'marginal'),
  },
  
  MP: {
    // Premium  
    'AA': r('raise', 100, 2.5, 'premium'), 'KK': r('raise', 100, 2.5, 'premium'),
    'QQ': r('raise', 100, 2.5, 'premium'), 'JJ': r('raise', 100, 2.5, 'premium'),
    'AKs': r('raise', 100, 2.5, 'premium'), 'AKo': r('raise', 100, 2.5, 'premium'),
    // Strong
    'TT': r('raise', 100, 2.5, 'strong'), '99': r('raise', 100, 2.5, 'strong'),
    '88': r('raise', 100, 2.5, 'strong'),
    'AQs': r('raise', 100, 2.5, 'strong'), 'AJs': r('raise', 100, 2.5, 'strong'),
    'ATs': r('raise', 100, 2.5, 'strong'), 'KQs': r('raise', 100, 2.5, 'strong'),
    'KJs': r('raise', 100, 2.5, 'strong'), 'QJs': r('raise', 100, 2.5, 'strong'),
    'JTs': r('raise', 100, 2.5, 'strong'),
    'AQo': r('raise', 100, 2.5, 'strong'), 'AJo': r('raise', 100, 2.5, 'strong'),
    'KQo': r('raise', 100, 2.5, 'strong'),
    // Playable
    '77': r('raise', 100, 2.5, 'playable'), '66': r('raise', 100, 2.5, 'playable'),
    '55': r('raise', 80, 2.5, 'playable'),
    'A9s': r('raise', 100, 2.5, 'playable'), 'KTs': r('raise', 100, 2.5, 'playable'),
    'QTs': r('raise', 100, 2.5, 'playable'), 'T9s': r('raise', 80, 2.5, 'playable'),
    'ATo': r('raise', 100, 2.5, 'playable'), 'KJo': r('raise', 100, 2.5, 'playable'),
    // Marginal
    'A8s': r('raise', 60, 2.5, 'marginal'), 'K9s': r('raise', 50, 2.5, 'marginal'),
    'QJo': r('raise', 80, 2.5, 'marginal'),
  },

  CO: {
    // Premium
    'AA': r('raise', 100, 2.5, 'premium'), 'KK': r('raise', 100, 2.5, 'premium'),
    'QQ': r('raise', 100, 2.5, 'premium'), 'JJ': r('raise', 100, 2.5, 'premium'),
    'TT': r('raise', 100, 2.5, 'premium'),
    'AKs': r('raise', 100, 2.5, 'premium'), 'AQs': r('raise', 100, 2.5, 'premium'),
    'AKo': r('raise', 100, 2.5, 'premium'), 'AQo': r('raise', 100, 2.5, 'premium'),
    // Strong - all pairs
    '99': r('raise', 100, 2.5, 'strong'), '88': r('raise', 100, 2.5, 'strong'),
    '77': r('raise', 100, 2.5, 'strong'), '66': r('raise', 100, 2.5, 'strong'),
    '55': r('raise', 100, 2.5, 'strong'), '44': r('raise', 100, 2.5, 'strong'),
    '33': r('raise', 100, 2.5, 'strong'), '22': r('raise', 100, 2.5, 'strong'),
    // Strong suited
    'AJs': r('raise', 100, 2.5, 'strong'), 'ATs': r('raise', 100, 2.5, 'strong'),
    'A9s': r('raise', 100, 2.5, 'strong'), 'A8s': r('raise', 100, 2.5, 'strong'),
    'A7s': r('raise', 100, 2.5, 'strong'), 'A6s': r('raise', 100, 2.5, 'strong'),
    'A5s': r('raise', 100, 2.5, 'strong'), 'A4s': r('raise', 100, 2.5, 'strong'),
    'A3s': r('raise', 100, 2.5, 'strong'), 'A2s': r('raise', 100, 2.5, 'strong'),
    'KQs': r('raise', 100, 2.5, 'strong'), 'KJs': r('raise', 100, 2.5, 'strong'),
    'KTs': r('raise', 100, 2.5, 'strong'), 'K9s': r('raise', 100, 2.5, 'strong'),
    'QJs': r('raise', 100, 2.5, 'strong'), 'QTs': r('raise', 100, 2.5, 'strong'),
    'Q9s': r('raise', 100, 2.5, 'strong'),
    'JTs': r('raise', 100, 2.5, 'strong'), 'J9s': r('raise', 100, 2.5, 'strong'),
    'T9s': r('raise', 100, 2.5, 'strong'), 'T8s': r('raise', 100, 2.5, 'strong'),
    '98s': r('raise', 100, 2.5, 'strong'), '87s': r('raise', 100, 2.5, 'strong'),
    '76s': r('raise', 100, 2.5, 'strong'), '65s': r('raise', 100, 2.5, 'strong'),
    '54s': r('raise', 100, 2.5, 'strong'),
    // Strong offsuit
    'AJo': r('raise', 100, 2.5, 'strong'), 'ATo': r('raise', 100, 2.5, 'strong'),
    'KQo': r('raise', 100, 2.5, 'strong'), 'KJo': r('raise', 100, 2.5, 'strong'),
    'QJo': r('raise', 100, 2.5, 'strong'), 'JTo': r('raise', 100, 2.5, 'strong'),
    // Playable
    'K8s': r('raise', 80, 2.5, 'playable'), 'K7s': r('raise', 70, 2.5, 'playable'),
    'Q8s': r('raise', 80, 2.5, 'playable'), 'J8s': r('raise', 80, 2.5, 'playable'),
    'T7s': r('raise', 80, 2.5, 'playable'), '97s': r('raise', 80, 2.5, 'playable'),
    '86s': r('raise', 80, 2.5, 'playable'), '75s': r('raise', 80, 2.5, 'playable'),
    'A9o': r('raise', 100, 2.5, 'playable'), 'KTo': r('raise', 100, 2.5, 'playable'),
    'QTo': r('raise', 100, 2.5, 'playable'), 'J9o': r('raise', 80, 2.5, 'playable'),
    'T9o': r('raise', 100, 2.5, 'playable'),
    // Marginal
    'K6s': r('raise', 50, 2.5, 'marginal'), 'Q7s': r('raise', 60, 2.5, 'marginal'),
    'J7s': r('raise', 60, 2.5, 'marginal'), 'T6s': r('raise', 60, 2.5, 'marginal'),
    '96s': r('raise', 60, 2.5, 'marginal'), '64s': r('raise', 60, 2.5, 'marginal'),
    '53s': r('raise', 60, 2.5, 'marginal'), '43s': r('raise', 60, 2.5, 'marginal'),
    'A8o': r('raise', 80, 2.5, 'marginal'), 'K9o': r('raise', 80, 2.5, 'marginal'),
    'Q9o': r('raise', 80, 2.5, 'marginal'),
  },

  BTN: {
    // Raise almost everything - 45-50% range
    // Premium
    'AA': r('raise', 100, 2.5, 'premium'), 'KK': r('raise', 100, 2.5, 'premium'),
    'QQ': r('raise', 100, 2.5, 'premium'), 'JJ': r('raise', 100, 2.5, 'premium'),
    'TT': r('raise', 100, 2.5, 'premium'), '99': r('raise', 100, 2.5, 'premium'),
    'AKs': r('raise', 100, 2.5, 'premium'), 'AQs': r('raise', 100, 2.5, 'premium'),
    'AKo': r('raise', 100, 2.5, 'premium'), 'AQo': r('raise', 100, 2.5, 'premium'),
    // Strong - all pairs and most suited
    '88': r('raise', 100, 2.5, 'strong'), '77': r('raise', 100, 2.5, 'strong'),
    '66': r('raise', 100, 2.5, 'strong'), '55': r('raise', 100, 2.5, 'strong'),
    '44': r('raise', 100, 2.5, 'strong'), '33': r('raise', 100, 2.5, 'strong'),
    '22': r('raise', 100, 2.5, 'strong'),
    // All suited aces
    'AJs': r('raise', 100, 2.5, 'strong'), 'ATs': r('raise', 100, 2.5, 'strong'),
    'A9s': r('raise', 100, 2.5, 'strong'), 'A8s': r('raise', 100, 2.5, 'strong'),
    'A7s': r('raise', 100, 2.5, 'strong'), 'A6s': r('raise', 100, 2.5, 'strong'),
    'A5s': r('raise', 100, 2.5, 'strong'), 'A4s': r('raise', 100, 2.5, 'strong'),
    'A3s': r('raise', 100, 2.5, 'strong'), 'A2s': r('raise', 100, 2.5, 'strong'),
    // All suited kings
    'KQs': r('raise', 100, 2.5, 'strong'), 'KJs': r('raise', 100, 2.5, 'strong'),
    'KTs': r('raise', 100, 2.5, 'strong'), 'K9s': r('raise', 100, 2.5, 'strong'),
    'K8s': r('raise', 100, 2.5, 'strong'), 'K7s': r('raise', 100, 2.5, 'strong'),
    'K6s': r('raise', 100, 2.5, 'strong'), 'K5s': r('raise', 100, 2.5, 'strong'),
    'K4s': r('raise', 100, 2.5, 'strong'), 'K3s': r('raise', 100, 2.5, 'strong'),
    'K2s': r('raise', 100, 2.5, 'strong'),
    // All suited queens
    'QJs': r('raise', 100, 2.5, 'strong'), 'QTs': r('raise', 100, 2.5, 'strong'),
    'Q9s': r('raise', 100, 2.5, 'strong'), 'Q8s': r('raise', 100, 2.5, 'strong'),
    'Q7s': r('raise', 100, 2.5, 'strong'), 'Q6s': r('raise', 100, 2.5, 'strong'),
    'Q5s': r('raise', 100, 2.5, 'strong'), 'Q4s': r('raise', 100, 2.5, 'strong'),
    'Q3s': r('raise', 100, 2.5, 'strong'), 'Q2s': r('raise', 100, 2.5, 'strong'),
    // Suited connectors and one-gappers
    'JTs': r('raise', 100, 2.5, 'strong'), 'J9s': r('raise', 100, 2.5, 'strong'),
    'J8s': r('raise', 100, 2.5, 'strong'), 'J7s': r('raise', 100, 2.5, 'strong'),
    'J6s': r('raise', 100, 2.5, 'strong'), 'J5s': r('raise', 100, 2.5, 'strong'),
    'J4s': r('raise', 100, 2.5, 'strong'),
    'T9s': r('raise', 100, 2.5, 'strong'), 'T8s': r('raise', 100, 2.5, 'strong'),
    'T7s': r('raise', 100, 2.5, 'strong'), 'T6s': r('raise', 100, 2.5, 'strong'),
    'T5s': r('raise', 100, 2.5, 'strong'), 'T4s': r('raise', 100, 2.5, 'strong'),
    '98s': r('raise', 100, 2.5, 'strong'), '97s': r('raise', 100, 2.5, 'strong'),
    '96s': r('raise', 100, 2.5, 'strong'), '95s': r('raise', 100, 2.5, 'strong'),
    '87s': r('raise', 100, 2.5, 'strong'), '86s': r('raise', 100, 2.5, 'strong'),
    '85s': r('raise', 100, 2.5, 'strong'), '84s': r('raise', 100, 2.5, 'strong'),
    '76s': r('raise', 100, 2.5, 'strong'), '75s': r('raise', 100, 2.5, 'strong'),
    '74s': r('raise', 100, 2.5, 'strong'),
    '65s': r('raise', 100, 2.5, 'strong'), '64s': r('raise', 100, 2.5, 'strong'),
    '54s': r('raise', 100, 2.5, 'strong'), '53s': r('raise', 100, 2.5, 'strong'),
    '43s': r('raise', 100, 2.5, 'strong'),
    // Broadway offsuit
    'AJo': r('raise', 100, 2.5, 'strong'), 'ATo': r('raise', 100, 2.5, 'strong'),
    'A9o': r('raise', 100, 2.5, 'strong'), 'A8o': r('raise', 100, 2.5, 'strong'),
    'A7o': r('raise', 100, 2.5, 'strong'), 'A6o': r('raise', 100, 2.5, 'strong'),
    'A5o': r('raise', 100, 2.5, 'strong'), 'A4o': r('raise', 100, 2.5, 'strong'),
    'A3o': r('raise', 100, 2.5, 'strong'), 'A2o': r('raise', 100, 2.5, 'strong'),
    'KQo': r('raise', 100, 2.5, 'strong'), 'KJo': r('raise', 100, 2.5, 'strong'),
    'KTo': r('raise', 100, 2.5, 'strong'), 'K9o': r('raise', 100, 2.5, 'strong'),
    'K8o': r('raise', 100, 2.5, 'strong'), 'K7o': r('raise', 100, 2.5, 'strong'),
    'QJo': r('raise', 100, 2.5, 'strong'), 'QTo': r('raise', 100, 2.5, 'strong'),
    'Q9o': r('raise', 100, 2.5, 'strong'), 'Q8o': r('raise', 100, 2.5, 'strong'),
    'JTo': r('raise', 100, 2.5, 'strong'), 'J9o': r('raise', 100, 2.5, 'strong'),
    'J8o': r('raise', 100, 2.5, 'strong'),
    'T9o': r('raise', 100, 2.5, 'strong'), 'T8o': r('raise', 100, 2.5, 'strong'),
    '98o': r('raise', 100, 2.5, 'strong'), '87o': r('raise', 100, 2.5, 'strong'),
    // Playable
    'J3s': r('raise', 80, 2.5, 'playable'), 'T3s': r('raise', 80, 2.5, 'playable'),
    '94s': r('raise', 80, 2.5, 'playable'), '83s': r('raise', 80, 2.5, 'playable'),
    '73s': r('raise', 80, 2.5, 'playable'), '63s': r('raise', 80, 2.5, 'playable'),
    'K6o': r('raise', 80, 2.5, 'playable'), 'Q7o': r('raise', 80, 2.5, 'playable'),
    'J7o': r('raise', 80, 2.5, 'playable'), 'T7o': r('raise', 80, 2.5, 'playable'),
    '97o': r('raise', 80, 2.5, 'playable'), '86o': r('raise', 80, 2.5, 'playable'),
    '76o': r('raise', 80, 2.5, 'playable'),
  },

  SB: {
    // SB vs BB is unique - raise or fold strategy
    // Premium
    'AA': r('raise', 100, 3, 'premium'), 'KK': r('raise', 100, 3, 'premium'),
    'QQ': r('raise', 100, 3, 'premium'), 'JJ': r('raise', 100, 3, 'premium'),
    'TT': r('raise', 100, 3, 'premium'), '99': r('raise', 100, 3, 'premium'),
    'AKs': r('raise', 100, 3, 'premium'), 'AQs': r('raise', 100, 3, 'premium'),
    'AKo': r('raise', 100, 3, 'premium'), 'AQo': r('raise', 100, 3, 'premium'),
    // Strong
    '88': r('raise', 100, 3, 'strong'), '77': r('raise', 100, 3, 'strong'),
    '66': r('raise', 100, 3, 'strong'), '55': r('raise', 100, 3, 'strong'),
    '44': r('raise', 100, 3, 'strong'), '33': r('raise', 100, 3, 'strong'),
    '22': r('raise', 100, 3, 'strong'),
    'AJs': r('raise', 100, 3, 'strong'), 'ATs': r('raise', 100, 3, 'strong'),
    'A9s': r('raise', 100, 3, 'strong'), 'A8s': r('raise', 100, 3, 'strong'),
    'A7s': r('raise', 100, 3, 'strong'), 'A6s': r('raise', 100, 3, 'strong'),
    'A5s': r('raise', 100, 3, 'strong'), 'A4s': r('raise', 100, 3, 'strong'),
    'A3s': r('raise', 100, 3, 'strong'), 'A2s': r('raise', 100, 3, 'strong'),
    'KQs': r('raise', 100, 3, 'strong'), 'KJs': r('raise', 100, 3, 'strong'),
    'KTs': r('raise', 100, 3, 'strong'), 'K9s': r('raise', 100, 3, 'strong'),
    'QJs': r('raise', 100, 3, 'strong'), 'QTs': r('raise', 100, 3, 'strong'),
    'JTs': r('raise', 100, 3, 'strong'), 'T9s': r('raise', 100, 3, 'strong'),
    '98s': r('raise', 100, 3, 'strong'), '87s': r('raise', 100, 3, 'strong'),
    '76s': r('raise', 100, 3, 'strong'), '65s': r('raise', 100, 3, 'strong'),
    '54s': r('raise', 100, 3, 'strong'),
    'AJo': r('raise', 100, 3, 'strong'), 'ATo': r('raise', 100, 3, 'strong'),
    'A9o': r('raise', 100, 3, 'strong'), 'A8o': r('raise', 100, 3, 'strong'),
    'KQo': r('raise', 100, 3, 'strong'), 'KJo': r('raise', 100, 3, 'strong'),
    'KTo': r('raise', 100, 3, 'strong'), 'QJo': r('raise', 100, 3, 'strong'),
    'JTo': r('raise', 100, 3, 'strong'),
    // Playable - mix of raise/fold
    'K8s': r('raise', 80, 3, 'playable'), 'K7s': r('raise', 70, 3, 'playable'),
    'Q9s': r('raise', 100, 3, 'playable'), 'J9s': r('raise', 100, 3, 'playable'),
    'T8s': r('raise', 100, 3, 'playable'), '97s': r('raise', 80, 3, 'playable'),
    'A7o': r('raise', 100, 3, 'playable'), 'K9o': r('raise', 100, 3, 'playable'),
    'QTo': r('raise', 100, 3, 'playable'), 'T9o': r('raise', 100, 3, 'playable'),
  },

  BB: {
    // BB defending range vs various positions - call focused
    // Against BTN steal
    'AA': r('raise', 100, 3, 'premium'), 'KK': r('raise', 100, 3, 'premium'),
    'QQ': r('raise', 100, 3, 'premium'), 'JJ': r('raise', 100, 3, 'premium'),
    'AKs': r('raise', 100, 3, 'premium'), 'AKo': r('raise', 100, 3, 'premium'),
    // Call/3-bet mix
    'TT': r('call', 100, undefined, 'strong'), '99': r('call', 100, undefined, 'strong'),
    '88': r('call', 100, undefined, 'strong'), '77': r('call', 100, undefined, 'strong'),
    '66': r('call', 100, undefined, 'strong'), '55': r('call', 100, undefined, 'strong'),
    '44': r('call', 100, undefined, 'strong'), '33': r('call', 100, undefined, 'strong'),
    '22': r('call', 100, undefined, 'strong'),
    'AQs': r('call', 100, undefined, 'strong'), 'AJs': r('call', 100, undefined, 'strong'),
    'ATs': r('call', 100, undefined, 'strong'), 'A9s': r('call', 100, undefined, 'strong'),
    'A8s': r('call', 100, undefined, 'strong'), 'A7s': r('call', 100, undefined, 'strong'),
    'A6s': r('call', 100, undefined, 'strong'), 'A5s': r('call', 100, undefined, 'strong'),
    'A4s': r('call', 100, undefined, 'strong'), 'A3s': r('call', 100, undefined, 'strong'),
    'A2s': r('call', 100, undefined, 'strong'),
    'KQs': r('call', 100, undefined, 'strong'), 'KJs': r('call', 100, undefined, 'strong'),
    'KTs': r('call', 100, undefined, 'strong'), 'K9s': r('call', 100, undefined, 'strong'),
    'K8s': r('call', 100, undefined, 'strong'), 'K7s': r('call', 100, undefined, 'strong'),
    'K6s': r('call', 100, undefined, 'strong'), 'K5s': r('call', 100, undefined, 'strong'),
    'QJs': r('call', 100, undefined, 'strong'), 'QTs': r('call', 100, undefined, 'strong'),
    'Q9s': r('call', 100, undefined, 'strong'), 'Q8s': r('call', 100, undefined, 'strong'),
    'JTs': r('call', 100, undefined, 'strong'), 'J9s': r('call', 100, undefined, 'strong'),
    'J8s': r('call', 100, undefined, 'strong'),
    'T9s': r('call', 100, undefined, 'strong'), 'T8s': r('call', 100, undefined, 'strong'),
    '98s': r('call', 100, undefined, 'strong'), '87s': r('call', 100, undefined, 'strong'),
    '76s': r('call', 100, undefined, 'strong'), '65s': r('call', 100, undefined, 'strong'),
    '54s': r('call', 100, undefined, 'strong'),
    'AQo': r('call', 100, undefined, 'strong'), 'AJo': r('call', 100, undefined, 'strong'),
    'ATo': r('call', 100, undefined, 'strong'), 'A9o': r('call', 100, undefined, 'strong'),
    'KQo': r('call', 100, undefined, 'strong'), 'KJo': r('call', 100, undefined, 'strong'),
    'KTo': r('call', 100, undefined, 'strong'), 'QJo': r('call', 100, undefined, 'strong'),
    'QTo': r('call', 100, undefined, 'strong'), 'JTo': r('call', 100, undefined, 'strong'),
    // Playable calls
    'A8o': r('call', 80, undefined, 'playable'), 'K9o': r('call', 80, undefined, 'playable'),
    'Q9o': r('call', 80, undefined, 'playable'), 'J9o': r('call', 80, undefined, 'playable'),
    'T9o': r('call', 100, undefined, 'playable'), '98o': r('call', 80, undefined, 'playable'),
  }
};

/**
 * Normalize a two-card hand to standard notation
 * Examples: (A♥, K♥) → "AKs", (A♥, K♣) → "AKo", (A♥, A♣) → "AA"
 */
export function normalizeHand(
  card1: { value: string; suit: string },
  card2: { value: string; suit: string }
): string {
  const rankOrder = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
  
  // Convert "10" to "T" for standard notation
  const rank1 = card1.value === '10' ? 'T' : card1.value;
  const rank2 = card2.value === '10' ? 'T' : card2.value;
  
  const idx1 = rankOrder.indexOf(rank1);
  const idx2 = rankOrder.indexOf(rank2);
  
  if (idx1 === -1 || idx2 === -1) {
    throw new Error(`Invalid card rank: ${card1.value} or ${card2.value}`);
  }
  
  // Pocket pair
  if (rank1 === rank2) {
    return rank1 + rank1;
  }
  
  // Order by rank (higher first)
  const [highRank, lowRank] = idx1 < idx2 ? [rank1, rank2] : [rank2, rank1];
  
  // Check if suited
  const suited = card1.suit === card2.suit;
  const suffix = suited ? 's' : 'o';
  
  return highRank + lowRank + suffix;
}

/**
 * Get GTO recommendation for a hand and position
 */
export function getGTORecommendation(
  card1: { value: string; suit: string },
  card2: { value: string; suit: string },
  position: Position
): HandRecommendation {
  const handNotation = normalizeHand(card1, card2);
  const recommendation = GTO_RANGES[position][handNotation];
  
  if (!recommendation) {
    // Default to fold if hand not in range
    return {
      action: 'fold',
      frequency: 100,
      category: 'fold'
    };
  }
  
  return recommendation;
}

/**
 * Get all hands for a specific action and position
 */
export function getHandsForAction(position: Position, action: Action, minFrequency: number = 50): string[] {
  const range = GTO_RANGES[position];
  return Object.entries(range)
    .filter(([, rec]) => rec.action === action && rec.frequency >= minFrequency)
    .map(([hand]) => hand);
}

/**
 * Calculate VPIP (Voluntarily Put money In Pot) for a position
 */
export function getVPIP(position: Position): number {
  const range = GTO_RANGES[position];
  const playableHands = Object.values(range).filter(rec => 
    (rec.action === 'raise' || rec.action === 'call') && rec.frequency >= 50
  );
  
  // There are 169 possible starting hands
  return Math.round((playableHands.length / 169) * 100);
}

/**
 * Calculate PFR (Pre-Flop Raise) for a position
 */
export function getPFR(position: Position): number {
  const range = GTO_RANGES[position];
  const raiseHands = Object.values(range).filter(rec => 
    rec.action === 'raise' && rec.frequency >= 50
  );
  
  return Math.round((raiseHands.length / 169) * 100);
}

/**
 * Get position stats
 */
export function getPositionStats(position: Position) {
  return {
    position,
    vpip: getVPIP(position),
    pfr: getPFR(position),
    totalHands: Object.keys(GTO_RANGES[position]).length,
    raiseHands: getHandsForAction(position, 'raise').length,
    callHands: getHandsForAction(position, 'call').length,
  };
}

/**
 * Get color for hand based on category
 */
export function getHandColor(category?: HandRecommendation['category']): string {
  const colors = {
    premium: '#8B4513',
    strong: '#D2691E',
    playable: '#CD853F',
    marginal: '#4A5568',
    fold: '#2D3748',
  };
  return colors[category || 'fold'];
}

/**
 * Check if a hand should be played at given frequency
 * Uses randomization to implement mixed strategies
 */
export function shouldPlayHand(recommendation: HandRecommendation): boolean {
  const randomValue = Math.random() * 100;
  return randomValue <= recommendation.frequency;
}

