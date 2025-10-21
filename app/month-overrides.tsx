import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, DayOverride, ItemMapping, MonthOverrides, OverrideItemType } from '@/contexts/AppContext';

function ymKey(y: number, m: number) {
  const mm = `${m + 1}`.padStart(2, '0');
  return `${y}-${mm}`;
}

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export default function MonthOverridesEditorScreen() {
  const insets = useSafeAreaInsets();
  const { settings, setOverridesForMonth, removeOverridesForMonth } = useApp();

  const now = new Date();
  const [year, setYear] = useState<number>(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState<number>(now.getMonth());

  const key = ymKey(year, monthIndex);
  const existing = settings.force.overridesMap[key];
  const [local, setLocal] = useState<MonthOverrides | null>(existing ?? null);

  useEffect(() => {
    setLocal(settings.force.overridesMap[key] ?? null);
  }, [key, settings.force.overridesMap]);

  const ensureLocal = () => {
    if (local) return local;
    const count = daysInMonth(year, monthIndex);
    const days: DayOverride[] = Array.from({ length: count }).map((_, i) => ({
      day: i + 1,
      publicLabel: '',
      items: [{ type: 'Card', value: '' } as ItemMapping],
      defaultIndex: 1,
    }));
    const mo: MonthOverrides = { monthYear: key, days };
    setLocal(mo);
    return mo;
  };

  const applyDayCount = () => {
    const count = daysInMonth(year, monthIndex);
    const base = ensureLocal();
    let days = base.days;
    if (days.length < count) {
      const add: DayOverride[] = Array.from({ length: count - days.length }).map((_, idx) => ({
        day: days.length + idx + 1,
        publicLabel: '',
        items: [{ type: 'Card', value: '' }],
        defaultIndex: 1,
      }));
      days = [...days, ...add];
    } else if (days.length > count) {
      days = days.slice(0, count);
    }
    setLocal({ monthYear: key, days });
  };

  useEffect(() => {
    applyDayCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, monthIndex]);

  const save = async () => {
    if (!local) return;
    await setOverridesForMonth(local);
    router.back();
  };

  const clearMonth = async () => {
    if (!existing) return;
    if (Platform.OS === 'web') {
      const ok = typeof window !== 'undefined' ? window.confirm('Remove all overrides for this month?') : false;
      if (ok) {
        await removeOverridesForMonth(key);
        setLocal(null);
      }
      return;
    }
    Alert.alert('Remove overrides?', 'This will delete all overrides for this month.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: async () => {
        await removeOverridesForMonth(key);
        setLocal(null);
      } },
    ]);
  };

  const typeOptions: OverrideItemType[] = ['Card','ESP','Color','Number','Word','Zodiac','Birthstone','Element','Planet','Pi','Rune','IChing','Constellation','Note'];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: 'Month Overrides', headerStyle: { backgroundColor: '#FAFAFA' }, headerShadowVisible: false, headerRight: () => (
        <TouchableOpacity onPress={save} style={styles.saveBtn} testID="save-overrides">
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ) }} />

      <View style={styles.toolbar}>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setYear(year - 1)} style={styles.chip}><Text style={styles.chipText}>−Year</Text></TouchableOpacity>
          <Text style={styles.title}>{year}</Text>
          <TouchableOpacity onPress={() => setYear(year + 1)} style={styles.chip}><Text style={styles.chipText}>+Year</Text></TouchableOpacity>
        </View>
        <View style={styles.row}>
          <TouchableOpacity onPress={() => setMonthIndex(Math.max(0, monthIndex - 1))} style={styles.chip}><Text style={styles.chipText}>−Month</Text></TouchableOpacity>
          <Text style={styles.subTitle}>{new Date(year, monthIndex, 1).toLocaleDateString('en-US', { month: 'long' })}</Text>
          <TouchableOpacity onPress={() => setMonthIndex(Math.min(11, monthIndex + 1))} style={styles.chip}><Text style={styles.chipText}>+Month</Text></TouchableOpacity>
        </View>
        {existing && (
          <TouchableOpacity onPress={clearMonth} style={[styles.chip, { backgroundColor: '#FFE8E8' }]}>
            <Text style={[styles.chipText, { color: '#8E0000' }]}>Remove overrides for {key}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 12) }} showsVerticalScrollIndicator={false}>
        {local && local.days.map((d) => (
          <View key={d.day} style={styles.card}>
            <View style={styles.dayHeader}>
              <Text style={styles.dayTitle}>Day {d.day}</Text>
              <TextInput
                style={styles.input}
                placeholder="Public label (optional)"
                placeholderTextColor="#999"
                value={d.publicLabel}
                onChangeText={(t) => {
                  const next = { ...local } as MonthOverrides;
                  next.days = next.days.map(dd => dd.day === d.day ? { ...dd, publicLabel: t } : dd);
                  setLocal(next);
                }}
              />
            </View>
            <View style={styles.itemRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {typeOptions.map((t) => (
                  <TouchableOpacity key={`${d.day}-${t}`} onPress={() => {
                    const next = { ...local } as MonthOverrides;
                    const cur = next.days.find(dd => dd.day === d.day)!;
                    cur.items = [{ type: t, value: cur.items[0]?.value ?? '' }];
                    setLocal({ ...next });
                  }} style={[styles.typeChip, (local.days.find(dd => dd.day === d.day)?.items[0]?.type === t) && styles.typeChipActive]}>
                    <Text style={[styles.typeText, (local.days.find(dd => dd.day === d.day)?.items[0]?.type === t) && { color: '#fff' }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Value (e.g., 7H, Blue, 37)"
                placeholderTextColor="#999"
                value={String(local.days.find(dd => dd.day === d.day)?.items[0]?.value ?? '')}
                onChangeText={(t) => {
                  const next = { ...local } as MonthOverrides;
                  const cur = next.days.find(dd => dd.day === d.day)!;
                  cur.items = [{ ...cur.items[0], value: t ?? '' }];
                  setLocal({ ...next });
                }}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  toolbar: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8, gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '800', color: '#111' },
  subTitle: { fontSize: 16, fontWeight: '700', color: '#333' },
  chip: { backgroundColor: '#EFEFEF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  chipText: { color: '#111', fontWeight: '700' },
  card: { backgroundColor: '#fff', marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  dayTitle: { fontSize: 16, fontWeight: '800', color: '#111' },
  input: { flex: 1, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 10, paddingHorizontal: 10, paddingVertical: Platform.OS === 'web' ? 10 : 8, backgroundColor: '#fff', marginLeft: 10 },
  itemRow: { gap: 8 },
  typeChip: { backgroundColor: '#EFEFEF', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  typeChipActive: { backgroundColor: '#007AFF' },
  typeText: { color: '#111', fontSize: 12, fontWeight: '700' },
  saveBtn: { backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  saveText: { color: '#fff', fontWeight: '800' },
});