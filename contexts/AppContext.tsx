import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { StackCard, StackType, getStackByType } from '@/constants/stacks';

export type WeekStandard = 'iso' | 'us' | 'custom';
export type Week53Handling = 'joker' | 'merge52' | 'wrap1';

interface AppSettings {
  stackType: StackType;
  customStack: StackCard[];
  seed: number;
  peekEnabled: boolean;
  rehearsalMode: boolean;
  weekStandard: WeekStandard;
  weekStartDay: number;
  week53Handling: Week53Handling;
}

const DEFAULT_SETTINGS: AppSettings = {
  stackType: 'mnemonica',
  customStack: [],
  seed: 12345,
  peekEnabled: true,
  rehearsalMode: false,
  weekStandard: 'iso',
  weekStartDay: 1,
  week53Handling: 'merge52',
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
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await AsyncStorage.setItem('axiom_settings', JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
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

  return useMemo(() => ({
    settings,
    saveSettings,
    isLoading,
    currentStack,
    showMagicianPanel,
    setShowMagicianPanel,
    toggleMagicianPanel,
    peekOverlay,
    showPeek,
  }), [settings, saveSettings, isLoading, currentStack, showMagicianPanel, toggleMagicianPanel, peekOverlay, showPeek]);
});
