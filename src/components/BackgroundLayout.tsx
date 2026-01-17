'use client';
import { useMemo } from 'react';

interface TetrisBlock {
  id: number;
  blocks: { x: number; y: number }[];
  top: number;
  left: number;
  rotation: number;
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
  // tetris block shapes
  const tetrisShapes = useMemo(
    () => [
      // L-shape
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // T-shape
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 1, y: 1 },
      ],
      // Z-shape
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 2, y: 1 },
      ],
      // Square
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      // I-shape
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 2, y: 0 },
        { x: 3, y: 0 },
      ],
      // J-shape
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 2 },
      ],
      // Small L
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 1 },
      ],
      // Single block
      [{ x: 0, y: 0 }],
      // Double horizontal
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      // Double vertical
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ],
    []
  );

  // random tetris block
  const tetrisBlocks = useMemo<TetrisBlock[]>(() => {
    const blocks: TetrisBlock[] = [];
    const numBlocks = 8; // Reduced number of tetris blocks

    // Helper function to check if new block is too close to existing blocks
    const isTooCloseToOtherBlocks = (
      top: number,
      left: number,
      existingBlocks: TetrisBlock[]
    ): boolean => {
      const minDistance = 15; // Minimum distance percentage between blocks
      return existingBlocks.some((block) => {
        const distance = Math.sqrt(
          Math.pow(top - block.top, 2) + Math.pow(left - block.left, 2)
        );
        return distance < minDistance;
      });
    };

    let attempts = 0;
    const maxAttempts = 200;

    while (blocks.length < numBlocks && attempts < maxAttempts) {
      const shape =
        tetrisShapes[Math.floor(Math.random() * tetrisShapes.length)];
      const top = Math.random() * 90;
      const left = Math.random() * 90;
      const rotation = Math.floor(Math.random() * 4) * 90;

      // Check if position is valid (not too close to other blocks)
      if (!isTooCloseToOtherBlocks(top, left, blocks)) {
        blocks.push({
          id: blocks.length,
          blocks: shape,
          top,
          left,
          rotation,
        });
      }

      attempts++;
    }

    return blocks;
  }, [tetrisShapes]);

  // random white boxes
  const whiteBoxes = useMemo<WhiteBox[]>(() => {
    const boxes: WhiteBox[] = [];
    const numBoxes = 10;
    const boxSize = 3;

    const isTooCloseToTetris = (top: number, left: number): boolean => {
      const minDistance = 12;
      return tetrisBlocks.some((block) => {
        const distance = Math.sqrt(
          Math.pow(top - block.top, 2) + Math.pow(left - block.left, 2)
        );
        return distance < minDistance;
      });
    };

    const isTooCloseToOthers = (
      top: number,
      left: number,
      existingBoxes: WhiteBox[]
    ): boolean => {
      const minDistance = 8;
      return existingBoxes.some((box) => {
        const distance = Math.sqrt(
          Math.pow(top - box.top, 2) + Math.pow(left - box.left, 2)
        );
        return distance < minDistance;
      });
    };

    let attempts = 0;
    const maxAttempts = 200;

    while (boxes.length < numBoxes && attempts < maxAttempts) {
      const top = Math.random() * 95;
      const left = Math.random() * 95;

      if (
        !isTooCloseToTetris(top, left) &&
        !isTooCloseToOthers(top, left, boxes)
      ) {
        boxes.push({
          id: boxes.length,
          top,
          left,
          width: boxSize,
          height: boxSize,
          opacity: 0.6,
        });
      }

      attempts++;
    }

    return boxes;
  }, [tetrisBlocks]);

  return (
    <div className="page-background">
      <div className="page-background-gradient" />

      <div className="top-glow" />

      {tetrisBlocks.map((block) => (
        <div
          key={`tetris-${block.id}`}
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
                key={`block-${block.id}-${idx}`}
                className="tetris-block"
                style={{
                  top: `${pos.y * 14}px`,
                  left: `${pos.x * 14}px`,
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {whiteBoxes.map((box) => (
        <div
          key={`box-${box.id}`}
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
