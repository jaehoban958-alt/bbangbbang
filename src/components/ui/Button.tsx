import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const variantStyles: Record<string, React.CSSProperties> = {
  primary:   { background: 'var(--primary)', color: '#fff' },
  secondary: { background: 'var(--primary-light)', color: 'var(--primary)' },
  ghost:     { background: 'transparent', color: 'var(--text-2)', border: '1.5px solid var(--border)' },
  danger:    { background: '#FEE2E2', color: '#DC2626' },
};

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { fontSize: '12px', padding: '6px 12px', borderRadius: 'var(--r-md)', minHeight: '32px' },
  md: { fontSize: '14px', padding: '10px 20px', borderRadius: 'var(--r-lg)', minHeight: '44px' },
  lg: { fontSize: '16px', padding: '14px 28px', borderRadius: 'var(--r-xl)', minHeight: '52px' },
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontWeight: 600,
        fontFamily: 'var(--font)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : undefined,
        transition: 'opacity 0.15s, transform 0.1s',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
      }}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
