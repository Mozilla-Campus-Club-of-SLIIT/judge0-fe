'use client';
import { useMemo } from 'react';

interface TetrisBlock {
  id: number;
  blocks: { x: number; y: number }[];
  top: number;
  left: number;
  rotation: number;
  opacity: number;
  color: string;
}

interface WhiteBox {
  id: number;
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
}

export default function BackgroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const anchorPositions = [
    { top: 8, left: 6 },
    { top: 28, left: 22 },
    { top: 22, left: 78 },
    { top: 58, left: 14 },
    { top: 62, left: 84 },
  ];

  /* shapes */
  const tetrominoShapes = [
    // I
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 3, y: 0 },
    ],
    // L
    [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    // Square
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    // T
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 1, y: 1 },
    ],
    // Z
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
    ],
  ];

  const colors = ['#1ee449', '#4ADE80', '#02730c', '#7ab181'];

  const tetrisBlocks: TetrisBlock[] = useMemo(() => {
    return anchorPositions.map((pos, index) => {
      const randomShape =
        tetrominoShapes[Math.floor(Math.random() * tetrominoShapes.length)];

      const rotations = [0, 45, 90, -45];
      const randomRotation =
        rotations[Math.floor(Math.random() * rotations.length)];

      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return {
        id: index,
        blocks: randomShape,
        top: pos.top,
        left: pos.left,
        rotation: randomRotation,
        opacity: 0.35,
        color: randomColor,
      };
    });
  }, []);

  const whiteBoxes: WhiteBox[] = [
    { id: 1, top: 18, left: 25, width: 3, height: 3, opacity: 0.2 },
    { id: 2, top: 35, left: 90, width: 3, height: 3, opacity: 0.2 },
    { id: 3, top: 75, left: 60, width: 3, height: 3, opacity: 0.2 },
  ];

  return (
    <div className="page-background">
      <div className="page-background-gradient" />

      {tetrisBlocks.map((block) => (
        <div
          key={block.id}
          className="absolute"
          style={{
            top: `${block.top}%`,
            left: `${block.left}%`,
            transform: `rotate(${block.rotation}deg)`,
          }}
        >
          <div className="relative">
            {block.blocks.map((pos, idx) => (
              <div
                key={idx}
                className="tetris-block"
                style={{
                  top: `${pos.y * 14}px`,
                  left: `${pos.x * 14}px`,
                  opacity: block.opacity,
                  backgroundColor: block.color,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {whiteBoxes.map((box) => (
        <div
          key={box.id}
          className="white-box"
          style={{
            top: `${box.top}%`,
            left: `${box.left}%`,
            width: `${box.width}px`,
            height: `${box.height}px`,
            opacity: box.opacity,
          }}
        />
      ))}

      <div className="relative z-10">{children}</div>
    </div>
  );
}
