'use client';

import React, { useEffect, useState } from 'react';

const SHAPES = [
  // Z-shape
  <div className="flex flex-col gap-0.5" key="z-shape">
    <div className="flex gap-0.5">
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    </div>
    <div className="flex gap-0.5 ml-3">
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    </div>
  </div>,
  // Dot
  <div className="flex flex-col gap-0.5" key="dot-shape">
    <div className="flex gap-0.5">
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    </div>
  </div>,
  // J-shape
  <div className="flex flex-col gap-0.5" key="j-shape">
    <div className="flex gap-0.5">
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    </div>
    <div className="flex gap-0.5">
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
      <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    </div>
  </div>,
  // Line
  <div className="flex gap-0.5" key="line-shape">
    <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
    <div className="w-3 h-3 bg-[var(--primary,#40FD51)]"></div>
  </div>,
];

interface Position {
  id: number;
  top: string;
  left: string;
  opacity: number;
  rotation?: number;
  elementIndex?: number;
  size?: number;
}

export default function AnimatedBackground() {
  const [blocks, setBlocks] = useState<Position[]>([]);
  const [dots, setDots] = useState<Position[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const newBlocks = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 85 + 5}%`,
      left: `${Math.random() * 85 + 5}%`,
      opacity: Math.random() * 0.3 + 0.1,
      rotation: [0, 90, 180, 270][Math.floor(Math.random() * 4)],
      elementIndex: Math.floor(Math.random() * SHAPES.length),
    }));

    const newDots = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.5 + 0.1,
      size: Math.random() * 2 + 1,
    }));

    setBlocks(newBlocks);
    setDots(newDots);
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--darkest-green,#070916)]"></div>
    );
  }

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[var(--darkest-green,#070916)]">
      {/* White dots */}
      {dots.map((dot) => (
        <div
          key={`dot-${dot.id}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            opacity: dot.opacity,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
          }}
        />
      ))}

      {/* Tetris Blocks */}
      {blocks.map((block) => (
        <div
          key={`block-${block.id}`}
          className="absolute pointer-events-none"
          style={{
            top: block.top,
            left: block.left,
            opacity: block.opacity,
            transform: `rotate(${block.rotation}deg)`,
          }}
        >
          {SHAPES[block.elementIndex!]}
        </div>
      ))}
    </div>
  );
}
