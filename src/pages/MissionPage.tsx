import { useState } from 'react';
import { MissionBoard } from '../components/MissionBoard';
import { Card } from '../components/ui/Card';
import type { SpaceData, RoleId, MissionState } from '../types';
import styles from '../styles/MissionPage.module.css';

interface MissionPageProps {
  data: SpaceData;
  role: RoleId;
  onUpdateMission: (id: RoleId, ms: MissionState) => void;
}

export function MissionPage({ data, role, onUpdateMission }: MissionPageProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [viewRole, setViewRole] = useState<RoleId>(role);
  const state = data.missions[viewRole];

  const roleColor = viewRole === 'male' ? 'var(--accent-blue)' : 'var(--primary)';
  const maleName   = data.meta.maleName   || '남자';
  const femaleName = data.meta.femaleName || '여자';

  return (
    <div className={styles.page}>
      {/* Role selector */}
      <div className={styles.roleRow}>
        <button
          className={styles.roleBtn}
          onClick={() => setViewRole('male')}
          style={{
            background: viewRole === 'male' ? '#E0F2FE' : 'var(--surface)',
            color:      viewRole === 'male' ? 'var(--accent-blue)' : 'var(--text-2)',
            border: viewRole === 'male' ? '2px solid var(--accent-blue)' : '2px solid var(--border)',
          }}
        >
          💚 {maleName}
        </button>
        <button
          className={styles.roleBtn}
          onClick={() => setViewRole('female')}
          style={{
            background: viewRole === 'female' ? 'var(--primary-light)' : 'var(--surface)',
            color:      viewRole === 'female' ? 'var(--primary)' : 'var(--text-2)',
            border: viewRole === 'female' ? '2px solid var(--primary)' : '2px solid var(--border)',
          }}
        >
          💛 {femaleName}
        </button>
      </div>

      {/* Date selector */}
      <div className={styles.dateRow}>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-2)' }}>날짜</label>
        <input
          type="date"
          value={selectedDate}
          max={new Date().toISOString().split('T')[0]}
          onChange={e => setSelectedDate(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 'var(--r-md)',
            border: '1.5px solid var(--border)',
            fontSize: 14,
            fontFamily: 'var(--font)',
          }}
        />
      </div>

      <Card>
        <MissionBoard
          state={state}
          roleId={viewRole}
          selectedDate={selectedDate}
          onStateChange={ms => onUpdateMission(viewRole, ms)}
        />
      </Card>

      {/* Season timeline */}
      {state.seasonHistory.length > 0 && (
        <Card>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12, color: roleColor }}>시즌 기록</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {state.seasonHistory.slice(0, 6).map(s => (
              <div key={s.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{s.month}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: roleColor }}>{s.score}점</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
