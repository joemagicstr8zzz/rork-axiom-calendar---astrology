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
        <Section title="Welcome" testID="help-welcome">
          <Text style={styles.p}>
            This guide explains, in plain language, how to use the calendar, add events, and work with Quotes of the Day. 
            It also covers optional helpers: Inject (a simple text source you control) and GPT (AI polishing).
          </Text>
        </Section>

        <Section title="Home screen basics" testID="help-home-basics">
          <Text style={styles.p}>
            The Month view is a normal calendar. Tap any date to open its Day details. If that day has a Quote of the Day or events, you’ll see them there.
            The Add event bar at the bottom and the + button on the right both open the same editor.
          </Text>
        </Section>

        <Section title="Events, reminders, and quotes" testID="help-types">
          <Text style={styles.p}>
            Regular event: anything you schedule (meeting, birthday, etc.). A reminder is simply an event with an alert time.
            Quote of the Day is a special one‑day event whose main content is a quote. The full quote shows only on that date’s detail screen.
          </Text>
        </Section>

        <Section title="Quote of the Day — how it works" testID="help-quote-how">
          <Text style={styles.p}>
            Only one Reveal Day exists at a time. If you pick a new reveal day, the previous one is replaced.
            When a reveal day is set, its quote appears immediately on the Day details when that day is selected on the month screen.
            In the month grid, you may see a small colored bar so you know something is scheduled.
          </Text>
        </Section>

        <Section title="Creating a Quote of the Day" testID="help-create-quote">
          <Text style={styles.p}>1) Tap the Add event bar or the + button.</Text>
          <Text style={styles.p}>2) Choose the event type as `Quote`.</Text>
          <Text style={styles.p}>3) Pick the date. Only one reveal day can be active; setting a new one replaces the old.</Text>
          <Text style={styles.p}>4) If Inject and GPT are enabled, you’ll see a preview. You can still edit Notes.</Text>
          <Text style={styles.p}>5) Save. The quote is attached to that day and saved offline in Notes.</Text>
        </Section>

        <Section title="Inject (optional) in plain words" testID="help-inject">
          <Text style={styles.p}>
            Inject is a simple text source. You provide a web address that returns JSON with a single field named `value`. Example: {`{ "value": "courage" }`}.
            We read only that value and use it as the topic for your quote.
          </Text>
          <Text style={styles.p}>
            In Settings, enter the address without http/https (e.g., 11z.co/_w/123456/selection), set a timeout, and press Validate to test it.
            If your Inject value changes while the app is open on the calendar screen, the quote preview updates within about a second.
          </Text>
        </Section>

        <Section title="GPT polishing (optional)" testID="help-gpt">
          <Text style={styles.p}>
            If enabled, the app takes the Inject word and asks AI to turn it into a clean quote with an author line. If GPT is off, we simply use the Inject text.
            Add your OpenAI key, pick a model (e.g., gpt-4o-mini), and use Validate. You can edit the prompt to match your style.
          </Text>
        </Section>

        <Section title="Saving and fallbacks" testID="help-fallbacks">
          <Text style={styles.p}>
            When you save a Quote event, we write the final text to the event’s Notes so it works offline.
            If Inject fails, we fall back to the last preview, or your manual Notes. If GPT fails, we use the raw Inject value.
          </Text>
        </Section>

        <Section title="Regular events and reminders" testID="help-regular-events">
          <Text style={styles.p}>
            Create them the same way: Title, Date, optional Start/End time, Location, Calendar, Reminder, Repeat, Notes, Attachment, and Time zone. Save to see a small bar on the month view and full details in Day details.
          </Text>
        </Section>

        <Section title="Settings made simple" testID="help-settings-simple">
          <Text style={styles.p}>
            Inject: Turns on automatic text from your endpoint. Validate checks it.
            GPT: Polishes the text into a quote with an author line. Needs an API key and model.
            Quote day default: Pre-fills the date for new Quote events (Today, Tomorrow, or Pick a date).
            Performance time zone: Ensures dates/times are saved consistently.
          </Text>
        </Section>

        <Section title="Troubleshooting" testID="help-troubleshooting">
          <Text style={styles.p}>Inject didn’t update: Make sure the endpoint returns JSON with a `value`. Use Validate.</Text>
          <Text style={styles.p}>Quote didn’t appear: Confirm the reveal day is correct. Only one reveal day can exist.</Text>
          <Text style={styles.p}>Old quote showing: Give it a moment on the month screen. If needed, reopen the app to that day.</Text>
          <Text style={styles.p}>GPT errors: Check your API key/model, then Validate. We’ll fall back to raw Inject text.</Text>
        </Section>

        <Section title="Privacy" testID="help-privacy">
          <Text style={styles.p}>
            Your Inject address and any API keys are stored on your device. Do not share them publicly.
          </Text>
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
