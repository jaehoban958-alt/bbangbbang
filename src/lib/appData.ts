import type { MissionTask, BadgeRarity, MissionState, ProfileData, MoodData } from '../types';

export const MISSION_TASKS: MissionTask[] = [
  { id: 'date',    label: '데이트',     emoji: '🌹', points: 30 },
  { id: 'call',    label: '통화',       emoji: '📞', points: 10 },
  { id: 'message', label: '편지/메모',  emoji: '💌', points: 15 },
  { id: 'gift',    label: '선물',       emoji: '🎁', points: 25 },
  { id: 'walk',    label: '산책',       emoji: '🚶', points: 10 },
  { id: 'cook',    label: '요리해주기', emoji: '🍳', points: 20 },
];

export const BADGE_RARITIES: BadgeRarity[] = [
  { id: 'common',    label: 'Common',    className: 'common',    weight: 50 },
  { id: 'uncommon',  label: 'Uncommon',  className: 'uncommon',  weight: 25 },
  { id: 'rare',      label: 'Rare',      className: 'rare',      weight: 15 },
  { id: 'epic',      label: 'Epic',      className: 'epic',      weight: 8  },
  { id: 'legendary', label: 'Legendary', className: 'legendary', weight: 2  },
];

export const BADGE_POOL = [
  { id: 'heart',   emoji: '❤️',  label: '사랑꾼'  },
  { id: 'star',    emoji: '⭐',  label: '스타'    },
  { id: 'fire',    emoji: '🔥',  label: '열정'    },
  { id: 'rainbow', emoji: '🌈',  label: '무지개'  },
  { id: 'crown',   emoji: '👑',  label: '왕관'    },
  { id: 'diamond', emoji: '💎',  label: '다이아'  },
  { id: 'cake',    emoji: '🎂',  label: '케이크'  },
  { id: 'music',   emoji: '🎵',  label: '음악'    },
  { id: 'flower',  emoji: '🌸',  label: '꽃'      },
  { id: 'moon',    emoji: '🌙',  label: '달빛'    },
  { id: 'sun',     emoji: '☀️',  label: '햇살'    },
  { id: 'magic',   emoji: '✨',  label: '마법'    },
];

export const ANIMAL_PRESETS = [
  { id: 'rabbit', emoji: '🐰', label: '토끼' },
  { id: 'bear',   emoji: '🐻', label: '곰'   },
  { id: 'cat',    emoji: '🐱', label: '고양이' },
  { id: 'dog',    emoji: '🐶', label: '강아지' },
  { id: 'fox',    emoji: '🦊', label: '여우'  },
  { id: 'penguin',emoji: '🐧', label: '펭귄'  },
];

export const DEFAULT_PROFILE: ProfileData = {
  imageBase64: '',
  offset:      50,
  message:     '',
  presetId:    null,
};

export const DEFAULT_MOOD: MoodData = {
  value:     50,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_MISSION_STATE: MissionState = {
  grandTotal:     0,
  todayScore:     0,
  lastSubmitDate: '',
  seasonHistory:  [],
  earnedBadges:   [],
  submitHistory:  [],
};

export const POINTS_PER_BADGE = 100;

export const LEVEL_THRESHOLDS = [0, 100, 300, 600, 1000, 1500, 2200, 3000];
export const LEVEL_LABELS = ['씨앗', '새싹', '꽃봉오리', '꽃', '열매', '나무', '숲', '우주'];
