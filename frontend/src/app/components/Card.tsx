"use client";

type CardProps = {
  suit: "hearts" | "diamonds" | "clubs" | "spades";
  value: string;
};

export default function Card({ suit, value }: CardProps) {
  const suitSymbols: Record<CardProps["suit"], string> = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  const suitColors: Record<CardProps["suit"], string> = {
    hearts: "text-red-500",
    diamonds: "text-red-500",
    clubs: "text-black",
    spades: "text-black",
  };

  return (
    <div className="w-16 h-24 bg-white rounded-lg shadow-md flex flex-col items-center justify-center border border-gray-300">
      <div className={`text-xl ${suitColors[suit]}`}>{value}</div>
      <div className={`text-2xl ${suitColors[suit]}`}>{suitSymbols[suit]}</div>
    </div>
  );
}

