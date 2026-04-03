'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { CHALLENGE_CARD_XP } from '@/lib/challengeCardMeta';
import { BadgePlus } from 'lucide-react';

type CardVariant = 'default' | 'bordered' | 'shadow';
type CardRounded = 'none' | 'sm' | 'md' | 'lg' | 'full';
type CardSize = 'sm' | 'md' | 'lg';

interface CardContextValue {
  variant: CardVariant;
  size: CardSize;
}

// ========== Context ==========
const CardContext = createContext<CardContextValue | null>(null);

const useCardContext = () => {
  const context = useContext(CardContext);
  if (!context) {
    throw new Error('Card subcomponents must be used within <Card>');
  }
  return context;
};

// ========== Parent Component ==========
interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  size?: CardSize;
  rounded?: CardRounded;
  className?: string;
}

export function Card({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'none',
  className,
}: CardProps) {
  const variantStyles = {
    default:
      'border border-[#40FD51]/15 bg-[#0C0E19]/80 p-7 transition-all duration-300 hover:border-[#40FD51]/30 hover:shadow-[0_0_20px_rgba(64,253,81,0.1)]',
    bordered: 'bg-white border-2 border-blue-500',
    shadow: 'bg-white shadow-lg',
  };

  const sizeStyles = {
    sm: 'p-3 rounded-md',
    md: 'p-5 rounded-lg',
    lg: 'p-7 rounded-xl',
  };

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <CardContext.Provider value={{ variant, size }}>
      <div
        className={cn(
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          className
        )}
      >
        {children}
      </div>
    </CardContext.Provider>
  );
}

// ========== Child Components ==========
interface CardHeaderProps {
  children?: ReactNode;
  className?: string;
  // child-specific props
  xp?: 'EASY' | 'MEDIUM' | 'HARD' | 'EXTREME';
}

const xpBadgeStyles =
  'inline-block bg-green-500/10 text-green-600 text-xs px-2 py-1 rounded-full border border-green-500/20';

export function CardHeader({ children, className, xp }: CardHeaderProps) {
  const { variant, size } = useCardContext();

  const xpValue = xp ? CHALLENGE_CARD_XP[xp] : null;
  const xpStyles = {
    // add styles when you want to change the pill colours
    EASY: '',
    MEDIUM: '', //'bg-yellow-500/30 text-yellow-500 border-yellow-500/30',
    HARD: '', //'bg-red-500/30 text-red-500 border-red-500/30',
    EXTREME: '', //'bg-purple-500/30 text-purple-500 border-purple-500/30',
  };
  const xpType = xp ?? 'EASY';

  return (
    <div className={cn(className)}>
      {xpValue && (
        <div className="flex items-center justify-between gap-4 w-full">
          <p
            className={cn(
              'py-1 px-6 border border-green-500/30 rounded-full bg-green-500/10 text-green-500 font-bold text-sm',
              xpStyles[xpType]
            )}
          >
            {xpType?.toUpperCase()}
          </p>
          <div
            className={`${xpBadgeStyles} text-md font-bold flex items-center justify-center`}
          >
            <BadgePlus className="inline-block w-3 h-3 mr-1 text-center justify-center align-middle" />
            +{xpValue} XP
          </div>
        </div>
      )}
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
  // child-specific props

  padded?: boolean;
}

export function CardContent({
  children,
  className,
  padded = true,
}: CardContentProps) {
  const { size } = useCardContext();

  const paddingMap = {
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div className={cn(padded && paddingMap[size], className)}>{children}</div>
  );
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
  challengeLink?: string;
  align?: 'left' | 'center' | 'right';
}

export function CardFooter({
  children,
  className,
  align = 'left',
}: CardFooterProps) {
  const { variant } = useCardContext();

  return (
    <div
      className={cn(
        'mt-2 pt-3',
        variant === 'bordered' ? 'border-t-2 border-blue-100' : '',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className
      )}
    >
      {children}
    </div>
  );
}
