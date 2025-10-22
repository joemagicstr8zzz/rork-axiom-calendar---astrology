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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: Math.max(24, insets.bottom + 12) }]}
        showsVerticalScrollIndicator={false}
      >
        <Section title="Start Here" testID="help-start-here">
          <Text style={styles.p}>• Open the app and explore the tabs at the bottom. Home shows the current month. Day shows details for a specific date.</Text>
          <Text style={styles.p}>• Tap any date to view its details. You can see the Focus word, the Quote of the Day (if set), and any saved events.</Text>
          <Text style={styles.p}>• Use the Search tab to jump to dates, zodiac signs, or saved items. Some search features require a license.</Text>
        </Section>

        <Section title="Navigation" testID="help-navigation">
          <Text style={styles.p}>• Month view: Swipe or tap arrows to move between months. Tap a date to open Day view.</Text>
          <Text style={styles.p}>• Day view: Shows the date, Focus word, Quote of the Day, and events for that day.</Text>
          <Text style={styles.p}>• Astrology: Browse zodiac information and month themes.</Text>
          <Text style={styles.p}>• Settings: Adjust preferences and validate your setup.</Text>
        </Section>

        <Section title="Quote of the Day" testID="help-quote">
          <Text style={styles.p}>• View: Tap a date, then tap “Quote of the Day.” If a quote exists, it will appear.</Text>
          <Text style={styles.p}>• Add or edit: From the Day view, choose Edit to enter or change the quote for that date.</Text>
          <Text style={styles.p}>• Share: Use the Share button to send the quote as text or take a screenshot from your device.</Text>
          <Text style={styles.p}>• One quote per day. Updating the quote replaces the previous one.</Text>
        </Section>

        <Section title="Search" testID="help-search">
          <Text style={styles.p}>• Use the search bar to find dates (e.g., “March 14”), zodiac signs (e.g., “Aries”), or saved items.</Text>
          <Text style={styles.p}>• If you don’t have a license, some examples and hints may be hidden. The core search still works for dates.</Text>
        </Section>

        <Section title="Events" testID="help-events">
          <Text style={styles.p}>• Add an event: From Day view, tap Add Event. Give it a title and optional notes.</Text>
          <Text style={styles.p}>• Edit or delete: Open an event to update its details or remove it.</Text>
          <Text style={styles.p}>• Countdown: Some systems show a countdown option under More. If present, it visually counts down to your event date.</Text>
        </Section>

        <Section title="Customize" testID="help-customize">
          <Text style={styles.p}>• Month Focus word: Some months display a Focus word. You can customize themes in Settings if available.</Text>
          <Text style={styles.p}>• Visual styles: Use Visual Libraries to change how months and days are displayed if your version includes it.</Text>
          <Text style={styles.p}>• Zodiac & signs: Open the Astrology tab to learn about each sign and related dates.</Text>
        </Section>

        <Section title="Settings" testID="help-settings">
          <Text style={styles.p}>• Preferences: Adjust display options and verify that features like quotes and events are working.</Text>
          <Text style={styles.p}>• Data check: Use any available Validate or Test buttons to confirm your setup.</Text>
          <Text style={styles.p}>• License: If you have a license, enter it in Settings to unlock extra features and examples.</Text>
        </Section>

        <Section title="Tips & Troubleshooting" testID="help-troubleshooting">
          <Text style={styles.p}>• Can’t find a date? Use the Search tab and type the date plainly (e.g., “July 21”).</Text>
          <Text style={styles.p}>• Quote not showing? Open the Day view and make sure a quote is saved for that date.</Text>
          <Text style={styles.p}>• Buttons covered by the system bar? Scroll the page a little—the action buttons sit above the bottom area on Android.</Text>
          <Text style={styles.p}>• Still stuck? Visit Settings for a quick check or restart the app.</Text>
        </Section>

        <Section title="Privacy" testID="help-privacy">
          <Text style={styles.p}>• Your notes and quotes are for you. Share only what you choose to share.</Text>
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
});
