import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="help-screen">
      <Stack.Screen
        options={{
          title: 'Help & Guide',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={[styles.content, { paddingBottom: Math.max(24, insets.bottom + 12) }]} showsVerticalScrollIndicator={false}>
        <Section title="What AXIOM is" testID="help-what">
          <Text style={styles.p}>
            AXIOM is a clean, normal-looking calendar. Behind the scenes, each calendar week maps to one card in your chosen 52‑card stack. You can use this privately for reveals, forces, and practice.
          </Text>
        </Section>

        <Section title="Picking a date" testID="help-date-pick">
          <Text style={styles.p}>
            Tap any day on the calendar. The app highlights that day’s 7‑day week. Public text stays neutral: weekday, month, sign, and a short focus line.
          </Text>
        </Section>

        <Section title="Week → Card (the simple idea)" testID="help-week-card">
          <Text style={styles.p}>
            The year is like 52 short chapters. Chapter (Week) 1 maps to stack position 1, Week 2 to position 2, and so on. Every date inside a week points to the same stack position. Week numbering can follow ISO (default), US, or a custom week start day.
          </Text>
        </Section>

        <Section title="Reverse: Card → Week" testID="help-card-week">
          <Text style={styles.p}>
            If you know a card, you can jump to its week. Use Search with a card label (e.g., “7H” or “Seven of Hearts”) and the app highlights that week’s 7‑day range.
          </Text>
        </Section>

        <Section title="Peek (private glance)" testID="help-peek">
          <Text style={styles.p}>
            When Peek is enabled in Settings, you can trigger a tiny private overlay that briefly shows “Week X → Card Y.” This never appears in screenshots. Use it for a quick confirmation.
          </Text>
        </Section>

        <Section title="Force Mode (optional)" testID="help-force">
          <Text style={styles.p}>
            You can quietly choose a target month and a target day. When locked, any day the spectator taps will open the day you chose. The calendar still looks normal and the tapped tile flashes as usual.
          </Text>
          <View style={styles.list}>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Force Month: choose a month relative to today or an exact year‑month.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Force Day: pick a day number (with smart handling for months with fewer days).</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Snap Animation: control how quickly the calendar glides to the armed month.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Tap Remap: Stealth (any tap opens your day) or Honest Tile (your day looks subtly bolder).</Text></View>
          </View>
        </Section>

        <Section title="Rehearsal Mode" testID="help-rehearsal">
          <Text style={styles.p}>
            For practice only. Overlay Week → Card labels on the calendar so you can drill the mapping quickly. Turn it off before showing anyone.
          </Text>
        </Section>

        <Section title="Search" testID="help-search">
          <Text style={styles.p}>
            Search accepts normal phrases like “week of Feb 12” or specific dates. Secretly, it also accepts card labels like “4C” or “Ace of Hearts” to jump to the matching week.
          </Text>
        </Section>

        <Section title="Settings quick tour" testID="help-settings">
          <View style={styles.list}>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Week Mapping: choose ISO, US, or a custom start day; decide what to do with Week 53.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Stack: pick Mnemonica, Aronson, or provide a custom 52‑item list.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Peek: enable or disable the private overlay.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Rehearsal: practice overlay for Week → Card labels.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Force Mode: arm a month/day, animation, and tap behavior.</Text></View>
          </View>
          <Text style={styles.p}>
            To open Settings from the calendar, long‑press the month header. If you’ve changed that gesture, use the Settings route from your app menu.
          </Text>
        </Section>

        <Section title="Safety & Privacy" testID="help-safety">
          <View style={styles.list}>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Public screens never show card terms.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>Peek overlays are private and won’t appear in system screenshots.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>All week and stack logic works offline on your device.</Text></View>
          </View>
        </Section>

        <Section title="Troubleshooting" testID="help-troubleshooting">
          <View style={styles.list}>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>If weeks look off, check Week Mapping (ISO vs US) and your week start day.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>If Force Day seems wrong, verify the day exists in that month or enable the nearest‑valid fallback.</Text></View>
            <View style={styles.li}><View style={styles.bullet} /><Text style={styles.liText}>If something feels stuck, use the panic/reset in Settings or restart the app.</Text></View>
          </View>
        </Section>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

function Section({ title, children, testID }: { title: string; children: React.ReactNode; testID?: string }) {
  return (
    <View style={styles.section} testID={testID ?? undefined}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.card}>{children}</View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#00B4FF',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 24,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  p: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    letterSpacing: 0.2,
    marginBottom: 10,
  },
  list: {
    marginVertical: 6,
  },
  li: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00B4FF',
    marginTop: 8,
    marginRight: 10,
    marginLeft: 2,
  },
  liText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});
