import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Platform, PanResponder, GestureResponderEvent } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search as SearchIcon, Settings as SettingsIcon } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { getHolidaysMapForMonth, getHolidayColor } from '@/constants/holidays';
import { dateToCard, dateToWeekCard, getFocusWord, startOfWeek } from '@/utils/mapping';

import * as Haptics from 'expo-haptics';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const router = useRouter();
  const { currentStack, settings, showPeek, peekOverlay, forceState, getForcedMonthDate, getValidForcedDayFor, armAndSnap, lockForceDay, cancelForce } = useApp();
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const gridPan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => false,
    onMoveShouldSetPanResponder: (_evt, gestureState) => Math.abs(gestureState.dy) > 20 && (gestureState as any).numberActiveTouches === 2,
    onPanResponderRelease: (evt: GestureResponderEvent, gestureState) => {
      const touches = (evt.nativeEvent as any).touches ?? [];
      if (touches.length === 0) {
        if (gestureState.dy > 30) {
          lockForceDay();
        } else if (gestureState.dy < -30) {
          cancelForce();
        }
      }
    },
  })).current;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const animateToForcedMonth = (targetYear: number, targetMonthIndex: number) => {
    if (animTimer.current) {
      clearInterval(animTimer.current);
      animTimer.current = null;
    }
    const target = new Date(targetYear, targetMonthIndex, 1);
    const duration = settings.force.snapDurationMs;
    const stepMs = 80;
    const steps = Math.max(1, Math.floor(duration / stepMs));
    const curr = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const dir = target > curr ? 1 : -1;
    let iter = 0;
    animTimer.current = setInterval(() => {
      iter += 1;
      const next = new Date(curr.getFullYear(), curr.getMonth() + dir * iter, 1);
      setCurrentDate(next);
      const passed = dir > 0 ? (next.getFullYear() > target.getFullYear() || (next.getFullYear() === target.getFullYear() && next.getMonth() >= target.getMonth())) : (next.getFullYear() < target.getFullYear() || (next.getFullYear() === target.getFullYear() && next.getMonth() <= target.getMonth()));
      if (passed || iter >= steps) {
        setCurrentDate(target);
        if (animTimer.current) {
          clearInterval(animTimer.current);
          animTimer.current = null;
        }
      }
    }, stepMs);
  };

  const handleDayPress = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
    const { week, card } = dateToWeekCard(
      date,
      currentStack,
      settings.weekStandard,
      settings.weekStartDay,
      settings.week53Handling
    );
    if (card) {
      showPeek(card, week);
    }

    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }

    let targetY = year;
    let targetM = month;
    let targetD = day;

    if (settings.force.enabled && forceState.locked && settings.force.forceDayEnabled) {
      const forcedMonth = getForcedMonthDate();
      const inForcedMonth = (year === forcedMonth.year && month === forcedMonth.monthIndex);
      const scopeAny = settings.force.remapScope === 'anyVisible';
      if (scopeAny || inForcedMonth) {
        if (scopeAny && !inForcedMonth) {
          targetY = year;
          targetM = month;
        } else {
          targetY = forcedMonth.year;
          targetM = forcedMonth.monthIndex;
        }
        const valid = getValidForcedDayFor(targetY, targetM);
        if (valid) {
          targetD = valid;
        }
      }
    }
    
    router.push(
      `/day?year=${targetY}&month=${targetM}&day=${targetD}` as any
    );
  };

  const handleHeaderPressIn = () => {
    longPressTimer.current = setTimeout(() => {
      const date = selectedDate ?? new Date(year, month, Math.min(new Date().getDate(), getDaysInMonth(year, month)));
      const { week, card } = dateToWeekCard(
        date,
        currentStack,
        settings.weekStandard,
        settings.weekStartDay,
        settings.week53Handling
      );
      if (card) {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
        showPeek(card, week);
      }
    }, 600);
  };

  const handleHeaderPressOut = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleMonthHeaderLongPress = () => {
    const forced = getForcedMonthDate();
    const ok = armAndSnap();
    if (ok.ok) {
      animateToForcedMonth(forced.year, forced.monthIndex);
    }
  };

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handler = (e: KeyboardEvent) => {
        if (e.repeat) return;
        if (e.key === 'ArrowRight') {
          const ok = armAndSnap();
          if (ok.ok) {
            const forced = getForcedMonthDate();
            animateToForcedMonth(forced.year, forced.monthIndex);
          }
        } else if (e.key === 'ArrowDown') {
          lockForceDay();
        } else if (e.key === 'ArrowLeft') {
          cancelForce();
        }
      };
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }
    return () => {};
  }, [armAndSnap, lockForceDay, cancelForce, getForcedMonthDate]);

  useEffect(() => {
    if (Platform.OS === 'web') return;
    if (!settings.force.enabled) return;
    if (!settings.force.accelerometerEnabled) return;
    let subscription: any = null;
    let faceDownAt: number | null = null;
    let stableSince: number | null = null;

    const start = async () => {
      try {
        const mod = await import('expo-sensors').catch((err) => {
          console.log('[Accel] expo-sensors missing', err);
          return null as any;
        });
        const DeviceMotion: any = (mod as any)?.DeviceMotion ?? null;
        if (!DeviceMotion || !DeviceMotion.addListener) {
          console.log('[Accel] DeviceMotion not available');
          return;
        }
        DeviceMotion.setUpdateInterval(100);
        subscription = DeviceMotion.addListener((data: any) => {
          const g = data?.gravity || data?.accelerationIncludingGravity || data?.acceleration || null;
          const rot = data?.rotation ?? null;
          let pitch = 0;
          if (rot && typeof rot.beta === 'number') {
            pitch = Math.abs(rot.beta * (180 / Math.PI));
          } else if (g && typeof g.z === 'number') {
            const z = g.z;
            pitch = z < 0 ? 180 : 0;
          }
          const nowTs = Date.now();
          const faceDown = pitch >= settings.force.faceDownAngleDeg;
          if (faceDown) {
            if (stableSince === null) stableSince = nowTs;
            if (nowTs - (stableSince ?? nowTs) >= settings.force.stationaryMs) {
              faceDownAt = faceDownAt ?? nowTs;
            }
          } else {
            if (faceDownAt && (nowTs - faceDownAt) <= settings.force.flipWindowMs) {
              const ok = armAndSnap();
              if (ok.ok) {
                const forced = getForcedMonthDate();
                animateToForcedMonth(forced.year, forced.monthIndex);
              }
            }
            faceDownAt = null;
            stableSince = null;
          }
        });
      } catch (e) {
        console.log('[Accel] not available', e);
      }
    };

    start();
    return () => {
      try {
        if (subscription && subscription.remove) subscription.remove();
      } catch {}
      subscription = null;
    };
  }, [settings.force.enabled, settings.force.accelerometerEnabled, settings.force.faceDownAngleDeg, settings.force.stationaryMs, settings.force.flipWindowMs, armAndSnap, getForcedMonthDate]);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const holidaysMap = useMemo(() => {
    if (!settings.holidaysEnabled) return {} as Record<number, string[]>;
    try {
      return getHolidaysMapForMonth(year, month, settings.holidayCountry);
    } catch (e) {
      console.log('[Calendar] holidays error', e);
      return {} as Record<number, string[]>;
    }
  }, [year, month, settings.holidaysEnabled, settings.holidayCountry]);
  
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const today = new Date();
  const isToday = (day: number | null) => {
    if (day === null) return false;
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (day: number | null) => {
    if (day === null || !selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const isInSelectedWeek = (day: number | null) => {
    if (day === null || !selectedDate) return false;
    const cellDate = new Date(year, month, day);
    const startSel = startOfWeek(selectedDate, settings.weekStandard, settings.weekStartDay);
    const endSel = new Date(startSel.getFullYear(), startSel.getMonth(), startSel.getDate() + 6);
    return cellDate >= startSel && cellDate <= endSel;
  };

  const selectedFocusWord = selectedDate ? getFocusWord(selectedDate, settings.seed) : null;

  const screenWidth = Dimensions.get('window').width;
  const daySize = (screenWidth - 48) / 7;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header} testID="calendar-header">
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/settings' as any)}
          testID="open-settings"
        >
          <SettingsIcon size={22} color="#333" />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => router.push('/search' as any)}
            testID="open-search"
          >
            <SearchIcon size={22} color="#333" />
          </TouchableOpacity>
          <View style={[styles.dot, forceState.locked ? styles.dotRed : forceState.snapped ? styles.dotYellow : styles.dotGreen]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} testID="calendar-scroll">
        <TouchableOpacity
          activeOpacity={1}
          delayLongPress={600}
          onLongPress={handleMonthHeaderLongPress}
          onPressIn={handleHeaderPressIn}
          onPressOut={handleHeaderPressOut}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          testID="month-header-touch"
        >
          <View style={styles.monthHeader} testID="month-header">
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthButton} testID="prev-month">
              <ChevronLeft size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthText} testID="month-title">
              {MONTHS[month]} {year}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthButton} testID="next-month">
              <ChevronRight size={28} color="#333" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View style={styles.daysHeader}>
          {DAYS.map((day) => (
            <View key={day} style={[styles.dayHeaderCell, { width: daySize }]} testID={`day-header-${day}`}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        <View style={styles.calendarGrid} {...gridPan.panHandlers}>
          {calendarDays.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayCell,
                { width: daySize, height: daySize },
                isInSelectedWeek(day) && styles.weekCell,
                isToday(day) && styles.todayCell,
                isSelected(day) && styles.selectedCell,
              ]}
              onPress={() => day && handleDayPress(day)}
              disabled={day === null}
              testID={day !== null ? `day-cell-${day}` : undefined}
            >
              {day !== null && (
                <>
                  <Text
                    style={[
                      styles.dayText,
                      isToday(day) && styles.todayText,
                      isSelected(day) && styles.selectedText,
                      (settings.force.tapRemapMode === 'honest' && forceState.locked && year === getForcedMonthDate().year && month === getForcedMonthDate().monthIndex && day === Math.min(Math.max(1, settings.force.forceDay), new Date(year, month + 1, 0).getDate())) && styles.hintDayText,
                    ]}
                  >
                    {day}
                  </Text>
                  {settings.rehearsalMode && (
                    <Text style={styles.rehearsalText}>
                      {dateToCard(
                        new Date(year, month, day),
                        currentStack,
                        settings.seed,
                        settings.weekStandard,
                        settings.weekStartDay,
                        settings.week53Handling
                      )?.label}
                    </Text>
                  )}
                  {settings.holidaysEnabled && holidaysMap[day] && holidaysMap[day].length > 0 && (
                    <View style={styles.holidayBarsContainer} pointerEvents="none">
                      {holidaysMap[day].slice(0, 4).map((h, idx) => (
                        <View
                          key={`${day}-h-${idx}`}
                          style={[styles.holidayBarSegment, { backgroundColor: getHolidayColor(h), marginTop: idx === 0 ? 0 : 2 }]}
                          testID={`holiday-bar-${day}-${idx}`}
                        />
                      ))}
                    </View>
                  )}
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedFocusWord && (
          <View style={styles.focusBar} testID="focus-bar">
            <Text style={styles.focusLabel}>Focus</Text>
            <Text style={styles.focusWord}>{selectedFocusWord}</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.astrologyButton}
          onPress={() => router.push('/astrology' as any)}
          testID="astrology-button"
        >
          <Text style={styles.astrologyButtonText}>View Astrology</Text>
        </TouchableOpacity>
      </ScrollView>

      {peekOverlay.visible && peekOverlay.card && (
        <View style={styles.peekOverlay} pointerEvents="none" testID="peek-overlay">
          <View style={styles.peekCard}>
            <Text style={styles.peekText}>
              Week {peekOverlay.weekNumber ?? peekOverlay.card.position} → {peekOverlay.card.label}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    backgroundColor: '#FAFAFA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    letterSpacing: 0.3,
  },
  daysHeader: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  dayHeaderCell: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 24,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 12,
  },
  weekCell: {
    backgroundColor: '#F1F8FF',
  },
  todayCell: {
    backgroundColor: '#E8F5FF',
  },
  selectedCell: {
    backgroundColor: '#007AFF',
  },
  dayText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  holidayBarsContainer: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 6,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  holidayBarSegment: {
    height: 3,
    borderRadius: 2,
  },
  rehearsalText: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
  },
  focusBar: {
    marginHorizontal: 24,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  focusLabel: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  focusWord: {
    fontSize: 18,
    color: '#111',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  astrologyButton: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 32,
    padding: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  astrologyButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  peekOverlay: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'none',
  },
  peekCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  peekText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
    alignSelf: 'center',
  },
  dotGreen: { backgroundColor: '#19C37D' },
  dotYellow: { backgroundColor: '#F5A524' },
  dotRed: { backgroundColor: '#F31260' },
  hintDayText: { fontWeight: '700' },
});
