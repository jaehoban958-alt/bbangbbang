import { MoodSlider } from '../components/MoodSlider';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { Card } from '../components/ui/Card';
import { ProgressBar } from '../components/ui/ProgressBar';
import { todayISO, getLevel } from '../lib/appUtils';
import type { SpaceData, RoleId, MoodData } from '../types';
import styles from '../styles/HomePage.module.css';

interface HomePageProps {
  data: SpaceData;
  role: RoleId;
  onMoodChange: (id: RoleId, m: MoodData) => void;
}

export function HomePage({ data, role, onMoodChange }: HomePageProps) {
  const today = todayISO();
  const maleName   = data.meta.maleName   || '남자';
  const femaleName = data.meta.femaleName || '여자';
  const houseName  = data.meta.houseName  || '우리집';

  const maleHearts   = Object.values(data.hearts.male).filter(Boolean).length;
  const femaleHearts = Object.values(data.hearts.female).filter(Boolean).length;

  const maleLevel   = getLevel(data.missions.male.grandTotal);
  const femaleLevel = getLevel(data.missions.female.grandTotal);

  const recentDates = Array.from({ length: 5 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  });

  const recentEvents = recentDates.flatMap(d => {
    const events: { date: string; text: string; emoji: string }[] = [];
    if (data.hearts.male[d])   events.push({ date: d, text: `${maleName} 하트`, emoji: '💚' });
    if (data.hearts.female[d]) events.push({ date: d, text: `${femaleName} 하트`, emoji: '💛' });
    return events;
  });

  return (
    <div className={styles.page}>
      {/* House name */}
      <div className={styles.houseHeader}>
        <span className={styles.houseName}>🏠 {houseName}</span>
        <span className={styles.dateLabel}>{today}</span>
      </div>

      {/* Profile cards with mood sliders */}
      <div className={styles.profileGrid}>
        {(['male', 'female'] as RoleId[]).map(r => {
          const name    = r === 'male' ? maleName : femaleName;
          const mood    = data.mood[r];
          const profile = data.profiles[r];
          const isMe    = r === role;
          const roleColor = r === 'male' ? 'var(--accent-blue)' : 'var(--primary)';

          return (
            <div
              key={r}
              className={styles.profileCard}
              style={{ border: isMe ? `2px solid ${roleColor}` : '2px solid var(--border)' }}
            >
              <div className={styles.profileTop}>
                <ProfileAvatar profile={profile} roleId={r} size={44} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                  {profile.message && (
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {profile.message}
                    </div>
                  )}
                  {isMe && <span style={{ fontSize: 10, fontWeight: 700, color: roleColor }}>나</span>}
                </div>
              </div>
              <MoodSlider
                value={mood.value}
                profile={profile}
                roleId={r}
                height={200}
                onChange={v => {
                  if (!isMe) return;
                  onMoodChange(r, { value: v, updatedAt: new Date().toISOString() });
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Achievement row */}
      <Card>
        <h3 className={styles.cardTitle}>❤️ 하트 기록</h3>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-blue)' }}>{maleHearts}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>💚 {maleName}</div>
          </div>
          <div style={{ fontSize: 28, color: 'var(--border)', alignSelf: 'center' }}>·</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{femaleHearts}</div>
            <div style={{ fontSize: 12, color: 'var(--text-3)' }}>💛 {femaleName}</div>
          </div>
        </div>
      </Card>

      {/* Mission overview */}
      <Card>
        <h3 className={styles.cardTitle}>🏆 미션 현황</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {(['male', 'female'] as RoleId[]).map(r => {
            const level = r === 'male' ? maleLevel : femaleLevel;
            const name  = r === 'male' ? maleName : femaleName;
            const color = r === 'male' ? 'var(--accent-blue)' : 'var(--primary)';
            const latestBadge = data.missions[r].earnedBadges[data.missions[r].earnedBadges.length - 1];
            return (
              <div key={r}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{name}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-3)' }}>Lv.{level.level} {level.label}</span>
                  {latestBadge && (
                    <span title={latestBadge.label} style={{ marginLeft: 'auto', fontSize: 18 }}>{latestBadge.emoji}</span>
                  )}
                </div>
                <ProgressBar value={data.missions[r].grandTotal % 100} max={100} color={color} height={6} />
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent events timeline */}
      {recentEvents.length > 0 && (
        <Card>
          <h3 className={styles.cardTitle}>📅 최근 기록</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentEvents.slice(0, 8).map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>{e.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{e.text}</span>
                <span style={{ fontSize: 12, color: 'var(--text-3)', marginLeft: 'auto' }}>{e.date}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
