import { useState } from 'react';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';
import { useCalendar } from '../hooks/useCalendar';
import { toISODate, isFemaleRangeDay, formatYearMonth } from '../lib/appUtils';
import type { SpaceData, RoleId } from '../types';
import styles from '../styles/CalendarPage.module.css';

interface CalendarPageProps {
  data: SpaceData;
  role: RoleId;
  onToggleHeart: (id: RoleId, iso: string) => void;
  onSetFemaleRange: (start: string | null) => void;
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function CalendarPage({ data, role, onToggleHeart, onSetFemaleRange }: CalendarPageProps) {
  const { year, month, grid, prevMonth, nextMonth, todayISO } = useCalendar();
  const [selected, setSelected] = useState<string | null>(null);
  const [showRangeModal, setShowRangeModal] = useState(false);
  const [rangeInput, setRangeInput] = useState(data.femaleRange.start ?? '');

  const handleCellClick = (date: Date) => {
    const iso = toISODate(date);
    if (iso > todayISO) return;
    if (selected === iso) {
      onToggleHeart(role, iso);
      setSelected(null);
    } else {
      setSelected(iso);
    }
  };

  const totalMale   = Object.values(data.hearts.male).filter(Boolean).length;
  const totalFemale = Object.values(data.hearts.female).filter(Boolean).length;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={prevMonth} className={styles.navBtn} aria-label="이전 달">
          <PiCaretLeftBold />
        </button>
        <h2 className={styles.monthTitle}>{formatYearMonth(year, month)}</h2>
        <button onClick={nextMonth} className={styles.navBtn} aria-label="다음 달">
          <PiCaretRightBold />
        </button>
      </div>

      {/* Summary chips */}
      <div className={styles.summary}>
        <span className={styles.chip} style={{ background: '#E0F2FE', color: '#0284C7' }}>
          💚 {totalMale}일
        </span>
        <span className={styles.chip} style={{ background: '#FFF0F0', color: 'var(--primary)' }}>
          💛 {totalFemale}일
        </span>
        <button
          className={styles.rangeBtn}
          onClick={() => { setRangeInput(data.femaleRange.start ?? ''); setShowRangeModal(true); }}
        >
          🌸 여성 사이클 설정
        </button>
      </div>

      {/* Weekday headers */}
      <div className={styles.weekRow}>
        {WEEKDAYS.map(d => (
          <div key={d} className={styles.weekLabel}
            style={{ color: d === '일' ? 'var(--primary)' : d === '토' ? 'var(--accent-blue)' : 'var(--text-2)' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className={styles.grid}>
        {grid.map((date, i) => {
          if (!date) return <div key={i} className={styles.emptyCell} />;
          const iso       = toISODate(date);
          const isToday   = iso === todayISO;
          const isFuture  = iso > todayISO;
          const isSel     = iso === selected;
          const maleHeart = data.hearts.male[iso];
          const femHeart  = data.hearts.female[iso];
          const inRange   = isFemaleRangeDay(date, data.femaleRange.start);
          const isSun     = date.getDay() === 0;
          const isSat     = date.getDay() === 6;

          return (
            <button
              key={iso}
              className={styles.cell}
              disabled={isFuture}
              onClick={() => handleCellClick(date)}
              style={{
                background: inRange ? '#FFF0F5' : 'var(--surface)',
                border: isSel ? '2px solid var(--primary)' : isToday ? '2px solid var(--accent)' : '1.5px solid var(--border)',
                opacity: isFuture ? 0.35 : 1,
              }}
              aria-label={`${iso}${maleHeart ? ' 남' : ''}${femHeart ? ' 여' : ''}`}
            >
              <span className={styles.dateNum}
                style={{ color: isToday ? 'var(--primary)' : isSun ? 'var(--primary)' : isSat ? 'var(--accent-blue)' : 'var(--text-1)' }}>
                {date.getDate()}
              </span>
              <div className={styles.hearts}>
                {maleHeart && <span className={styles.heart} title="남자">💚</span>}
                {femHeart  && <span className={styles.heart} title="여자">💛</span>}
              </div>
              {inRange && <div className={styles.rangeDot} />}
            </button>
          );
        })}
      </div>

      {/* Selected hint */}
      {selected && (
        <div className={styles.hint}>
          {selected} 날짜 선택됨 — 다시 탭하면 하트 {data.hearts[role][selected] ? '취소' : '기록'}
        </div>
      )}

      {/* Female range modal */}
      {showRangeModal && (
        <div className={styles.overlay} onClick={() => setShowRangeModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>여성 사이클 시작일</h3>
            <input
              type="date"
              value={rangeInput}
              onChange={e => setRangeInput(e.target.value)}
              style={{ padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', fontSize: 15, width: '100%', marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{ flex: 1, padding: '12px', borderRadius: 'var(--r-lg)', background: 'var(--primary)', color: '#fff', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}
                onClick={() => { onSetFemaleRange(rangeInput || null); setShowRangeModal(false); }}
              >확인</button>
              <button
                style={{ padding: '12px 20px', borderRadius: 'var(--r-lg)', background: 'var(--surface-2)', fontWeight: 700, fontSize: 15, border: 'none', cursor: 'pointer' }}
                onClick={() => { onSetFemaleRange(null); setShowRangeModal(false); }}
              >초기화</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
