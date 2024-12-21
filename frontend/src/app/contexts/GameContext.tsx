'use client';
import React, { createContext, useContext, useState } from 'react';

// Types
type Suit = "hearts" | "diamonds" | "clubs" | "spades";
type Card = {
  suit: Suit;
  value: string;
};

interface GameContextType {
  deck: Card[];
  playerHand: Card[];
  flop: Card[];
  turn: Card[];
  river: Card[];
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
  const [deck, setDeck] = useState<Card[]>(createDeck());
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [flop, setFlop] = useState<Card[]>([]);
  const [turn, setTurn] = useState<Card[]>([]);
  const [river, setRiver] = useState<Card[]>([]);

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
