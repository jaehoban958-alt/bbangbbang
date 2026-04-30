
interface ChipProps {
  label: string;
  emoji?: string;
  active?: boolean;
  onClick?: () => void;
  color?: string;
}

export function Chip({ label, emoji, active = false, onClick, color = 'var(--primary)' }: ChipProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        borderRadius: 'var(--r-pill)',
        fontSize: '13px',
        fontWeight: 600,
        border: active ? `1.5px solid ${color}` : '1.5px solid var(--border)',
        background: active ? `${color}18` : 'var(--surface)',
        color: active ? color : 'var(--text-2)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s',
        minHeight: '32px',
      }}
    >
      {emoji && <span>{emoji}</span>}
      {label}
    </button>
  );
}
