import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Card({ children, className = '', style, onClick }: CardProps) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--surface)',
        borderRadius: 'var(--r-xl)',
        boxShadow: 'var(--shadow-sm)',
        padding: 'var(--sp-4)',
        transition: 'box-shadow 0.2s',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
