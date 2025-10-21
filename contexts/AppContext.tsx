import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { StackCard, StackType, getStackByType } from '@/constants/stacks';

export type WeekStandard = 'iso' | 'us' | 'custom';
export type Week53Handling = 'joker' | 'merge52' | 'wrap1';

export type HolidayCountry = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR';

type ForceMonthMode = 'relative' | 'absolute';
interface ForceSettings {
  monthMode: ForceMonthMode;
  relativeOffset: number;
  absoluteYear: number;
  absoluteMonthIndex: number;
  forceDay: number;
  tapRemapMode: 'stealth' | 'honest';
  snapDurationMs: number;
}

interface ForceRuntimeState {
  snapped: boolean;
  locked: boolean;
  lastTriggerAt: number | null;
  panicUntil: number | null;
}

interface AppSettings {
  stackType: StackType;
  customStack: StackCard[];
  selectedCustomStackId?: string | null;
  seed: number;
  peekEnabled: boolean;
  rehearsalMode: boolean;
  weekStandard: WeekStandard;
  weekStartDay: number;
  week53Handling: Week53Handling;
  holidaysEnabled: boolean;
  holidayCountry: HolidayCountry;
  force: ForceSettings;
}

const now = new Date();
const DEFAULT_SETTINGS: AppSettings = {
  stackType: 'mnemonica',
  customStack: [],
  selectedCustomStackId: null,
  seed: 12345,
  peekEnabled: true,
  rehearsalMode: false,
  weekStandard: 'iso',
  weekStartDay: 1,
  week53Handling: 'merge52',
  holidaysEnabled: true,
  holidayCountry: 'US',
  force: {
    monthMode: 'relative',
    relativeOffset: 0,
    absoluteYear: now.getFullYear(),
    absoluteMonthIndex: now.getMonth(),
    forceDay: 1,
    tapRemapMode: 'stealth',
    snapDurationMs: 500,
  },
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [showMagicianPanel, setShowMagicianPanel] = useState(false);
  const [peekOverlay, setPeekOverlay] = useState<{
    visible: boolean;
    card: StackCard | null;
    weekNumber?: number | null;
  }>({ visible: false, card: null, weekNumber: null });
  const [forceState, setForceState] = useState<ForceRuntimeState>({ snapped: false, locked: false, lastTriggerAt: null, panicUntil: null });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('axiom_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings } as AppSettings;
    setSettings(updated);
    try {
      await AsyncStorage.setItem('axiom_settings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateForce = useCallback(async (partial: Partial<ForceSettings>) => {
    const updated = { ...settings, force: { ...settings.force, ...partial } } as AppSettings;
    setSettings(updated);
    try {
      await AsyncStorage.setItem('axiom_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save force settings:', e);
    }
  }, [settings]);

  const currentStack = useMemo(() => {
    if (settings.stackType === 'custom') {
      return settings.customStack;
    }
    return getStackByType(settings.stackType);
  }, [settings.stackType, settings.customStack]);

  const showPeek = useCallback((card: StackCard | null, weekNumber?: number | null) => {
    if (!settings.peekEnabled) return;
    setPeekOverlay({ visible: true, card, weekNumber: weekNumber ?? null });
    setTimeout(() => {
      setPeekOverlay({ visible: false, card: null, weekNumber: null });
    }, 1200);
  }, [settings.peekEnabled]);

  const toggleMagicianPanel = useCallback(() => {
    setShowMagicianPanel(prev => !prev);
  }, []);

  const getForcedMonthDate = useCallback((): { year: number; monthIndex: number } => {
    if (settings.force.monthMode === 'relative') {
      const base = new Date();
      const target = new Date(base.getFullYear(), base.getMonth() + settings.force.relativeOffset, 1);
      return { year: target.getFullYear(), monthIndex: target.getMonth() };
    }
    return { year: settings.force.absoluteYear, monthIndex: settings.force.absoluteMonthIndex };
  }, [settings.force]);

  const debounceOk = (nowTs: number) => {
    const last = forceState.lastTriggerAt ?? 0;
    return nowTs - last > 250 && (!forceState.panicUntil || nowTs > forceState.panicUntil);
  };

  const markTrigger = (ts: number) => setForceState(prev => ({ ...prev, lastTriggerAt: ts }));

  const armAndSnap = useCallback(() => {
    const ts = Date.now();
    if (!debounceOk(ts)) return { ok: false } as const;
    setForceState(prev => ({ ...prev, snapped: true }));
    markTrigger(ts);
    return { ok: true } as const;
  }, [forceState.lastTriggerAt, forceState.panicUntil]);

  const lockForceDay = useCallback(() => {
    const ts = Date.now();
    if (!debounceOk(ts)) return { ok: false } as const;
    setForceState(prev => ({ ...prev, locked: true }));
    markTrigger(ts);
    return { ok: true } as const;
  }, [forceState.lastTriggerAt, forceState.panicUntil]);

  const armSnapAndLock = useCallback(() => {
    const ts = Date.now();
    if (!debounceOk(ts)) return { ok: false } as const;
    setForceState({ snapped: true, locked: true, lastTriggerAt: ts, panicUntil: null });
    return { ok: true } as const;
  }, [forceState.lastTriggerAt, forceState.panicUntil]);

  const cancelForce = useCallback(() => {
    const ts = Date.now();
    setForceState({ snapped: false, locked: false, lastTriggerAt: ts, panicUntil: null });
  }, []);

  const panic = useCallback(() => {
    const ts = Date.now();
    setForceState({ snapped: false, locked: false, lastTriggerAt: ts, panicUntil: ts + 10000 });
  }, []);

  return useMemo(() => ({
    settings,
    saveSettings,
    updateForce,
    isLoading,
    currentStack,
    showMagicianPanel,
    setShowMagicianPanel,
    toggleMagicianPanel,
    peekOverlay,
    showPeek,
    forceState,
    getForcedMonthDate,
    armAndSnap,
    lockForceDay,
    armSnapAndLock,
    cancelForce,
    panic,
  }), [settings, saveSettings, updateForce, isLoading, currentStack, showMagicianPanel, toggleMagicianPanel, peekOverlay, showPeek, forceState, getForcedMonthDate, armAndSnap, lockForceDay, armSnapAndLock, cancelForce, panic]);
});