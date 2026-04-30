
interface BadgeProps {
  emoji: string;
  label: string;
  rarity: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Badge({ emoji, label, rarity, count, size = 'md' }: BadgeProps) {
  const dim = size === 'sm' ? 48 : size === 'lg' ? 80 : 64;
  const emojiSize = size === 'sm' ? '20px' : size === 'lg' ? '32px' : '26px';
  const labelSize = size === 'sm' ? '9px' : size === 'lg' ? '13px' : '11px';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        position: 'relative',
      }}
    >
      <div
        className={`badge-${rarity}`}
        style={{
          width: dim,
          height: dim,
          borderRadius: 'var(--r-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: emojiSize,
        }}
      >
        {emoji}
      </div>
      <span style={{ fontSize: labelSize, fontWeight: 600, color: 'var(--text-2)', textAlign: 'center' }}>
        {label}
      </span>
      {count !== undefined && count > 1 && (
        <span
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            background: 'var(--primary)',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 700,
            borderRadius: 'var(--r-pill)',
            padding: '1px 5px',
            lineHeight: 1.4,
          }}
        >
          ×{count}
        </span>
      )}
    </div>
  );
}
