interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  label?: string;
  showPercent?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  color = 'var(--primary)',
  height = 8,
  label,
  showPercent = false,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      {(label || showPercent) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          {label && <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>{label}</span>}
          {showPercent && <span style={{ fontSize: '12px', fontWeight: 700, color }}>{pct}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height,
          background: 'var(--surface-2)',
          borderRadius: 'var(--r-pill)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: 'var(--r-pill)',
            transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />
      </div>
    </div>
  );
}
