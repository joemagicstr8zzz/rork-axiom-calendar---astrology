import { View, Text, StyleSheet, ScrollView, TouchableOpacity, PanResponder, GestureResponderEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useApp, EventItem } from '@/contexts/AppContext';
import { getHolidaysMapForMonth } from '@/constants/holidays';
import { dateToWeekCard, getFocusWord, weekNumberToRange } from '@/utils/mapping';
import { getZodiacSign } from '@/constants/zodiac';

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DayDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { year, month, day } = useLocalSearchParams<{
    year: string;
    month: string;
    day: string;
  }>();
  const { currentStack, settings, showPeek, peekOverlay, eventsByDate } = useApp();

  const date = new Date(parseInt(year, 10), parseInt(month, 10), parseInt(day, 10));
  const zodiacSign = getZodiacSign(date.getMonth() + 1, date.getDate());
  const focusWord = getFocusWord(date, settings.seed);
  const { week, card } = dateToWeekCard(
    date,
    currentStack,
    settings.weekStandard,
    settings.weekStartDay,
    settings.week53Handling
  );
  const range = weekNumberToRange(date.getFullYear(), Math.min(week, 52), settings.weekStandard, settings.weekStartDay);

  const headerPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      const touches = (evt.nativeEvent as any).touches ?? [];
      if (touches.length === 2 && card) {
        showPeek(card, week);
      }
    },
    onPanResponderRelease: () => {},
    onPanResponderTerminationRequest: () => true,
  });

  const handleTwoFingerTap = () => {
    if (card) {
      showPeek(card, week);
    }
  };

  const holidaysForDay = settings.holidaysEnabled ? (getHolidaysMapForMonth(date.getFullYear(), date.getMonth(), settings.holidayCountry)[date.getDate()] ?? []) : [];

  const monthKey = `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;
  const dayOverride = settings.force.overridesEnabled ? settings.force.overridesMap[monthKey]?.days.find(d => d.day === date.getDate()) : undefined;

  const ymd = `${date.getFullYear()}-${`${date.getMonth()+1}`.padStart(2,'0')}-${`${date.getDate()}`.padStart(2,'0')}`;
  const todaysEvents = eventsByDate(ymd);

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: '',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} testID="day-scroll">
        <TouchableOpacity
          activeOpacity={1}
          onPress={handleTwoFingerTap}
          {...headerPanResponder.panHandlers}
          testID="day-header-touch"
        >
          <View style={styles.header} testID="day-header">
            <Text style={styles.dayNumber}>{day}</Text>
            <Text style={styles.weekday}>{WEEKDAYS[date.getDay()]}</Text>
            <Text style={styles.dateText}>
              {date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </Text>
            <Text style={styles.weekRange}>
              Week of {range.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              —{range.end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.compactHeaderRow} testID="day-compact-row">
          <View style={styles.focusInline} testID="focus-inline">
            <Text style={styles.focusInlineLabel}>Focus</Text>
            <Text style={styles.focusInlineWord}>{focusWord}</Text>
          </View>
          <View style={styles.astroBadge} testID="astro-badge">
            <Text style={styles.astroSymbol}>{zodiacSign.symbol}</Text>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.astroName}>{zodiacSign.name}</Text>
              <Text style={styles.astroDates}>{zodiacSign.element}</Text>
            </View>
          </View>
        </View>

        <View style={styles.readingCard}>
          <Text style={styles.readingTitle}>Daily Reading</Text>
          <Text style={styles.readingText}>{zodiacSign.reading}</Text>
        </View>

        {holidaysForDay.length > 0 && (
          <View style={styles.holidayCard}>
            <Text style={styles.holidayTitle}>Holiday</Text>
            {holidaysForDay.map((h, i) => (
              <Text key={`${h}-${i}`} style={styles.holidayText}>{h}</Text>
            ))}
          </View>
        )}

        {dayOverride && (
          <View style={styles.overrideCard}>
            <Text style={styles.overrideTitle}>Curated Item</Text>
            {dayOverride.publicLabel ? (
              <Text style={styles.overridePublic}>{dayOverride.publicLabel}</Text>
            ) : null}
            {dayOverride.items.length > 0 && (
              <View style={styles.overrideItemsRow}>
                {dayOverride.items.map((it, idx) => (
                  <View key={`${idx}`} style={styles.overrideChip}>
                    <Text style={styles.overrideChipText}>{String(it.value)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Events list */}
        {todaysEvents.length > 0 && (
          <View style={styles.eventsSection}>
            {todaysEvents.map((ev) => (
              <TouchableOpacity key={ev.id} style={styles.eventCard} onPress={() => router.push({ pathname: '/event-detail', params: { id: ev.id } } as any)} testID={`event-${ev.id}`}>
                <Text style={styles.eventTitle}>{ev.title || (ev.type === 'quote' ? 'Quote of the Day' : 'Event')}</Text>
                <Text style={styles.eventSubtitle}>{ev.allDay ? 'All day' : `${ev.startTime ?? ''}${ev.endTime ? ` → ${ev.endTime}` : ''}`}</Text>
                {ev.notes ? (
                  <Text numberOfLines={4} style={styles.eventBody}>{ev.notes}</Text>
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {settings.rehearsalMode && card && (
          <View style={styles.rehearsalCard}>
            <Text style={styles.rehearsalLabel}>Rehearsal Mode</Text>
            <Text style={styles.rehearsalValue}>
              Week {week} → {card.label}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.signButton}
          onPress={() => router.push(`/sign?signName=${zodiacSign.name}` as any)}
        >
          <Text style={styles.signButtonText}>View {zodiacSign.name} Details</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={[styles.addBarWrapper, { bottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity style={styles.addBar} onPress={() => router.push({ pathname: '/event-editor', params: { date: ymd, type: 'quote' } } as any)} testID="add-event">
          <Text style={styles.addBarText}>Add event on {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.plusButton} onPress={() => router.push({ pathname: '/event-editor', params: { date: ymd, type: 'quote' } } as any)} testID="fab-add">
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 22, lineHeight: 22 }}>+</Text>
        </TouchableOpacity>
      </View>

      {peekOverlay.visible && peekOverlay.card && (
        <View style={styles.peekOverlay} pointerEvents="none" testID="peek-overlay">
          <View style={styles.peekCard}>
            <Text style={styles.peekText}>
              Week {peekOverlay.weekNumber ?? week} → {peekOverlay.card.label}
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
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
  },
  dayNumber: {
    fontSize: 64,
    fontWeight: '700',
    color: '#111',
    letterSpacing: -2,
  },
  weekday: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  dateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  weekRange: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  compactHeaderRow: {
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12 as unknown as number,
  },
  focusInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  focusInlineLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginRight: 8,
    letterSpacing: 0.3,
  },
  focusInlineWord: {
    fontSize: 16,
    color: '#111',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  astroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  astroSymbol: { fontSize: 22 },
  astroName: { fontSize: 14, fontWeight: '700', color: '#111', letterSpacing: 0.3 },
  astroDates: { fontSize: 12, color: '#999', letterSpacing: 0.3 },
  readingCard: {
    marginHorizontal: 24,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  readingTitle: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  readingText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    letterSpacing: 0.3,
  },
  holidayCard: {
    marginHorizontal: 24,
    padding: 12,
    backgroundColor: '#FFF5F5',
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  overrideCard: {
    marginHorizontal: 24,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  overrideTitle: {
    fontSize: 11,
    color: '#999',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  overridePublic: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
  },
  overrideItemsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  overrideChip: {
    backgroundColor: '#F1F8FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  overrideChipText: {
    color: '#007AFF',
    fontWeight: '700',
  },
  holidayTitle: {
    fontSize: 11,
    color: '#B00020',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  holidayText: {
    fontSize: 14,
    color: '#8E0000',
    fontWeight: '600',
    marginTop: 2,
  },
  rehearsalCard: {
    marginHorizontal: 24,
    padding: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 16,
    marginBottom: 12,
  },
  rehearsalLabel: {
    fontSize: 11,
    color: '#856404',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rehearsalValue: {
    fontSize: 14,
    color: '#856404',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  signButton: {
    marginHorizontal: 24,
    marginBottom: 100,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  signButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  eventsSection: { marginHorizontal: 24, marginBottom: 12 },
  eventCard: { backgroundColor: '#E6F0FA', borderRadius: 16, padding: 14 },
  eventTitle: { color: '#C6B88E', fontWeight: '800', fontSize: 16 },
  eventSubtitle: { color: '#C6B88E', marginTop: 2, marginBottom: 6 },
  eventBody: { color: '#111', lineHeight: 20 },
  addBarWrapper: { position: 'absolute', left: 0, right: 0, bottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' },
  addBar: { flex: 1, backgroundColor: '#3C484F', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 28, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#E6DDB3' },
  addBarText: { color: '#E6DDB3', fontWeight: '700' },
  plusButton: { marginLeft: 12, width: 56, height: 56, borderRadius: 12, backgroundColor: '#141414', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#222', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 4 },
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
});
