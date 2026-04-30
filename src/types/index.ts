export type RoleId = 'male' | 'female';

export interface Role {
  id: RoleId;
  name: string;
}

export interface AppNames {
  houseName: string;
  maleName:  string;
  femaleName: string;
}

export interface ProfileData {
  imageBase64: string;
  offset:      number;
  message:     string;
  presetId:    string | null;
}

export interface MoodData {
  value:     number;
  updatedAt: string;
}

export interface MissionTask {
  id:     string;
  label:  string;
  emoji:  string;
  points: number;
}

export interface BadgeRarity {
  id:        string;
  label:     string;
  className: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  weight:    number;
}

export interface EarnedBadge {
  key:      string;
  id:       string;
  label:    string;
  emoji:    string;
  rarity:   string;
  count:    number;
  earnedAt: string;
}

export interface MissionState {
  grandTotal:     number;
  todayScore:     number;
  lastSubmitDate: string;
  seasonHistory:  Array<{ month: string; score: number }>;
  earnedBadges:   EarnedBadge[];
  submitHistory:  string[];
}

export interface Coupon {
  id:         string;
  title:      string;
  fromRoleId: RoleId;
  redeemed:   boolean;
  issuedAt:   string;
  usedAt:     string | null;
}

export type SyncStatus =
  | 'local'
  | 'connecting'
  | 'synced'
  | 'saving'
  | 'error'
  | 'config-missing';

export interface SpaceData {
  meta: {
    createdAt:  string;
    houseName:  string;
    maleName:   string;
    femaleName: string;
  };
  profiles: Record<RoleId, ProfileData>;
  mood:     Record<RoleId, MoodData>;
  hearts:   Record<RoleId, Record<string, boolean>>;
  femaleRange: { start: string | null };
  missions: Record<RoleId, MissionState>;
  coupons:  Record<RoleId, Coupon[]>;
}
