import { Stack, useLocalSearchParams, router } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Share, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';

export default function EventDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { events, deleteEvent } = useApp();
  const ev = events.find(e => e.id === id);
  if (!ev) {
    return (
      <View style={[styles.container, { paddingTop: insets.top, alignItems: 'center', justifyContent: 'center' }]}> 
        <Stack.Screen options={{ title: 'Event', headerShadowVisible: false }} />
        <Text style={{ color: '#111' }}>Event not found</Text>
      </View>
    );
  }

  const dateStr = new Date(ev.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: '', headerShadowVisible: false }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 12) }}>
        <View style={styles.card}>
          <Text style={styles.title}>{ev.title}</Text>
          <View style={styles.row}><Text style={styles.muted}>{dateStr}</Text><Text style={styles.muted}>{ev.allDay ? 'All day' : `${ev.startTime ?? ''}${ev.endTime ? ` → ${ev.endTime}` : ''}`}</Text></View>
          <View style={styles.row}><Text style={styles.muted}>My calendars</Text></View>
          {ev.notes ? <Text style={styles.body}>{ev.notes}</Text> : null}
        </View>
      </ScrollView>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.action} onPress={() => router.push({ pathname: '/event-editor', params: { id: ev.id } } as any)}><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={async () => { try { await Share.share({ message: `${ev.title}\n${ev.notes}` }); } catch {} }}><Text style={styles.actionText}>Share</Text></TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={async () => { await deleteEvent(ev.id); router.back(); }}><Text style={styles.actionText}>Delete</Text></TouchableOpacity>
        <TouchableOpacity style={styles.action} onPress={() => router.back()}><Text style={styles.actionText}>More</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  card: { backgroundColor: '#2F3A3F', margin: 16, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#3E4A50' },
  title: { color: '#E6DDB3', fontSize: 22, fontWeight: '800', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  muted: { color: '#C6B88E' },
  body: { color: '#EDEAE0', marginTop: 8, lineHeight: 22 },
  actionRow: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#EEE', backgroundColor: '#FAFAFA', padding: 8, justifyContent: 'space-around' },
  action: { paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#111', borderRadius: 12 },
  actionText: { color: '#fff', fontWeight: '800' },
});