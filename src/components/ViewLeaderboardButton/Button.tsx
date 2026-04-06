// components/Button/Button.tsx
import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
};

const baseStyle =
  'text-[23px] border-2 cursor-pointer relative top-10 text-[#40FD51] pr-20 pl-20 mt-1';

export default function Button({
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={`${baseStyle} ${className}`}>
      {children}
    </button>
  );
}
