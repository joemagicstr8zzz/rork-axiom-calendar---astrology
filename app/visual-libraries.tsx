import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, OverrideItemType } from '@/contexts/AppContext';
import {
  CATALOGS_BY_TYPE,
  CatalogItem,
} from '@/constants/catalogs';

const TYPE_ORDER: OverrideItemType[] = ['Card','ESP','Color','Number','Word','Zodiac','Birthstone','Element','Planet','Pi','Rune','IChing','Constellation','Note'];

function typeHasCatalog(t: OverrideItemType) {
  const cat = (CATALOGS_BY_TYPE as any)[t] as CatalogItem[] | undefined;
  return !!cat && cat.length > 0;
}

function ItemPreview({ type, item }: { type: OverrideItemType; item: CatalogItem }) {
  const swatchSize = 52;
  return (
    <View style={styles.previewInner}>
      {type === 'Color' && item.color ? (
        <View style={{ width: swatchSize, height: swatchSize, borderRadius: 12, backgroundColor: String(item.color), borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 }} />
      ) : null}
      {item.emoji ? <Text style={styles.emoji}>{item.emoji}</Text> : null}
      <Text style={styles.itemLabel} numberOfLines={1}>{item.label}</Text>
    </View>
  );
}

export default function VisualLibrariesScreen() {
  const insets = useSafeAreaInsets();
  const { setLastLibraryPick } = useApp();
  const params = useLocalSearchParams();
  const initialTypeParam = typeof params.type === 'string' ? (params.type as OverrideItemType) : undefined;

  const [currentType, setCurrentType] = useState<OverrideItemType>(initialTypeParam && TYPE_ORDER.includes(initialTypeParam) ? initialTypeParam : 'Card');

  const typeOptions = useMemo(() => TYPE_ORDER.filter((t) => t !== 'Word' && t !== 'Note'), []);

  const catalog = useMemo(() => {
    return (CATALOGS_BY_TYPE as any)[currentType] as CatalogItem[] | undefined;
  }, [currentType]);

  const onUse = useCallback((ci: CatalogItem) => {
    console.log('[VisualLibraries] pick', currentType, ci);
    setLastLibraryPick({ type: currentType, id: ci.id, label: ci.label, value: ci.value, color: ci.color, emoji: ci.emoji });
    router.back();
  }, [currentType, setLastLibraryPick]);

  const screenW = Dimensions.get('window').width;
  const isWide = screenW >= 480;
  const columnWidth = isWide ? (screenW - 16*2 - 12) / 2 : (screenW - 16*2);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: 'Visual Libraries', headerShadowVisible: false }} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 12) }}>
        <View style={styles.segmentBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 8 }}>
            {typeOptions.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setCurrentType(t)}
                style={[styles.segmentChip, currentType === t && styles.segmentChipActive]}
                testID={`vl-type-${t}`}
              >
                <Text style={[styles.segmentText, currentType === t && { color: '#fff' }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.grid}>
          {(catalog ?? []).map((ci) => (
            <View key={ci.id} style={[styles.card, { width: columnWidth }]}> 
              <ItemPreview type={currentType} item={ci} />
              <TouchableOpacity
                onPress={() => onUse(ci)}
                style={styles.useBtn}
                testID={`use-${currentType}-${ci.id}`}
              >
                <Text style={styles.useText}>Use in Overrides</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  segmentBar: { backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EFEFEF' },
  segmentChip: { backgroundColor: '#EFEFEF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, marginRight: 8 },
  segmentChipActive: { backgroundColor: '#007AFF' },
  segmentText: { fontWeight: '800', color: '#111' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2 },
  previewInner: { alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  emoji: { fontSize: 28, marginBottom: 6 },
  itemLabel: { fontSize: 16, fontWeight: '800', color: '#111' },
  useBtn: { backgroundColor: '#111', paddingVertical: Platform.OS === 'web' ? 10 : 8, borderRadius: 999, alignItems: 'center' },
  useText: { color: '#fff', fontWeight: '800' },
});
