'use client';

import React, { useEffect, useState } from 'react';

const BLOCK_COLORS = ['#9BE9A8', '#5BEF74', '#2FEA52'];
const ANGLES = [0, 90, 180, 270];
const TETRIS_LINE_LEFT_COLOR = '#35d845';
const TETRIS_LINE_RIGHT_COLOR = '#2fc13e';
const NON_LINE_SHAPES = [0, 1, 2, 3, 5, 6];
const MIN_BLOCK_DISTANCE = 8;
const L_SHAPE_INDICES = [2, 3, 6];
const SLIGHT_TILT_ANGLES = [-35, -25, 25, 35];

type BlockPosition = { top: number; left: number; radius: number };
type Block = {
  id: number;
  top: string;
  left: string;
  opacity: number;
  rotation: number;
  shapeIndex: number;
  colorIndex: number;
};
type Dot = {
  id: number;
  top: string;
  left: string;
  opacity: number;
  size: number;
};
type LineBlock = {
  id: string;
  top: string;
  left: string;
  rotation: number;
  color: string;
  opacity: number;
};

const getShapeRadius = (shapeIndex: number) => {
  if (shapeIndex === 1) return 2.2;
  if (shapeIndex === 4) return 5.8;
  return 4.8;
};

const isFarEnough = (
  candidate: { top: number; left: number },
  radius: number,
  existing: BlockPosition[]
) =>
  existing.every((pos) => {
    const dx = candidate.left - pos.left;
    const dy = candidate.top - pos.top;
    return Math.hypot(dx, dy) >= radius + pos.radius + MIN_BLOCK_DISTANCE;
  });

const ShapeRenderer = ({
  index,
  colorIndex,
}: {
  index: number;
  colorIndex: number;
}) => {
  const style = { backgroundColor: BLOCK_COLORS[colorIndex] };
  const gap = 'gap-[1.5px]';
  const size = 'w-3 h-3';

  const shapes = [
    <div className={`flex flex-col ${gap}`} key="z">
      <div className={`flex ${gap}`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
      <div className={`flex ${gap} ml-[13.5px]`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
    </div>,

    <div className={size} style={style} key="dot"></div>,
    <div className={`flex flex-col ${gap}`} key="l">
      <div className={size} style={style}></div>
      <div className={`flex ${gap}`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
    </div>,

    <div className={`flex flex-col ${gap}`} key="j">
      <div className={`flex ${gap}`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
      <div className={size} style={style}></div>
    </div>,

    <div className={`flex ${gap}`} key="line">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={size} style={style}></div>
      ))}
    </div>,

    <div className={`flex flex-col items-center ${gap}`} key="t">
      <div className={size} style={style}></div>
      <div className={`flex ${gap}`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
    </div>,

    <div className={`flex ${gap}`} key="long-l">
      <div className={`flex flex-col ${gap}`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
      <div className={`flex ${gap} mt-[13.5px] -ml-[13.5px]`}>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
        <div className={size} style={style}></div>
      </div>
    </div>,
  ];
  return shapes[index] || shapes[0];
};

export default function BackgroundLayout() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [dots, setDots] = useState<Dot[]>([]);
  const [lineBlocks, setLineBlocks] = useState<LineBlock[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const zones = [
      { r: [6, 20], c: [4, 16] },
      { r: [8, 22], c: [78, 94] },
      { r: [7, 20], c: [40, 62] },
      { r: [38, 62], c: [8, 22] },
    ];

    const usedPositions: BlockPosition[] = [];
    const generatedBlocks = zones.map((zone, i) => {
      const shapeIndex =
        NON_LINE_SHAPES[Math.floor(Math.random() * NON_LINE_SHAPES.length)];
      const radius = getShapeRadius(shapeIndex);
      let top = zone.r[0] + Math.random() * (zone.r[1] - zone.r[0]);
      let left = zone.c[0] + Math.random() * (zone.c[1] - zone.c[0]);

      for (let tries = 0; tries < 20; tries++) {
        const candidate = { top, left };
        if (isFarEnough(candidate, radius, usedPositions)) break;
        top = zone.r[0] + Math.random() * (zone.r[1] - zone.r[0]);
        left = zone.c[0] + Math.random() * (zone.c[1] - zone.c[0]);
      }

      const usesSlightTilt =
        L_SHAPE_INDICES.includes(shapeIndex) && Math.random() < 0.45;
      const rotation = usesSlightTilt
        ? SLIGHT_TILT_ANGLES[
            Math.floor(Math.random() * SLIGHT_TILT_ANGLES.length)
          ]
        : ANGLES[Math.floor(Math.random() * ANGLES.length)];

      usedPositions.push({ top, left, radius });
      return {
        id: i,
        top: `${top}%`,
        left: `${left}%`,
        opacity: Math.random() * 0.3 + 0.15,
        rotation,
        shapeIndex,
        colorIndex: Math.floor(Math.random() * BLOCK_COLORS.length),
      };
    });
    setBlocks(generatedBlocks);

    setDots(
      Array.from({ length: 25 }).map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.4,
        size: Math.random() * 1.2 + 0.5,
      }))
    );

    const lineCandidates = [
      {
        id: 'line-left',
        row: [70, 88],
        col: [6, 22],
        color: TETRIS_LINE_LEFT_COLOR,
      },
      {
        id: 'line-right',
        row: [72, 88],
        col: [74, 96],
        color: TETRIS_LINE_RIGHT_COLOR,
      },
    ] as const;

    const generatedLineBlocks = lineCandidates.map((line) => {
      const radius = 5.8;
      let top = line.row[0] + Math.random() * (line.row[1] - line.row[0]);
      let left = line.col[0] + Math.random() * (line.col[1] - line.col[0]);

      for (let tries = 0; tries < 20; tries++) {
        const candidate = { top, left };
        if (isFarEnough(candidate, radius, usedPositions)) break;
        top = line.row[0] + Math.random() * (line.row[1] - line.row[0]);
        left = line.col[0] + Math.random() * (line.col[1] - line.col[0]);
      }

      usedPositions.push({ top, left, radius });
      return {
        id: line.id,
        top: `${top}%`,
        left: `${left}%`,
        rotation: ANGLES[Math.floor(Math.random() * ANGLES.length)],
        color: line.color,
        opacity: Math.random() * 0.25 + 0.65,
      };
    });

    setLineBlocks(generatedLineBlocks);
    setMounted(true);
  }, []);

  if (!mounted) return <div className="fixed inset-0 bg-[#070916]" />;

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#070916]">
      <div
        className="absolute -top-[24%] left-1/2 -translate-x-1/2 w-[78%] h-[40%] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(74, 222, 128, 0.2) 0%, rgba(74, 222, 128, 0.12) 35%, rgba(74, 222, 128, 0) 72%)',
          filter: 'blur(95px)',
        }}
      />
      {dots.map((dot) => (
        <div
          key={`dot-${dot.id}`}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{
            top: dot.top,
            left: dot.left,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            opacity: dot.opacity,
          }}
        />
      ))}

      {lineBlocks.map((lineBlock) => (
        <div
          key={lineBlock.id}
          className="absolute pointer-events-none flex gap-[1.5px]"
          style={{
            top: lineBlock.top,
            left: lineBlock.left,
            opacity: lineBlock.opacity,
            transform: `rotate(${lineBlock.rotation}deg)`,
          }}
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`${lineBlock.id}-${i}`}
              className="w-3 h-3"
              style={{ backgroundColor: lineBlock.color }}
            ></div>
          ))}
        </div>
      ))}

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
          <ShapeRenderer
            index={block.shapeIndex}
            colorIndex={block.colorIndex}
          />
        </div>
      ))}
    </div>
  );
}
