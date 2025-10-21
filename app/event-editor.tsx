import { Stack, useLocalSearchParams, router } from 'expo-router';
import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Switch, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp, EventItem } from '@/contexts/AppContext';

function toYmd(d: Date): string { return `${d.getFullYear()}-${`${d.getMonth()+1}`.padStart(2,'0')}-${`${d.getDate()}`.padStart(2,'0')}`; }

export default function EventEditor() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ date?: string; type?: string; id?: string }>();
  const { settings, events, addOrUpdateEvent } = useApp();

  const existing = typeof params.id === 'string' ? events.find(e => e.id === params.id) : undefined;
  const initialDate = useMemo(() => {
    if (existing) return existing.date;
    if (typeof params.date === 'string' && params.date.length === 10) return params.date;
    const base = new Date();
    if (settings.quote.quoteDayDefault === 'tomorrow') {
      base.setDate(base.getDate() + 1);
    } else if (settings.quote.quoteDayDefault === 'pick' && settings.quote.quoteDayPickDate) {
      return settings.quote.quoteDayPickDate;
    }
    return toYmd(base);
  }, [existing, params.date, settings.quote.quoteDayDefault, settings.quote.quoteDayPickDate]);

  const [title, setTitle] = useState<string>(existing?.title ?? (params.type === 'quote' ? 'Quote of the Day' : ''));
  const [date, setDate] = useState<string>(initialDate);
  const [allDay, setAllDay] = useState<boolean>(existing?.allDay ?? true);
  const [startTime, setStartTime] = useState<string>(existing?.startTime ?? '08:00');
  const [endTime, setEndTime] = useState<string>(existing?.endTime ?? '09:00');
  const [location, setLocation] = useState<string>(existing?.location ?? '');
  const [calendarId, setCalendarId] = useState<string>(existing?.calendarId ?? 'axiom');
  const [reminderMinutes, setReminderMinutes] = useState<string>(existing?.reminderMinutes != null ? String(existing.reminderMinutes) : '10');
  const [repeat, setRepeat] = useState<'none'|'daily'|'weekly'|'monthly'|'yearly'>(existing?.repeat ?? 'none');
  const [notes, setNotes] = useState<string>(existing?.notes ?? '');
  const [attachmentUrl, setAttachmentUrl] = useState<string>(existing?.attachmentUrl ?? '');
  const [tz] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [type, setType] = useState<'quote'|'regular'>(existing?.type ?? (params.type === 'quote' ? 'quote' : 'regular'));
  const [preview, setPreview] = useState<string | null>(null);
  const [previewMeta, setPreviewMeta] = useState<{ inject: boolean; gpt: boolean }>({ inject: false, gpt: false });

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (type !== 'quote') { setPreview(null); return; }
      if (!settings.quote.injectUrl) { setPreview(notes || null); return; }
      try {
        const url = settings.quote.injectUrl.startsWith('http') ? settings.quote.injectUrl : `https://${settings.quote.injectUrl}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('inject http');
        const js = await res.json();
        const word = typeof js?.value === 'string' ? js.value : '';
        if (!word) { setPreview(notes || null); return; }
        if (settings.quote.openaiApiKey) {
          const prompt = settings.quote.promptTemplate.replace(/\[WORD\]/g, word);
          const body = { model: settings.quote.model, messages: [
            { role: 'system', content: 'Output ONLY JSON. Schema: {"text":"string","author":"string","years":"string"}.' },
            { role: 'user', content: prompt },
          ], temperature: 0.6, max_tokens: 180 } as const;
          const resp = await fetch('https://api.openai.com/v1/chat/completions', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${settings.quote.openaiApiKey}` }, body: JSON.stringify(body) });
          if (resp.ok) {
            const data = await resp.json();
            const content: string | undefined = data?.choices?.[0]?.message?.content;
            if (content) {
              try {
                const p = JSON.parse(content);
                if (!cancelled) {
                  setPreview(`${p.text} — ${p.author}${p.years ? ` ${p.years}` : ''}`);
                  setPreviewMeta({ inject: true, gpt: true });
                }
              } catch {}
            }
          }
          if (!cancelled && !preview) {
            setPreview(String(word));
            setPreviewMeta({ inject: true, gpt: false });
          }
        } else {
          if (!cancelled) {
            setPreview(String(word));
            setPreviewMeta({ inject: true, gpt: false });
          }
        }
      } catch (e) {
        if (!cancelled) setPreview(notes || null);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [type, settings.quote.injectUrl, settings.quote.openaiApiKey, settings.quote.model, settings.quote.promptTemplate, notes]);

  const onSave = async () => {
    const id = existing?.id ?? `evt_${Date.now()}`;
    const finalNotes = type === 'quote' ? (preview ?? notes) : notes;
    const item: EventItem = {
      id,
      date,
      allDay,
      startTime: allDay ? null : startTime,
      endTime: allDay ? null : endTime,
      title: title || (type === 'quote' ? 'Quote of the Day' : 'Event'),
      notes: finalNotes,
      type,
      injectUsed: previewMeta.inject,
      gptUsed: previewMeta.gpt,
      tz,
      reminderMinutes: Number.isNaN(parseInt(reminderMinutes, 10)) ? null : parseInt(reminderMinutes, 10),
      repeat,
      calendarId,
      location: location || null,
      attachmentUrl: attachmentUrl || null,
      createdAt: existing?.createdAt ?? Date.now(),
      updatedAt: Date.now(),
    };
    await addOrUpdateEvent(item);
    router.back();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen options={{ title: 'Event', headerShadowVisible: false }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 12) }}>
        <View style={styles.card}>
          <TextInput placeholder="Title" placeholderTextColor="#9AA0A6" value={title} onChangeText={setTitle} style={styles.title} testID="title" />
          <View style={styles.divider} />

          <View style={styles.row}> 
            <Text style={styles.rowLabel}>All day</Text>
            <Switch value={allDay} onValueChange={setAllDay} trackColor={{ false: '#E0E0E0', true: '#4AA3FF' }} thumbColor="#fff" />
          </View>

          <View style={styles.rowCols}> 
            <View style={{ flex: 1 }}>
              <Text style={styles.subLabel}>Date</Text>
              <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#9AA0A6" style={styles.input} testID="date" />
            </View>
            {!allDay && (
              <View style={{ flex: 1 }}>
                <Text style={styles.subLabel}>Start → End</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput value={startTime} onChangeText={setStartTime} placeholder="08:00" placeholderTextColor="#9AA0A6" style={[styles.input, { flex: 1 }]} testID="start" />
                  <TextInput value={endTime} onChangeText={setEndTime} placeholder="09:00" placeholderTextColor="#9AA0A6" style={[styles.input, { flex: 1 }]} testID="end" />
                </View>
              </View>
            )}
          </View>

          <TextInput placeholder="Location" placeholderTextColor="#9AA0A6" value={location} onChangeText={setLocation} style={styles.input} />

          <View style={styles.row}> 
            <Text style={styles.rowLabel}>Calendar</Text>
            <Text style={styles.rowValue}>My calendars</Text>
          </View>

          <View style={styles.row}> 
            <Text style={styles.rowLabel}>Reminder</Text>
            <TextInput value={reminderMinutes} onChangeText={setReminderMinutes} keyboardType="numeric" style={[styles.input, { width: 80 }]} />
          </View>

          <View style={styles.row}> 
            <Text style={styles.rowLabel}>Repeat</Text>
            <Text style={styles.rowValue}>{repeat}</Text>
          </View>

          <TextInput placeholder="Notes" placeholderTextColor="#9AA0A6" value={notes} onChangeText={setNotes} style={[styles.input, styles.notes]} multiline numberOfLines={Platform.OS === 'web' ? undefined : 4} />
          <TextInput placeholder="Attachment URL" placeholderTextColor="#9AA0A6" value={attachmentUrl} onChangeText={setAttachmentUrl} style={styles.input} />
          <View style={[styles.row, { marginTop: 8 }]}> 
            <Text style={styles.rowLabel}>Time zone</Text>
            <Text style={styles.rowValue}>{tz}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.mutedHeader}>Event Sources</Text>
          <View style={styles.rowBetween}><Text style={styles.small}>Inject</Text><Text style={styles.small}>{settings.quote.injectUrl ? settings.quote.injectUrl : 'OFF'}</Text></View>
          <View style={styles.rowBetween}><Text style={styles.small}>Use GPT Translation</Text><Text style={styles.small}>{settings.quote.openaiApiKey ? 'ON' : 'OFF'}</Text></View>
          {type === 'quote' && (
            <View style={[styles.previewBox]}>
              <Text style={styles.previewLabel}>This will display:</Text>
              <Text style={styles.previewText} numberOfLines={4}>{preview ?? '—'}</Text>
              <TouchableOpacity onPress={() => {
                setPreview(null);
                setNotes('');
              }} style={styles.refreshBtn}>
                <Text style={styles.refreshText}>Refresh quote</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.footerBtn, styles.cancel]}><Text style={styles.footerTextDark}>Cancel</Text></TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={[styles.footerBtn, styles.save]} testID="save-event"><Text style={styles.footerText}>Save</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#2F3A3F' },
  card: { backgroundColor: '#2F3A3F', marginHorizontal: 16, marginTop: 16, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#3E4A50' },
  title: { fontSize: 20, color: '#E6DDB3', fontWeight: '800', paddingVertical: 8 },
  divider: { height: 1, backgroundColor: '#3E4A50', marginVertical: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  rowCols: { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  rowLabel: { color: '#E6DDB3', fontWeight: '700' },
  rowValue: { color: '#E6DDB3' },
  subLabel: { color: '#9AA0A6', marginBottom: 6, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#3E4A50', backgroundColor: '#223036', borderRadius: 12, paddingHorizontal: 12, paddingVertical: Platform.OS === 'web' ? 10 : 8, color: '#E6DDB3' },
  notes: { minHeight: 100, textAlignVertical: 'top', marginTop: 8 },
  mutedHeader: { color: '#C6B88E', fontWeight: '700', marginBottom: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  small: { color: '#9AA0A6' },
  previewBox: { backgroundColor: '#223036', borderRadius: 12, padding: 12, marginTop: 8 },
  previewLabel: { color: '#9AA0A6', marginBottom: 6 },
  previewText: { color: '#E6DDB3' },
  refreshBtn: { marginTop: 8, backgroundColor: '#38464C', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  refreshText: { color: '#E6DDB3', fontWeight: '700' },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 16, marginTop: 24, gap: 12 },
  footerBtn: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 28 },
  cancel: { backgroundColor: '#EDEAE0' },
  save: { backgroundColor: '#111' },
  footerText: { color: '#fff', fontWeight: '800' },
  footerTextDark: { color: '#111', fontWeight: '800' },
});