import React, { useRef, useState } from 'react';
import { PiPencilSimpleBold, PiTrashBold, PiGiftBold, PiCheckBold } from 'react-icons/pi';
import { SyncPanel } from '../components/SyncPanel';
import { ProfileAvatar } from '../components/ProfileAvatar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ANIMAL_PRESETS } from '../lib/appData';
import { compressImage, generateCouponId, todayISO } from '../lib/appUtils';
import type { SpaceData, RoleId, SyncStatus, ProfileData, Coupon } from '../types';
import styles from '../styles/ProfilePage.module.css';

interface ProfilePageProps {
  data: SpaceData;
  role: RoleId;
  spaceCode: string | null;
  syncStatus: SyncStatus;
  onSetRole: (r: RoleId) => void;
  onUpdateProfile: (id: RoleId, p: ProfileData) => void;
  onUpdateNames: (n: { houseName: string; maleName: string; femaleName: string }) => void;
  onCreateCode: () => void;
  onJoinCode: (c: string) => void;
  onLeave: () => void;
  onUpdateCoupons: (id: RoleId, coupons: Coupon[]) => void;
}

export function ProfilePage({
  data, role, spaceCode, syncStatus,
  onSetRole, onUpdateProfile, onUpdateNames,
  onCreateCode, onJoinCode, onLeave, onUpdateCoupons,
}: ProfilePageProps) {
  const [editNames, setEditNames] = useState(false);
  const [nameForm, setNameForm] = useState({ ...data.meta });
  const [couponTitle, setCouponTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profile = data.profiles[role];
  const partner: RoleId = role === 'male' ? 'female' : 'male';
  const myCoupons      = data.coupons[role];
  const partnerCoupons = data.coupons[partner];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressImage(file);
    onUpdateProfile(role, { ...profile, imageBase64: base64, presetId: null });
    e.target.value = '';
  };

  const handlePreset = (id: string) => {
    onUpdateProfile(role, { ...profile, presetId: id, imageBase64: '' });
  };

  const handleOffset = (v: number) => {
    onUpdateProfile(role, { ...profile, offset: v });
  };

  const handleMessage = (msg: string) => {
    onUpdateProfile(role, { ...profile, message: msg });
  };

  const handleNamesSubmit = () => {
    onUpdateNames(nameForm);
    setEditNames(false);
  };

  const issueCoupon = () => {
    if (!couponTitle.trim()) return;
    const newCoupon: Coupon = {
      id:         generateCouponId(),
      title:      couponTitle.trim(),
      fromRoleId: role,
      redeemed:   false,
      issuedAt:   todayISO(),
      usedAt:     null,
    };
    onUpdateCoupons(partner, [...partnerCoupons, newCoupon]);
    setCouponTitle('');
  };

  const redeemCoupon = (couponId: string) => {
    onUpdateCoupons(role, myCoupons.map(c =>
      c.id === couponId ? { ...c, redeemed: true, usedAt: todayISO() } : c
    ));
  };

  return (
    <div className={styles.page}>
      {/* Sync panel */}
      <Card>
        <h3 className={styles.sectionTitle}>공유 코드</h3>
        <SyncPanel
          spaceCode={spaceCode}
          syncStatus={syncStatus}
          onCreateCode={onCreateCode}
          onJoinCode={onJoinCode}
          onLeave={onLeave}
        />
      </Card>

      {/* Role selector */}
      <Card>
        <h3 className={styles.sectionTitle}>내 역할</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {(['male', 'female'] as RoleId[]).map(r => (
            <button
              key={r}
              onClick={() => onSetRole(r)}
              style={{
                padding: 16, borderRadius: 'var(--r-xl)',
                border: role === r
                  ? `2px solid ${r === 'male' ? 'var(--accent-blue)' : 'var(--primary)'}`
                  : '2px solid var(--border)',
                background: role === r
                  ? (r === 'male' ? '#E0F2FE' : 'var(--primary-light)')
                  : 'var(--surface-2)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              <ProfileAvatar profile={data.profiles[r]} roleId={r} size={56} />
              <span style={{ fontSize: 14, fontWeight: 700, color: role === r ? (r === 'male' ? 'var(--accent-blue)' : 'var(--primary)') : 'var(--text-2)' }}>
                {r === 'male' ? (data.meta.maleName || '남자') : (data.meta.femaleName || '여자')}
              </span>
              {role === r && <span style={{ fontSize: 11, color: 'var(--text-3)', fontWeight: 600 }}>현재 선택</span>}
            </button>
          ))}
        </div>
      </Card>

      {/* Profile editor */}
      <Card>
        <h3 className={styles.sectionTitle}>프로필 편집 ({role === 'male' ? data.meta.maleName || '남자' : data.meta.femaleName || '여자'})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar preview */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ProfileAvatar profile={profile} roleId={role} size={72} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => fileInputRef.current?.click()}>
                사진 업로드
              </Button>
              {profile.imageBase64 && (
                <Button size="sm" variant="ghost" onClick={() => onUpdateProfile(role, { ...profile, imageBase64: '' })}>
                  <PiTrashBold /> 사진 삭제
                </Button>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
            </div>
          </div>

          {/* Photo offset */}
          {profile.imageBase64 && (
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>
                사진 위치 {profile.offset}%
              </label>
              <input
                type="range" min={0} max={100} value={profile.offset}
                onChange={e => handleOffset(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>
          )}

          {/* Animal presets */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', marginBottom: 8 }}>동물 프리셋</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {ANIMAL_PRESETS.map(a => (
                <button
                  key={a.id}
                  onClick={() => handlePreset(a.id)}
                  title={a.label}
                  style={{
                    width: 48, height: 48,
                    borderRadius: 'var(--r-md)',
                    border: profile.presetId === a.id ? '2px solid var(--primary)' : '2px solid var(--border)',
                    background: profile.presetId === a.id ? 'var(--primary-light)' : 'var(--surface-2)',
                    fontSize: 24, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  {a.emoji}
                </button>
              ))}
              <button
                onClick={() => onUpdateProfile(role, { ...profile, presetId: null, imageBase64: '' })}
                style={{ width: 48, height: 48, borderRadius: 'var(--r-md)', border: '2px solid var(--border)', background: 'var(--surface-2)', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', cursor: 'pointer' }}
              >없음</button>
            </div>
          </div>

          {/* Message */}
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>한 줄 메시지</label>
            <input
              value={profile.message}
              onChange={e => handleMessage(e.target.value)}
              maxLength={40}
              placeholder="한 줄 메시지를 입력하세요"
              style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font)' }}
            />
          </div>
        </div>
      </Card>

      {/* Name editor */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3 className={styles.sectionTitle} style={{ marginBottom: 0 }}>이름 편집</h3>
          <Button size="sm" variant="ghost" onClick={() => { setEditNames(!editNames); setNameForm({ ...data.meta }); }}>
            <PiPencilSimpleBold /> {editNames ? '취소' : '편집'}
          </Button>
        </div>
        {editNames ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {(['houseName', 'maleName', 'femaleName'] as const).map(k => (
              <div key={k}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-2)', display: 'block', marginBottom: 4 }}>
                  {k === 'houseName' ? '집 이름' : k === 'maleName' ? '남자 애칭' : '여자 애칭'}
                </label>
                <input
                  value={nameForm[k]}
                  onChange={e => setNameForm(f => ({ ...f, [k]: e.target.value }))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font)' }}
                />
              </div>
            ))}
            <Button onClick={handleNamesSubmit} fullWidth><PiCheckBold /> 저장</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 14 }}>🏠 {data.meta.houseName}</span>
            <span style={{ fontSize: 14 }}>💚 {data.meta.maleName}</span>
            <span style={{ fontSize: 14 }}>💛 {data.meta.femaleName}</span>
          </div>
        )}
      </Card>

      {/* Coupons */}
      <Card>
        <h3 className={styles.sectionTitle}>쿠폰</h3>
        {/* Issue coupon */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>
            <PiGiftBold style={{ display: 'inline', marginRight: 4 }} />
            상대에게 쿠폰 발급
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={couponTitle}
              onChange={e => setCouponTitle(e.target.value)}
              placeholder="쿠폰 제목 (예: 안아줘)"
              style={{ flex: 1, padding: '10px 12px', borderRadius: 'var(--r-md)', border: '1.5px solid var(--border)', fontSize: 14, fontFamily: 'var(--font)', minHeight: 44 }}
              onKeyDown={e => e.key === 'Enter' && issueCoupon()}
            />
            <Button size="md" onClick={issueCoupon} disabled={!couponTitle.trim()}>발급</Button>
          </div>
        </div>

        {/* My coupons */}
        {myCoupons.length > 0 && (
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-2)', marginBottom: 8 }}>받은 쿠폰</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {myCoupons.map(c => (
                <div key={c.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-lg)',
                  border: '1.5px solid var(--border)',
                  background: c.redeemed ? 'var(--surface-2)' : 'var(--surface)',
                  opacity: c.redeemed ? 0.6 : 1,
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, textDecoration: c.redeemed ? 'line-through' : 'none', color: c.redeemed ? 'var(--text-3)' : 'var(--text-1)' }}>
                      🎟️ {c.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
                      {c.redeemed ? `사용: ${c.usedAt}` : `발급: ${c.issuedAt}`}
                    </div>
                  </div>
                  {!c.redeemed && (
                    <Button size="sm" variant="secondary" onClick={() => redeemCoupon(c.id)}>사용</Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
