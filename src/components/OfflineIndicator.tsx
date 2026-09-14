import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-amber-500/20">
      <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
      Офлайн-режим (данные могут быть устаревшими)
    </div>
  );
};
