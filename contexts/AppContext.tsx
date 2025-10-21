import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { StackCard, StackType, getStackByType } from '@/constants/stacks';

export type WeekStandard = 'iso' | 'us' | 'custom';
export type Week53Handling = 'joker' | 'merge52' | 'wrap1';

export type HolidayCountry = 'US' | 'UK' | 'CA' | 'AU' | 'DE' | 'FR';

export type ForceMonthMode = 'off' | 'relative' | 'absolute';
export type RemapScope = 'forcedMonthOnly' | 'anyVisible';
export type FallbackPolicy = 'nearest' | 'block';

export type OverrideItemType = 'Card' | 'ESP' | 'Color' | 'Number' | 'Word' | 'Zodiac' | 'Birthstone' | 'Element' | 'Planet' | 'Pi' | 'Rune' | 'IChing' | 'Constellation' | 'Note';

export interface ItemMapping {
  type: OverrideItemType;
  value: string | number;
  cues?: string;
}

export interface DayOverride {
  day: number;
  publicLabel: string;
  items: ItemMapping[];
  defaultIndex: number; // 1-based
}

export interface MonthOverrides {
  monthYear: string; // YYYY-MM
  days: DayOverride[];
}

interface ForceSettings {
  enabled: boolean;
  monthMode: ForceMonthMode;
  relativeOffset: number;
  absoluteYear: number;
  absoluteMonthIndex: number; // 0-11
  forceDayEnabled: boolean;
  forceDay: number; // 1..31
  fallbackPolicy: FallbackPolicy;
  tapRemapMode: 'stealth' | 'honest';
  remapScope: RemapScope;
  cancelLockOnBack: boolean;
  snapDurationMs: number; // 300-700
  overridesEnabled: boolean;
  overridesMap: Record<string, MonthOverrides>; // key YYYY-MM
}

interface ForceRuntimeState {
  snapped: boolean;
  locked: boolean;
  lastTriggerAt: number | null;
  panicUntil: number | null;
}

export type LibraryPick = { type: OverrideItemType; id: string; label: string; value: string | number; color?: string; emoji?: string } | null;

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
    enabled: false,
    monthMode: 'off',
    relativeOffset: 0,
    absoluteYear: now.getFullYear(),
    absoluteMonthIndex: now.getMonth(),
    forceDayEnabled: false,
    forceDay: 1,
    fallbackPolicy: 'nearest',
    tapRemapMode: 'stealth',
    remapScope: 'forcedMonthOnly',
    cancelLockOnBack: true,
    snapDurationMs: 500,
    overridesEnabled: false,
    overridesMap: {},
  },
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [lastLibraryPick, setLastLibraryPick] = useState<LibraryPick>(null);
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
        const parsed = JSON.parse(stored) as Partial<AppSettings>;
        const merged: AppSettings = {
          ...DEFAULT_SETTINGS,
          ...parsed,
          force: {
            ...DEFAULT_SETTINGS.force,
            ...(parsed.force ?? {} as Partial<ForceSettings>),
            overridesMap: {
              ...DEFAULT_SETTINGS.force.overridesMap,
              ...((parsed.force as Partial<ForceSettings> | undefined)?.overridesMap ?? {}),
            },
          },
        } as AppSettings;
        setSettings(merged);
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
    if (settings.force.monthMode === 'absolute') {
      return { year: settings.force.absoluteYear, monthIndex: settings.force.absoluteMonthIndex };
    }
    const d = new Date();
    return { year: d.getFullYear(), monthIndex: d.getMonth() };
  }, [settings.force]);

  const getValidForcedDayFor = useCallback((y: number, m: number): number | null => {
    if (!settings.force.forceDayEnabled) return null;
    const daysIn = new Date(y, m + 1, 0).getDate();
    const desired = settings.force.forceDay;
    if (desired <= daysIn) return desired;
    if (settings.force.fallbackPolicy === 'nearest') {
      return daysIn;
    }
    return null;
  }, [settings.force.forceDayEnabled, settings.force.forceDay, settings.force.fallbackPolicy]);

  const debounceOk = (nowTs: number, windowMs?: number | null) => {
    const last = forceState.lastTriggerAt ?? 0;
    const deltaOk = nowTs - last > (windowMs ?? 250);
    return deltaOk && (!forceState.panicUntil || nowTs > forceState.panicUntil);
  };

  const markTrigger = (ts: number) => setForceState(prev => ({ ...prev, lastTriggerAt: ts }));

  const armAndSnap = useCallback(() => {
    if (!settings.force.enabled) return { ok: false } as const;
    const ts = Date.now();
    if (!debounceOk(ts, 2000)) return { ok: false } as const;
    setForceState(prev => ({ ...prev, snapped: true }));
    markTrigger(ts);
    return { ok: true } as const;
  }, [settings.force.enabled, forceState.lastTriggerAt, forceState.panicUntil]);

  const lockForceDay = useCallback(() => {
    if (!settings.force.enabled || !settings.force.forceDayEnabled) return { ok: false } as const;
    const ts = Date.now();
    if (!debounceOk(ts, 2000)) return { ok: false } as const;
    setForceState(prev => ({ ...prev, locked: true }));
    markTrigger(ts);
    return { ok: true } as const;
  }, [settings.force.enabled, settings.force.forceDayEnabled, forceState.lastTriggerAt, forceState.panicUntil]);

  const armSnapAndLock = useCallback(() => {
    if (!settings.force.enabled) return { ok: false } as const;
    const ts = Date.now();
    if (!debounceOk(ts, 2000)) return { ok: false } as const;
    setForceState({ snapped: true, locked: !!settings.force.forceDayEnabled, lastTriggerAt: ts, panicUntil: null });
    return { ok: true } as const;
  }, [settings.force.enabled, settings.force.forceDayEnabled, forceState.lastTriggerAt, forceState.panicUntil]);

  const cancelForce = useCallback(() => {
    const ts = Date.now();
    setForceState({ snapped: false, locked: false, lastTriggerAt: ts, panicUntil: null });
  }, []);

  const panic = useCallback(() => {
    const ts = Date.now();
    setForceState({ snapped: false, locked: false, lastTriggerAt: ts, panicUntil: ts + 10000 });
  }, []);

  const setOverridesForMonth = useCallback(async (mo: MonthOverrides) => {
    const safeMap = settings.force.overridesMap ?? {};
    const updatedForce = { ...settings.force, overridesMap: { ...safeMap, [mo.monthYear]: mo } } as ForceSettings;
    const updated = { ...settings, force: updatedForce } as AppSettings;
    setSettings(updated);
    try {
      await AsyncStorage.setItem('axiom_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save overrides', e);
    }
  }, [settings]);

  const removeOverridesForMonth = useCallback(async (key: string) => {
    const safeMap = settings.force.overridesMap ?? {};
    const clone: Record<string, MonthOverrides> = { ...safeMap };
    delete clone[key];
    const updated = { ...settings, force: { ...settings.force, overridesMap: clone } } as AppSettings;
    setSettings(updated);
    try {
      await AsyncStorage.setItem('axiom_settings', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to remove overrides', e);
    }
  }, [settings]);

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
    getValidForcedDayFor,
    armAndSnap,
    lockForceDay,
    armSnapAndLock,
    cancelForce,
    panic,
    setOverridesForMonth,
    removeOverridesForMonth,
    lastLibraryPick,
    setLastLibraryPick,
  }), [settings, saveSettings, updateForce, isLoading, currentStack, showMagicianPanel, toggleMagicianPanel, peekOverlay, showPeek, forceState, getForcedMonthDate, getValidForcedDayFor, armAndSnap, lockForceDay, armSnapAndLock, cancelForce, panic, setOverridesForMonth, removeOverridesForMonth]);
});
