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
          title: 'Manual & Help',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(24, insets.bottom + 12) }]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Overview" testID="help-overview">
          <Text style={styles.p}>
            AXIOM is a normal calendar on the surface. Secretly, it lets you map weeks and days to items (cards, ESP, colors, words, etc.), run subtle forces, and perform clean reveals. By default, all special modes are OFF.
          </Text>
        </Section>

        <Section title="Quick Setup" testID="help-setup">
          <View style={styles.list}>
            <Bullet>Open Settings and pick your Stack or create a Custom Stack.</Bullet>
            <Bullet>Choose Week Mapping (ISO/US/custom start day) if needed.</Bullet>
            <Bullet>Optionally turn on Holidays. U.S. is default; pick other countries in Settings.</Bullet>
            <Bullet>Everything else (Force, Peek, Rehearsal, Overrides) starts OFF until you enable it.</Bullet>
          </View>
        </Section>

        <Section title="Core Ideas" testID="help-core">
          <Text style={styles.p}>
            Week → Item: The year has ~52 weeks. Week 1 maps to position 1 in your stack/profile, Week 2 to position 2, and so on. Every day inside that week shares the same position.
          </Text>
          <Text style={styles.p}>
            Day Detail: Tapping any date opens a neutral screen (date, weekday, zodiac, etc.). If Month Overrides are active for that month, the items you defined for that day appear here.
          </Text>
        </Section>

        <Section title="Performing: Classic Week Mapping" testID="help-perform-classic">
          <View style={styles.list}>
            <Bullet>Have a date named. Tap that date. You instantly know the mapped item by week position.</Bullet>
            <Bullet>Or search a card/item to highlight its week, then let them name a day inside that week.</Bullet>
            <Bullet>Use Peek (optional) for a private confirmation overlay during practice.</Bullet>
          </View>
        </Section>

        <Section title="Performing: Face-Down Swipe Force" testID="help-perform-force">
          <Text style={styles.p}>
            Lets them swipe while the phone is face-down. On flipping face-up, the calendar snaps to your armed month. With Day Lock ON, any tap opens your chosen day. Public UI stays innocent.
          </Text>
          <View style={styles.list}>
            <Bullet>Enable Force Mode in Settings. Set Force Month (Relative or Absolute) and/or Force Day.</Bullet>
            <Bullet>Accelerometer Force ON: Only triggers when flipped face-down → face-up within the window.</Bullet>
            <Bullet>Manual Snap: If accelerometer is off/unavailable, use long-press header or remote/gesture to snap.</Bullet>
            <Bullet>Day Lock: With Force Day active, any tap in scope opens your forced date; the tapped tile still flashes first.</Bullet>
          </View>
        </Section>

        <Section title="Custom Month Overrides" testID="help-overrides">
          <Text style={styles.p}>
            Replace normal week mapping for a single month. Define exactly what each day shows: label plus one or more items (card, ESP, color, number, word, zodiac, etc.). Choose which item appears first.
          </Text>
          <View style={styles.list}>
            <Bullet>Enable Overrides, pick a YYYY-MM, then edit Day 1..28/29/30/31.</Bullet>
            <Bullet>Each day has a public label (neutral) and one or more secret items. Choose a default item.</Bullet>
            <Bullet>Import/Export JSON/CSV to back up or share a month profile.</Bullet>
            <Bullet>Precedence: If overrides exist for that month, they replace Week → Item for Day Detail.</Bullet>
          </View>
        </Section>

        <Section title="Custom Stacks & Lists" testID="help-stacks">
          <Text style={styles.p}>
            Create your own 52-item stack or alternate profiles. Reorder items, name the list, and save it. New stacks can be used wherever a stack/profile is referenced.
          </Text>
          <View style={styles.list}>
            <Bullet>Start a new stack from Settings → Custom Lists/Stacks.</Bullet>
            <Bullet>Drag items to reorder. You can reset to brand-new-deck order when creating a deck-based list.</Bullet>
            <Bullet>Save to make it available across the app.</Bullet>
          </View>
        </Section>

        <Section title="Holidays" testID="help-holidays">
          <Text style={styles.p}>
            When enabled, holiday days show slim colored bars along the bottom of the date cell. Multiple holidays stack as multi‑color bars. Tapping the day opens Day Detail; the holiday names appear there.
          </Text>
          <View style={styles.list}>
            <Bullet>Default country: U.S. Change or add countries in Settings.</Bullet>
            <Bullet>Bars are visual; they do not shift alignment or change the date typography.</Bullet>
          </View>
        </Section>

        <Section title="Relationships between settings" testID="help-relations">
          <View style={styles.list}>
            <Bullet>Force Month/Day is independent of Overrides. If both are ON, the force controls navigation/opening; Overrides control what appears inside Day Detail.</Bullet>
            <Bullet>Rehearsal and Peek are visual aids. They never change public content.</Bullet>
            <Bullet>Holiday bars are purely decorative signals; they do not affect forces or overrides.</Bullet>
          </View>
        </Section>

        <Section title="Step-by-step: A full force routine" testID="help-routine">
          <View style={styles.list}>
            <Bullet>In Settings: Enable Force Mode. Set Force Month (e.g., +1) and Force Day (e.g., 14). Turn ON Accelerometer Force.</Bullet>
            <Bullet>Optionally enable a Month Override for that month so Day 14 shows the exact item you want.</Bullet>
            <Bullet>Hand the phone face-down. Ask them to freely swipe. After a moment, have them flip it face-up.</Bullet>
            <Bullet>The calendar glides to your month. Ask them to tap any date. The app opens Day 14’s detail. Reveal cleanly.</Bullet>
          </View>
        </Section>

        <Section title="Magician’s notes" testID="help-notes">
          <View style={styles.list}>
            <Bullet>Keep public copy neutral. Avoid magic terms. Let the visuals sell normalcy.</Bullet>
            <Bullet>Use subtle confirmations: a private haptic or a tiny header dot indicates the force is armed.</Bullet>
            <Bullet>For Month Overrides, prepare domain lists in advance (cards, ESP, colors, numbers, words). The editor shows names so you always know what you’re choosing.</Bullet>
          </View>
        </Section>

        <Section title="Troubleshooting" testID="help-troubleshooting">
          <View style={styles.list}>
            <Bullet>Accelerometer error when toggling: ensure Accelerometer Force is OFF on web. On mobile, if sensors are unavailable, the app falls back to manual snap/gestures.</Bullet>
            <Bullet>Force Day invalid (e.g., 31 on February): choose fallback policy in Settings (nearest valid or block arming).</Bullet>
            <Bullet>Overrides editor crash: verify the selected month is valid and items have supported types. If a list is empty or malformed, reload and re‑import JSON/CSV.</Bullet>
            <Bullet>Week mismatch: verify Week Mapping (ISO/US) and the chosen start day.</Bullet>
            <Bullet>Stuck state or repeated triggers: use Panic (vol up+down) or toggle Force Mode OFF/ON to reset; debounce prevents rapid re‑triggers.</Bullet>
          </View>
        </Section>

        <Section title="Glossary" testID="help-glossary">
          <View style={styles.list}>
            <Bullet>Force Month: Preselect which month the calendar will land on when armed.</Bullet>
            <Bullet>Force Day (Day Lock): Preselect which day’s detail opens on the next tap.</Bullet>
            <Bullet>Overrides: A month‑specific map defining items per day that replace normal week mapping.</Bullet>
            <Bullet>Peek: A private overlay that briefly confirms mapping; never appears publicly.</Bullet>
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

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.li}>
      <View style={styles.bullet} />
      <Text style={styles.liText}>{children}</Text>
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
