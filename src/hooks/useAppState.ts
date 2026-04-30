import { useState, useCallback, useRef, useEffect } from 'react';
import { useFirebaseSync, useSpaceActions, EMPTY_SPACE } from './useFirebaseSync';
import { debounce } from '../lib/appUtils';
import type { SpaceData, RoleId, SyncStatus, ProfileData, MoodData, MissionState, Coupon } from '../types';

const LS_CODE = 'happyCal_spaceCode';
const LS_ROLE = 'happyCal_role';
const LS_DATA = 'happyCal_localData';

function loadLocal(): SpaceData {
  try {
    const raw = localStorage.getItem(LS_DATA);
    if (raw) return JSON.parse(raw) as SpaceData;
  } catch { /* empty */ }
  return EMPTY_SPACE();
}

function saveLocal(data: SpaceData) {
  try { localStorage.setItem(LS_DATA, JSON.stringify(data)); } catch { /* empty */ }
}

export function useAppState() {
  const [spaceCode, setSpaceCode] = useState<string | null>(() => localStorage.getItem(LS_CODE));
  const [role, setRoleState]      = useState<RoleId>(() => (localStorage.getItem(LS_ROLE) as RoleId) ?? 'female');
  const [data, setDataState]      = useState<SpaceData>(loadLocal);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');

  const dataRef = useRef(data);
  dataRef.current = data;

  const { save, createSpace, joinSpace } = useSpaceActions(setSyncStatus);

  const debouncedSave = useRef(
    debounce(((code: string, d: SpaceData) => { save(code, d); }) as (...args: unknown[]) => void, 300)
  ).current;

  const setData = useCallback((next: SpaceData) => {
    setDataState(next);
    saveLocal(next);
    if (spaceCode) debouncedSave(spaceCode, next);
  }, [spaceCode, debouncedSave]);

  useFirebaseSync({
    spaceCode,
    onData: useCallback((remote: SpaceData) => {
      setDataState(remote);
      saveLocal(remote);
    }, []),
    onStatus: setSyncStatus,
  });

  useEffect(() => {
    if (spaceCode) localStorage.setItem(LS_CODE, spaceCode);
    else localStorage.removeItem(LS_CODE);
  }, [spaceCode]);

  const setRole = useCallback((r: RoleId) => {
    setRoleState(r);
    localStorage.setItem(LS_ROLE, r);
  }, []);

  const handleCreateCode = useCallback(async () => {
    const { code, data: newData } = await createSpace();
    setSpaceCode(code);
    setDataState(newData);
    saveLocal(newData);
  }, [createSpace]);

  const handleJoinCode = useCallback(async (code: string) => {
    const remote = await joinSpace(code);
    if (remote) {
      setSpaceCode(code);
      setDataState(remote);
      saveLocal(remote);
    } else {
      alert('해당 코드를 찾을 수 없습니다.');
    }
  }, [joinSpace]);

  const handleLeave = useCallback(() => {
    setSpaceCode(null);
    setSyncStatus('local');
  }, []);

  // Partial updaters
  const updateProfile = useCallback((id: RoleId, p: ProfileData) => {
    setData({ ...dataRef.current, profiles: { ...dataRef.current.profiles, [id]: p } });
  }, [setData]);

  const updateMood = useCallback((id: RoleId, m: MoodData) => {
    setData({ ...dataRef.current, mood: { ...dataRef.current.mood, [id]: m } });
  }, [setData]);

  const toggleHeart = useCallback((id: RoleId, iso: string) => {
    const current = dataRef.current.hearts[id][iso];
    setData({
      ...dataRef.current,
      hearts: {
        ...dataRef.current.hearts,
        [id]: { ...dataRef.current.hearts[id], [iso]: !current },
      },
    });
  }, [setData]);

  const setFemaleRangeStart = useCallback((start: string | null) => {
    setData({ ...dataRef.current, femaleRange: { start } });
  }, [setData]);

  const updateMission = useCallback((id: RoleId, ms: MissionState) => {
    setData({ ...dataRef.current, missions: { ...dataRef.current.missions, [id]: ms } });
  }, [setData]);

  const updateNames = useCallback((names: { houseName: string; maleName: string; femaleName: string }) => {
    setData({ ...dataRef.current, meta: { ...dataRef.current.meta, ...names } });
  }, [setData]);

  const updateCoupons = useCallback((id: RoleId, coupons: Coupon[]) => {
    setData({ ...dataRef.current, coupons: { ...dataRef.current.coupons, [id]: coupons } });
  }, [setData]);

  return {
    spaceCode, role, data, syncStatus,
    setRole,
    handleCreateCode, handleJoinCode, handleLeave,
    updateProfile, updateMood, toggleHeart,
    setFemaleRangeStart, updateMission,
    updateNames, updateCoupons,
  };
}
