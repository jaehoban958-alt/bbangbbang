import React, { useRef, useCallback } from 'react';
import { ProfileAvatar } from './ProfileAvatar';
import type { ProfileData, RoleId } from '../types';

interface MoodSliderProps {
  value: number;
  onChange: (v: number) => void;
  profile: ProfileData;
  roleId: RoleId;
  height?: number;
}

const MOOD_STEPS = [
  { label: '😍', text: '최고!',   value: 100 },
  { label: '😊', text: '좋아요',  value: 75 },
  { label: '😐', text: '보통',    value: 50 },
  { label: '😔', text: '별로',    value: 25 },
  { label: '😴', text: '지쳐요',  value: 0  },
];

export function MoodSlider({ value, onChange, profile, roleId, height = 240 }: MoodSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const velocityRef = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const rafRef = useRef<number>(0);

  const valueToY = (v: number) => (1 - v / 100) * (height - 44);

  const yToValue = useCallback((clientY: number) => {
    if (!trackRef.current) return value;
    const rect = trackRef.current.getBoundingClientRect();
    const relY = clientY - rect.top - 22;
    const trackH = height - 44;
    return Math.max(0, Math.min(100, Math.round((1 - relY / trackH) * 100)));
  }, [height, value]);

  const applyMomentum = useCallback(() => {
    velocityRef.current *= 0.88;
    if (Math.abs(velocityRef.current) < 0.3) return;
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const thumbY = rect.top + valueToY(value);
    const newY = thumbY + velocityRef.current;
    onChange(yToValue(newY));
    rafRef.current = requestAnimationFrame(applyMomentum);
  }, [height, value, onChange, yToValue, valueToY]);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastY.current = e.clientY;
    lastTime.current = performance.now();
    cancelAnimationFrame(rafRef.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const now = performance.now();
    const dt = now - lastTime.current;
    velocityRef.current = dt > 0 ? (e.clientY - lastY.current) / dt * 16 : 0;
    lastY.current = e.clientY;
    lastTime.current = now;
    onChange(yToValue(e.clientY));
  };

  const onPointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    rafRef.current = requestAnimationFrame(applyMomentum);
  };

  const thumbY = valueToY(value);
  const roleColor = roleId === 'male' ? 'var(--accent-blue)' : 'var(--primary)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', height, width: 64, userSelect: 'none' }}>
        {/* Track */}
        <div
          ref={trackRef}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 22,
            bottom: 22,
            width: 8,
            borderRadius: 'var(--r-pill)',
            background: `linear-gradient(to bottom, ${roleColor}33, ${roleColor}11)`,
          }}
        />
        {/* Fill */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            top: 22 + thumbY,
            bottom: 22,
            width: 8,
            borderRadius: 'var(--r-pill)',
            background: roleColor,
            opacity: 0.4,
          }}
        />
        {/* Step dots */}
        {MOOD_STEPS.map(step => (
          <div
            key={step.value}
            style={{
              position: 'absolute',
              left: '50%',
              top: 22 + valueToY(step.value),
              transform: 'translate(-50%, -50%)',
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: value === step.value ? roleColor : 'var(--border)',
              transition: 'background 0.2s',
            }}
          />
        ))}
        {/* Thumb */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 22 + thumbY,
            transform: 'translate(-50%, -50%)',
            cursor: 'grab',
            touchAction: 'none',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <ProfileAvatar profile={profile} roleId={roleId} size={44} showBorder />
        </div>
      </div>
      {/* Mood label */}
      <div style={{ fontSize: '20px', lineHeight: 1 }}>
        {MOOD_STEPS.reduce((best, s) =>
          Math.abs(s.value - value) < Math.abs(best.value - value) ? s : best
        ).label}
      </div>
      <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-2)' }}>
        {MOOD_STEPS.reduce((best, s) =>
          Math.abs(s.value - value) < Math.abs(best.value - value) ? s : best
        ).text}
      </div>
    </div>
  );
}
