import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, PanResponder, PanResponderInstance, Animated, Platform, Alert, TextInput } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '@/contexts/AppContext';
import { StackCard } from '@/constants/stacks';
import { GripVertical, Save, Plus, Trash2, Copy, ChevronLeft, Edit3 } from 'lucide-react-native';

interface SavedStack {
  id: string;
  name: string;
  cards: StackCard[];
}

const SUIT_COLORS: Record<string, string> = { C: '#0A7', S: '#111', H: '#D33', D: '#E65100' };

function newDeckOrder(): StackCard[] {
  const suits = ['C', 'H', 'S', 'D'] as const;
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'] as const;
  const cards: StackCard[] = [];
  let pos = 1;
  for (const s of suits) {
    for (const v of values) {
      const label = `${v}${s}`;
      cards.push({ position: pos, label, value: v, suit: s });
      pos += 1;
    }
  }
  return cards;
}

export default function StackEditorScreen() {
  const insets = useSafeAreaInsets();
  const { settings, saveSettings } = useApp();

  const [stacks, setStacks] = useState<SavedStack[]>([]);
  const [activeId, setActiveId] = useState<string | null>(settings.selectedCustomStackId ?? null);
  const [editingCards, setEditingCards] = useState<StackCard[]>(settings.customStack.length ? settings.customStack : newDeckOrder());
  const [editingName, setEditingName] = useState<string>('Custom Stack');
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const listRef = useRef<FlatList<StackCard>>(null);
  const dragResponder = useRef<PanResponderInstance | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('axiom_saved_stacks');
        if (raw) {
          const parsed = JSON.parse(raw) as SavedStack[];
          setStacks(parsed);
          if (settings.selectedCustomStackId) {
            const found = parsed.find(s => s.id === settings.selectedCustomStackId);
            if (found) {
              setActiveId(found.id);
              setEditingName(found.name);
              setEditingCards(found.cards);
            }
          }
        }
      } catch (e) {
        console.error('[StackEditor] Failed to load stacks', e);
      }
    })();
  }, [settings.selectedCustomStackId]);

  useEffect(() => {
    dragResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => draggingIndex !== null,
      onPanResponderMove: Animated.event([
        null,
        { dy: pan.y },
      ], { useNativeDriver: false }),
      onPanResponderRelease: () => {
        finalizeDrag();
      },
      onPanResponderTerminate: () => finalizeDrag(),
    });
  }, [draggingIndex]);

  const startDrag = useCallback((index: number) => {
    setDraggingIndex(index);
    pan.setValue({ x: 0, y: 0 });
  }, [pan]);

  const finalizeDrag = useCallback(() => {
    if (draggingIndex === null) return;
    const itemHeight = 56;
    const movedBy = (pan.y as any)._value as number;
    const offset = Math.round(movedBy / itemHeight);
    let newIndex = draggingIndex + offset;
    newIndex = Math.max(0, Math.min(editingCards.length - 1, newIndex));
    if (newIndex !== draggingIndex) {
      const updated = [...editingCards];
      const [moved] = updated.splice(draggingIndex, 1);
      updated.splice(newIndex, 0, moved);
      const reindexed = updated.map((c, i) => ({ ...c, position: i + 1 }));
      setEditingCards(reindexed);
    }
    setDraggingIndex(null);
    pan.setValue({ x: 0, y: 0 });
  }, [draggingIndex, editingCards, pan]);

  const persistStacks = useCallback(async (list: SavedStack[]) => {
    setStacks(list);
    try {
      await AsyncStorage.setItem('axiom_saved_stacks', JSON.stringify(list));
    } catch (e) {
      console.error('[StackEditor] Failed to save stacks', e);
    }
  }, []);

  const handleAddNew = () => {
    const id = `stack_${Date.now()}`;
    const name = `New Stack`;
    const cards = newDeckOrder();
    const next: SavedStack = { id, name, cards };
    const updated = [next, ...stacks];
    persistStacks(updated);
    setActiveId(id);
    setEditingName(name);
    setEditingCards(cards);
  };

  const handleDuplicate = () => {
    const id = `stack_${Date.now()}`;
    const name = `${editingName} Copy`;
    const cards = editingCards.map((c, i) => ({ ...c, position: i + 1 }));
    const next: SavedStack = { id, name, cards };
    const updated = [next, ...stacks];
    persistStacks(updated);
    setActiveId(id);
    setEditingName(name);
  };

  const handleDelete = () => {
    if (!activeId) return;
    Alert.alert('Delete stack?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => {
        const updated = stacks.filter(s => s.id !== activeId);
        persistStacks(updated);
        setActiveId(null);
        setEditingName('Custom Stack');
        setEditingCards(newDeckOrder());
      }},
    ]);
  };

  const handleSave = async () => {
    const sanitized = editingCards.map((c, i) => ({ ...c, position: i + 1 }));
    if (activeId) {
      const updated = stacks.map(s => s.id === activeId ? { ...s, name: editingName, cards: sanitized } : s);
      await persistStacks(updated);
    } else {
      const id = `stack_${Date.now()}`;
      const next: SavedStack = { id, name: editingName, cards: sanitized };
      await persistStacks([next, ...stacks]);
      setActiveId(id);
    }
    await saveSettings({ stackType: 'custom', customStack: sanitized, selectedCustomStackId: activeId ?? null });
    router.back();
  };

  const loadSelected = (id: string) => {
    const found = stacks.find(s => s.id === id);
    if (!found) return;
    setActiveId(found.id);
    setEditingName(found.name);
    setEditingCards(found.cards.map((c, i) => ({ ...c, position: i + 1 })));
  };

  const renderItem = ({ item, index }: { item: StackCard; index: number }) => {
    const isDragging = draggingIndex === index;
    return (
      <View style={styles.rowContainer}>
        <View style={[styles.row, isDragging && { opacity: 0.2 }]}>
          <View style={styles.left}>
            <Text style={styles.position}>{index + 1}</Text>
            <View style={[styles.cardBadge, { borderColor: SUIT_COLORS[item.suit] ?? '#999' }]}> 
              <Text style={[styles.cardLabel, { color: SUIT_COLORS[item.suit] ?? '#333' }]}>{item.label}</Text>
            </View>
          </View>
          <TouchableOpacity
            testID={`drag-${index}`}
            accessibilityRole="button"
            onLongPress={() => startDrag(index)}
            style={styles.dragHandle}
          >
            <GripVertical color="#666" size={20} />
          </TouchableOpacity>
        </View>
        {isDragging && (
          <Animated.View style={[styles.dragOverlay, { transform: [{ translateY: pan.y }] }]} {...(dragResponder.current ? dragResponder.current.panHandlers : {})}>
            <View style={[styles.row, styles.draggingRow]}> 
              <View style={styles.left}>
                <Text style={styles.position}>{index + 1}</Text>
                <View style={[styles.cardBadge, { borderColor: SUIT_COLORS[item.suit] ?? '#999', backgroundColor: '#FFF' }]}> 
                  <Text style={[styles.cardLabel, { color: SUIT_COLORS[item.suit] ?? '#333' }]}>{item.label}</Text>
                </View>
              </View>
              <View style={styles.dragHandle}>
                <GripVertical color="#222" size={20} />
              </View>
            </View>
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: 'Custom Stack', headerLeft: () => (
        <TouchableOpacity onPress={() => router.back()} style={{ paddingHorizontal: 12 }}>
          <ChevronLeft color="#111" />
        </TouchableOpacity>
      ), headerRight: () => (
        <TouchableOpacity onPress={handleSave} testID="save-stack" style={styles.saveBtn}>
          <Save color="#fff" size={16} />
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      ), headerStyle: { backgroundColor: '#FAFAFA' }, headerShadowVisible: false }} />

      <View style={styles.toolbar}>
        <View style={styles.stackPickerRow}>
          <TextInput
            style={styles.nameInput}
            value={editingName}
            onChangeText={setEditingName}
            placeholder="Stack name"
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={handleAddNew} style={styles.iconButton} testID="add-stack">
            <Plus color="#111" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDuplicate} style={styles.iconButton} testID="dup-stack">
            <Copy color="#111" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={styles.iconButton} testID="del-stack">
            <Trash2 color="#C00" />
          </TouchableOpacity>
        </View>

        {stacks.length > 0 && (
          <View style={styles.savedList}>
            <Text style={styles.savedTitle}>Saved stacks</Text>
            <View style={styles.savedChips}>
              {stacks.map(s => (
                <TouchableOpacity key={s.id} onPress={() => loadSelected(s.id)} style={[styles.chip, activeId === s.id && styles.chipActive]}>
                  <Edit3 size={14} color={activeId === s.id ? '#fff' : '#111'} />
                  <Text style={[styles.chipText, activeId === s.id && { color: '#fff' }]}>{s.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={editingCards}
        keyExtractor={(it) => `${it.label}-${it.position}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: Math.max(32, insets.bottom + 12) }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({ length: 56, offset: 56 * index, index })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  toolbar: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 8 },
  stackPickerRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  nameInput: { flex: 1, borderWidth: 1, borderColor: '#E6E6E6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === 'web' ? 10 : 8, backgroundColor: '#fff' },
  iconButton: { padding: 8, borderRadius: 10, backgroundColor: '#EFEFEF' },
  savedList: { marginTop: 8 },
  savedTitle: { fontSize: 12, color: '#777', marginBottom: 6, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5 },
  savedChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#EFEFEF' },
  chipActive: { backgroundColor: '#007AFF' },
  chipText: { color: '#111', fontSize: 13, fontWeight: '600' },
  rowContainer: { height: 56, justifyContent: 'center' },
  row: { height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  draggingRow: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 6, backgroundColor: '#FFF', borderRadius: 12 },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  position: { width: 28, textAlign: 'center', fontWeight: '700', color: '#666' },
  cardBadge: { borderWidth: 2, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#FAFAFA' },
  cardLabel: { fontWeight: '800', fontSize: 16, letterSpacing: 0.5 },
  dragHandle: { padding: 8, borderRadius: 10, backgroundColor: '#F3F3F3' },
  dragOverlay: { position: 'absolute', left: 12, right: 12 },
  saveBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#111', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999 },
  saveText: { color: '#fff', fontWeight: '700' },
});
