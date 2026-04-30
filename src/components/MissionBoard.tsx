import { useState, useEffect } from 'react';
import { MISSION_TASKS, POINTS_PER_BADGE } from '../lib/appData';
import { rollBadge, getLevel } from '../lib/appUtils';
import { ProgressBar } from './ui/ProgressBar';
import { Badge } from './ui/Badge';
import type { MissionState, RoleId } from '../types';

interface MissionBoardProps {
  state: MissionState;
  roleId: RoleId;
  selectedDate: string;
  onStateChange: (next: MissionState) => void;
}

export function MissionBoard({ state, roleId, selectedDate, onStateChange }: MissionBoardProps) {
  const [spinning, setSpinning] = useState(false);
  const [newBadge, setNewBadge] = useState<{ emoji: string; label: string; rarity: string } | null>(null);

  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const alreadySubmitted = state.submitHistory.includes(selectedDate);

  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => { setChecked(new Set()); }, [selectedDate]);

  const todayTotal = [...checked].reduce((s, id) => {
    const task = MISSION_TASKS.find(t => t.id === id);
    return s + (task?.points ?? 0);
  }, 0);

  const toggle = (id: string) => {
    if (alreadySubmitted || !isToday) return;
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (alreadySubmitted || !isToday || checked.size === 0) return;
    const newTotal = state.grandTotal + todayTotal;
    const prevBadges = Math.floor(state.grandTotal / POINTS_PER_BADGE);
    const newBadges  = Math.floor(newTotal / POINTS_PER_BADGE);
    const earnedCount = newBadges - prevBadges;

    let earnedBadges = [...state.earnedBadges];

    if (earnedCount > 0) {
      for (let i = 0; i < earnedCount; i++) {
        const badge = rollBadge();
        const existing = earnedBadges.find(b => b.id === badge.id && b.rarity === badge.rarity);
        if (existing) {
          earnedBadges = earnedBadges.map(b =>
            b.id === badge.id && b.rarity === badge.rarity ? { ...b, count: b.count + 1 } : b
          );
          setNewBadge(badge);
        } else {
          earnedBadges.push(badge);
          setNewBadge(badge);
        }
      }
      setSpinning(true);
      setTimeout(() => { setSpinning(false); }, 2500);
    }

    const month = selectedDate.slice(0, 7);
    const seasonHistory = [...state.seasonHistory];
    const monthIdx = seasonHistory.findIndex(s => s.month === month);
    if (monthIdx >= 0) {
      seasonHistory[monthIdx] = { month, score: seasonHistory[monthIdx].score + todayTotal };
    } else {
      seasonHistory.push({ month, score: todayTotal });
    }

    onStateChange({
      ...state,
      grandTotal:     newTotal,
      todayScore:     todayTotal,
      lastSubmitDate: selectedDate,
      earnedBadges,
      submitHistory:  [...state.submitHistory, selectedDate],
      seasonHistory:  seasonHistory.sort((a, b) => b.month.localeCompare(a.month)),
    });

    setChecked(new Set());
  };

  const level = getLevel(state.grandTotal);
  const progressToNextBadge = state.grandTotal % POINTS_PER_BADGE;
  const roleColor = roleId === 'male' ? 'var(--accent-blue)' : 'var(--primary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
      {/* Slot machine animation */}
      {spinning && newBadge && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          onClick={() => setSpinning(false)}
        >
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: 'var(--r-2xl)',
              padding: 'var(--sp-10)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-4)',
              animation: 'badge-pop 0.5s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              배지 획득!
            </div>
            <div style={{ fontSize: 72, animation: 'spin-once 0.6s ease-out' }}>{newBadge.emoji}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{newBadge.label}</div>
            <div className={`badge-${newBadge.rarity}`} style={{ padding: '4px 12px', borderRadius: 'var(--r-pill)', fontSize: 13, fontWeight: 700 }}>
              {newBadge.rarity.toUpperCase()}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>탭하면 닫힙니다</div>
          </div>
        </div>
      )}

      {/* Level & progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Lv.{level.level} {level.label}</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>총 {state.grandTotal}점</span>
        </div>
        <ProgressBar value={progressToNextBadge} max={POINTS_PER_BADGE} color={roleColor} height={10} showPercent label={`다음 배지까지 ${POINTS_PER_BADGE - progressToNextBadge}점`} />
      </div>

      {/* Mission checklist */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>
          {selectedDate} {alreadySubmitted ? '✓ 제출 완료' : isToday ? '오늘의 미션' : '(선택한 날짜)'}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MISSION_TASKS.map(task => {
            const done = checked.has(task.id);
            const disabled = alreadySubmitted || !isToday;
            return (
              <button
                key={task.id}
                onClick={() => toggle(task.id)}
                disabled={disabled}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--r-lg)',
                  border: done ? `1.5px solid ${roleColor}` : '1.5px solid var(--border)',
                  background: done ? `${roleColor}12` : 'var(--surface)',
                  cursor: disabled ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  minHeight: 52,
                  textAlign: 'left',
                }}
              >
                <span style={{ fontSize: 22 }}>{task.emoji}</span>
                <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: done ? roleColor : 'var(--text-1)' }}>
                  {task.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: done ? roleColor : 'var(--text-3)' }}>
                  +{task.points}점
                </span>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  border: done ? `2px solid ${roleColor}` : '2px solid var(--border)',
                  background: done ? roleColor : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {done && <span style={{ fontSize: 13, color: '#fff', lineHeight: 1 }}>✓</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      {isToday && !alreadySubmitted && (
        <button
          onClick={handleSubmit}
          disabled={checked.size === 0}
          style={{
            padding: '14px',
            borderRadius: 'var(--r-xl)',
            background: checked.size > 0 ? roleColor : 'var(--surface-2)',
            color: checked.size > 0 ? '#fff' : 'var(--text-3)',
            fontSize: 15, fontWeight: 700,
            border: 'none', cursor: checked.size > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
          }}
        >
          {checked.size > 0 ? `제출하기 (+${todayTotal}점)` : '미션을 선택해주세요'}
        </button>
      )}

      {/* Badge collection */}
      {state.earnedBadges.length > 0 && (
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', marginBottom: 12 }}>
            배지 컬렉션 ({state.earnedBadges.length}개)
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {state.earnedBadges.map(b => (
              <Badge key={b.key} emoji={b.emoji} label={b.label} rarity={b.rarity} count={b.count} size="sm" />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes badge-pop { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes spin-once { from { transform: rotate(-15deg) scale(0.8); } to { transform: rotate(0deg) scale(1); } }
      `}</style>
    </div>
  );
}
