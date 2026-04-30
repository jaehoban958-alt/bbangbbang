import { useEffect, useRef, useCallback } from 'react';
import {
  doc, setDoc, onSnapshot, getDoc, type Unsubscribe
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth, isFirebaseConfigured } from '../firebase';
import { DEFAULT_PROFILE, DEFAULT_MOOD, DEFAULT_MISSION_STATE } from '../lib/appData';
import { generateSpaceCode } from '../lib/appUtils';
import type { SpaceData, SyncStatus, RoleId } from '../types';

const EMPTY_SPACE = (): SpaceData => ({
  meta: { createdAt: new Date().toISOString(), houseName: '우리집', maleName: '남자', femaleName: '여자' },
  profiles: { male: { ...DEFAULT_PROFILE }, female: { ...DEFAULT_PROFILE } },
  mood:     { male: { ...DEFAULT_MOOD }, female: { ...DEFAULT_MOOD } },
  hearts:   { male: {}, female: {} },
  femaleRange: { start: null },
  missions: { male: { ...DEFAULT_MISSION_STATE }, female: { ...DEFAULT_MISSION_STATE } },
  coupons:  { male: [], female: [] },
});

interface FirebaseSyncOptions {
  spaceCode: string | null;
  onData: (data: SpaceData) => void;
  onStatus: (s: SyncStatus) => void;
}

export function useFirebaseSync({ spaceCode, onData, onStatus }: FirebaseSyncOptions) {
  const unsubRef = useRef<Unsubscribe | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) { onStatus('config-missing'); return; }
    if (!spaceCode) { onStatus('local'); return; }

    onStatus('connecting');
    let cancelled = false;

    signInAnonymously(auth).catch(console.error);

    const ref = doc(db, 'spaces', spaceCode);
    const unsub = onSnapshot(ref, snap => {
      if (cancelled) return;
      if (snap.exists()) {
        onData(snap.data() as SpaceData);
        onStatus('synced');
      } else {
        onStatus('synced');
      }
    }, err => {
      console.error(err);
      if (!cancelled) onStatus('error');
    });

    unsubRef.current = unsub;
    return () => { cancelled = true; unsub(); };
  }, [spaceCode, onData, onStatus]);
}

export function useSpaceActions(onStatus: (s: SyncStatus) => void) {
  const save = useCallback(async (code: string, data: Partial<SpaceData>) => {
    if (!isFirebaseConfigured || !code) return;
    onStatus('saving');
    try {
      await setDoc(doc(db, 'spaces', code), data, { merge: true });
      onStatus('synced');
    } catch (e) {
      console.error(e);
      onStatus('error');
    }
  }, [onStatus]);

  const createSpace = useCallback(async (): Promise<{ code: string; data: SpaceData }> => {
    const code = generateSpaceCode();
    const data = EMPTY_SPACE();
    if (isFirebaseConfigured) {
      try {
        await signInAnonymously(auth);
        await setDoc(doc(db, 'spaces', code), data);
      } catch (e) { console.error(e); }
    }
    return { code, data };
  }, []);

  const joinSpace = useCallback(async (code: string): Promise<SpaceData | null> => {
    if (!isFirebaseConfigured) return null;
    try {
      await signInAnonymously(auth);
      const snap = await getDoc(doc(db, 'spaces', code));
      return snap.exists() ? (snap.data() as SpaceData) : null;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  return { save, createSpace, joinSpace };
}

export { EMPTY_SPACE };
export type { RoleId };
