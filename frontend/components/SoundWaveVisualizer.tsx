'use client';

import React from 'react';

interface SoundWaveVisualizerProps {
  isPlaying?: boolean;
  className?: string;
}

export const SoundWaveVisualizer: React.FC<SoundWaveVisualizerProps> = ({
  isPlaying = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-0.5 h-3.5 px-1 ${className}`} aria-hidden="true">
      <span
        className={`w-0.5 bg-current rounded-full transition-all duration-300 ${
          isPlaying ? 'h-3 animate-pulse' : 'h-1'
        }`}
        style={{ animationDelay: '0ms' }}
      />
      <span
        className={`w-0.5 bg-current rounded-full transition-all duration-300 ${
          isPlaying ? 'h-3.5 animate-pulse' : 'h-1.5'
        }`}
        style={{ animationDelay: '150ms' }}
      />
      <span
        className={`w-0.5 bg-current rounded-full transition-all duration-300 ${
          isPlaying ? 'h-2 animate-pulse' : 'h-1'
        }`}
        style={{ animationDelay: '300ms' }}
      />
      <span
        className={`w-0.5 bg-current rounded-full transition-all duration-300 ${
          isPlaying ? 'h-3 animate-pulse' : 'h-1.5'
        }`}
        style={{ animationDelay: '450ms' }}
      />
    </div>
  );
};
