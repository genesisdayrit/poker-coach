'use client';
import { GameProvider } from '@/app/contexts/GameContext';
import GameTable from '@/app/components/GameTable';

export default function GamePage() {
  return (
    <GameProvider>
      <GameTable />
    </GameProvider>
  );
}
