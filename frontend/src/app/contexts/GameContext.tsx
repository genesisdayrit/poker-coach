'use client';
import React, { createContext, useContext, useState } from 'react';

// Types
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Card = {
  suit: Suit;
  value: string;
};

type GameState = 'NO_CARDS' | 'PRE_FLOP' | 'FLOP' | 'TURN' | 'RIVER';

// Helper function to format cards for display
const formatCard = (card: Card): string => `${card.value}${card.suit.charAt(0).toUpperCase()}`;

// Helper function to format hand for display
const formatHand = (cards: Card[]): string => cards.map(formatCard).join(' ');

interface GameContextType {
  deck: Card[];
  playerHand: Card[];
  flop: Card[];
  turn: Card[];
  river: Card[];
  currentGameState: GameState;
  getGameStateDescription: () => string;
  handleDrawHand: () => void;
  handleDrawFlop: () => void;
  handleDrawTurn: () => void;
  handleDrawRiver: () => void;
  handleResetGame: () => void;
}

// Create deck utility function
const createDeck = (): Card[] => {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const values = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck: Card[] = [];

  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value });
    }
  }

  return shuffleDeck(deck);
};

// Shuffle deck utility function
const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

// Draw cards utility function
const drawCards = (deck: Card[], count: number): { drawnCards: Card[], newDeck: Card[] } => {
  const drawnCards = deck.slice(0, count);
  const newDeck = deck.slice(count);
  return { drawnCards, newDeck };
};

const defaultState: GameContextType = {
  deck: [],
  playerHand: [],
  flop: [],
  turn: [],
  river: [],
  currentGameState: 'NO_CARDS',
  getGameStateDescription: () => '',
  handleDrawHand: () => {},
  handleDrawFlop: () => {},
  handleDrawTurn: () => {},
  handleDrawRiver: () => {},
  handleResetGame: () => {}
};

const GameContext = createContext<GameContextType>(defaultState);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  // Helper function to determine game state
  const determineGameState = (
    playerHand: Card[],
    flop: Card[],
    turn: Card[],
    river: Card[]
  ): GameState => {
    if (playerHand.length === 0) return 'NO_CARDS';
    if (flop.length === 0) return 'PRE_FLOP';
    if (turn.length === 0) return 'FLOP';
    if (river.length === 0) return 'TURN';
    return 'RIVER';
  };
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [flop, setFlop] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Card[]>([]);
  const [river, setRiver] = useState<Card[]>([]);

  // Function to get detailed game state description
  const getGameStateDescription = (): string => {
    const state = determineGameState(playerHand, flop, turn, river);
    let description = `Game State: ${state}\n`;
    
    if (playerHand.length > 0) {
      description += `Player's Hand: ${formatHand(playerHand)}\n`;
    }
    
    if (flop.length > 0) {
      description += `Flop: ${formatHand(flop)}\n`;
    }
    
    if (turn.length > 0) {
      description += `Turn: ${formatHand(turn)}\n`;
    }
    
    if (river.length > 0) {
      description += `River: ${formatHand(river)}`;
    }
    
    return description;
  };

  const handleDrawHand = () => {
    const { drawnCards, newDeck } = drawCards(deck, 2);
    setDeck(newDeck);
    setPlayerHand(drawnCards);
    setFlop([]);
    setTurn([]);
    setRiver([]);
  };

  const handleDrawFlop = () => {
    const { drawnCards, newDeck } = drawCards(deck, 3);
    setDeck(newDeck);
    setFlop(drawnCards);
  };

  const handleDrawTurn = () => {
    const { drawnCards, newDeck } = drawCards(deck, 1);
    setDeck(newDeck);
    setTurn(drawnCards);
  };

  const handleDrawRiver = () => {
    const { drawnCards, newDeck } = drawCards(deck, 1);
    setDeck(newDeck);
    setRiver(drawnCards);
  };

  const handleResetGame = () => {
    setDeck(createDeck());
    setPlayerHand([]);
    setFlop([]);
    setTurn([]);
    setRiver([]);
  };

  return (
    <GameContext.Provider 
      value={{ 
        deck, 
        playerHand, 
        flop, 
        turn, 
        river,
        currentGameState: determineGameState(playerHand, flop, turn, river),
        getGameStateDescription, 
        handleDrawHand, 
        handleDrawFlop, 
        handleDrawTurn, 
        handleDrawRiver, 
        handleResetGame 
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export default GameContext;
