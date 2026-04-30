import { useState } from 'react';
import { PiWifiHighBold, PiCopySimpleBold, PiSignOutBold, PiPlusBold, PiArrowRightBold } from 'react-icons/pi';
import { Button } from './ui/Button';
import type { SyncStatus } from '../types';

interface SyncPanelProps {
  spaceCode: string | null;
  syncStatus: SyncStatus;
  onCreateCode: () => void;
  onJoinCode: (code: string) => void;
  onLeave: () => void;
}

const STATUS_COLORS: Record<SyncStatus, string> = {
  local:          'var(--text-3)',
  connecting:     'var(--accent)',
  synced:         'var(--accent-green)',
  saving:         'var(--accent-blue)',
  error:          'var(--primary)',
  'config-missing': 'var(--text-3)',
};

const STATUS_LABELS: Record<SyncStatus, string> = {
  local:          '로컬 모드',
  connecting:     '연결 중...',
  synced:         '동기화됨',
  saving:         '저장 중...',
  error:          '오류',
  'config-missing': 'Firebase 미설정',
};

export function SyncPanel({ spaceCode, syncStatus, onCreateCode, onJoinCode, onLeave }: SyncPanelProps) {
  const [joinInput, setJoinInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'idle' | 'join'>('idle');

  const handleCopy = () => {
    if (!spaceCode) return;
    navigator.clipboard.writeText(spaceCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleJoin = () => {
    const code = joinInput.trim().toUpperCase();
    if (code.length === 6) {
      onJoinCode(code);
      setMode('idle');
      setJoinInput('');
    }
  };

  const statusColor = STATUS_COLORS[syncStatus];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
      {/* Status row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <PiWifiHighBold style={{ color: statusColor, fontSize: 18 }} />
        <span style={{ fontSize: '13px', fontWeight: 600, color: statusColor }}>
          {STATUS_LABELS[syncStatus]}
        </span>
        {spaceCode && (
          <span style={{ fontSize: '12px', color: 'var(--text-3)', marginLeft: 'auto' }}>
            코드: <strong style={{ color: 'var(--text-1)', letterSpacing: '0.1em' }}>{spaceCode}</strong>
          </span>
        )}
      </div>

      {spaceCode ? (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" size="sm" onClick={handleCopy} style={{ flex: 1 }}>
            <PiCopySimpleBold />
            {copied ? '복사됨!' : '코드 복사'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onLeave}>
            <PiSignOutBold />
            나가기
          </Button>
        </div>
      ) : (
        <>
          {mode === 'idle' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="primary" size="sm" onClick={onCreateCode} style={{ flex: 1 }}>
                <PiPlusBold />
                새 코드 만들기
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setMode('join')} style={{ flex: 1 }}>
                <PiArrowRightBold />
                코드 참여
              </Button>
            </div>
          )}
          {mode === 'join' && (
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                value={joinInput}
                onChange={e => setJoinInput(e.target.value.toUpperCase().slice(0, 6))}
                placeholder="6자리 코드 입력"
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: 'var(--r-md)',
                  border: '1.5px solid var(--border)',
                  fontSize: '15px',
                  fontFamily: 'var(--font)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  outline: 'none',
                  minHeight: 44,
                }}
                onKeyDown={e => e.key === 'Enter' && handleJoin()}
                autoFocus
              />
              <Button variant="primary" size="sm" onClick={handleJoin} disabled={joinInput.length !== 6}>
                참여
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setMode('idle'); setJoinInput(''); }}>
                취소
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
