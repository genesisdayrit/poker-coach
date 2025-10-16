declare module 'poker-odds-calc' {
  export interface PlayerResult {
    wins: number;
    ties: number;
    ranks: Record<string, number>;
    player: any;
  }

  export interface CalculationResult {
    players: PlayerResult[];
    iterations: number;
    approximate: boolean;
    time: number;
    board: any;
  }

  export interface GameResult {
    result: CalculationResult;
  }

  export class TexasHoldem {
    constructor();
    addPlayer(cards: string[]): this;
    setBoard(cards: string[]): this;
    calculate(): GameResult;
  }

  export class SixPlusHoldem {
    constructor();
    addPlayer(cards: string[]): this;
    setBoard(cards: string[]): this;
    calculate(): GameResult;
  }

  export class Omaha {
    constructor();
    addPlayer(cards: string[]): this;
    setBoard(cards: string[]): this;
    calculate(): GameResult;
  }
}

