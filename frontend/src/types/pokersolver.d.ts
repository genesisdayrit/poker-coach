declare module 'pokersolver' {
  export interface SolvedHand {
    name: string;
    descr: string;
    rank: number;
    cards: any[];
    isPossible: boolean;
  }

  export class Hand {
    static solve(cards: string[], game?: string): SolvedHand;
  }
}

