import React from 'react';
import { ANIMAL_PRESETS } from '../lib/appData';
import type { ProfileData, RoleId } from '../types';

interface ProfileAvatarProps {
  profile: ProfileData;
  roleId: RoleId;
  size?: number;
  showBorder?: boolean;
}

const ROLE_COLORS: Record<RoleId, string> = {
  male:   'var(--accent-blue)',
  female: 'var(--primary)',
};

export function ProfileAvatar({ profile, roleId, size = 48, showBorder = true }: ProfileAvatarProps) {
  const borderColor = ROLE_COLORS[roleId];
  const preset = ANIMAL_PRESETS.find(a => a.id === profile.presetId);

  const containerStyle: React.CSSProperties = {
    width:  size,
    height: size,
    borderRadius: '50%',
    overflow: 'hidden',
    border: showBorder ? `2.5px solid ${borderColor}` : 'none',
    background: 'var(--surface-2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  if (profile.imageBase64) {
    const offset = profile.offset ?? 50;
    return (
      <div style={containerStyle}>
        <img
          src={profile.imageBase64}
          alt={`${roleId} 프로필`}
          style={{
            width: '100%',
            height: '140%',
            objectFit: 'cover',
            objectPosition: `center ${offset}%`,
          }}
        />
      </div>
    );
  }

  if (preset) {
    return (
      <div style={containerStyle}>
        <span style={{ fontSize: size * 0.55 }}>{preset.emoji}</span>
      </div>
    );
  }

  const initials = roleId === 'male' ? '♂' : '♀';
  return (
    <div style={{ ...containerStyle, background: `${borderColor}22` }}>
      <span style={{ fontSize: size * 0.42, color: borderColor, fontWeight: 700 }}>{initials}</span>
    </div>
  );
}
