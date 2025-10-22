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
          <Text style={styles.p}>1) Pick your persona: mystic, psych coach, or playful skeptic. Let this drive word choice and pacing.</Text>
          <Text style={styles.p}>2) Choose a premise: astrology, fate, or Focus-of-the-Month. Stay consistent for the whole routine.</Text>
          <Text style={styles.p}>3) Set up your reveal: create one Quote of the Day for a single reveal date. Pre-show: mention you set an intention in your calendar a while back.</Text>
          <Text style={styles.p}>4) Tech choices: Manual quote, Inject {`{ "value": "courage" }`} from your endpoint, or AI-polished via GPT. Validate in Settings.</Text>
          <Text style={styles.p}>5) Practice the beats: Hook → Conditions → Build → Moment of Magic → Afterglow. Leave 2–3 seconds of silence at reveal.</Text>
        </Section>

        <Section title="Core Performance Principles" testID="help-core-principles">
          <Text style={styles.p}>• Start with effect, not method: write the miracle sentence first: “They freely name a date; it matches a quote I set days ago.”</Text>
          <Text style={styles.p}>• Build a premise: pick one lens and stick to it. Astrology, fate, or Focus-of-the-Month.</Text>
          <Text style={styles.p}>• Structure every routine: Hook → Conditions → Build → Moment of Magic → Afterglow. Script each beat.</Text>
          <Text style={styles.p}>• Manage attention: give minds a job (“Focus on the month’s word…”) before any secret actions.</Text>
          <Text style={styles.p}>• Use time misdirection: do any dirty work well before the revelation (earlier in set or pre-show).</Text>
          <Text style={styles.p}>• Script ambiguity: lines that are true either way protect your outs (“You could have changed your mind again”).</Text>
          <Text style={styles.p}>• Persona voice: choose and commit. Let vocabulary and pacing match it.</Text>
          <Text style={styles.p}>• Spectator roles: one leader, one validator. Name them; give status and clear tasks.</Text>
          <Text style={styles.p}>• Pacing and silence: don’t talk over the gasp. Count two beats before speaking after reveal.</Text>
          <Text style={styles.p}>• Multiple outs: prep 2–3 reveal framings so any near-miss still lands as design.</Text>
          <Text style={styles.p}>• Souvenir and callback: end with a screenshot and a call-forward (“Check your quote on the 21st”).</Text>
        </Section>

        <Section title="Language & Scripting Tools" testID="help-language-tools">
          <Text style={styles.p}>• Anchors: “Long before today…”, “You committed in your mind…”, “You could have changed it.”</Text>
          <Text style={styles.p}>• Conditional language: “If this aligns, you’ll feel it immediately.” Works across methods.</Text>
          <Text style={styles.p}>• Dual reality softeners: to the leader, “You locked that in privately.” The group hears stricter conditions.</Text>
          <Text style={styles.p}>• Emotional labels: tie reveals to feelings: Clarity, Courage, Release.</Text>
        </Section>

        <Section title="Audience Management" testID="help-audience">
          <Text style={styles.p}>• Consent: ask before using birthdays or private dates. Offer a non-personal alternative.</Text>
          <Text style={styles.p}>• Clear choices: offer three clean options that all serve the method.</Text>
          <Text style={styles.p}>• Reset discipline: keep the app on the Month screen with the right date highlighted.</Text>
        </Section>

        <Section title="Calendar/Astrology Tips" testID="help-astro-tips">
          <Text style={styles.p}>• Premise: “Time leaves fingerprints.” Use dates, moon cycles, or the month’s Focus word to justify the frame.</Text>
          <Text style={styles.p}>• Pre-show framing: “I set an intention in the calendar a while back.” Plants time misdirection.</Text>
          <Text style={styles.p}>• Revelation hierarchy: date → Focus word → exact pre-set quote.</Text>
          <Text style={styles.p}>• Treat the app as a journal of commitments, not a trick device.</Text>
          <Text style={styles.p}>• Aftercare: invite them to revisit that date; extends impact beyond the show.</Text>
        </Section>

        <Section title="Common Outs" testID="help-outs">
          <Text style={styles.p}>• Near-miss: “Sometimes fate whispers, not shouts—notice the word’s theme matches your choice.”</Text>
          <Text style={styles.p}>• Full miss: pivot to reading—“Then the calendar is talking about what you need next, not now.”</Text>
          <Text style={styles.p}>• Data-stall: “Keep the date in mind; I don’t want the phone to steal our moment.” Do a non-tech beat, then return.</Text>
        </Section>

        <Section title="Rehearsal Checklist" testID="help-rehearsal">
          <Text style={styles.p}>• Script beats and underline the exact sentence before the reveal.</Text>
          <Text style={styles.p}>• Block your hands: where is the phone, when do you unlock, which thumb taps?</Text>
          <Text style={styles.p}>• Record rehearsals and cut filler before the moment of magic.</Text>
          <Text style={styles.p}>• Test on a non-magician; watch their eyes, not your method.</Text>
        </Section>

        <Section title="Two-Minute Routine (Calendar Reveal)" testID="help-sample-routine">
          <Text style={styles.p}>Hook: “Each month has a Focus. This one: Courage. Let’s see if time already knew something about you.”</Text>
          <Text style={styles.p}>Choice: “Name any date this month—change your mind if you like.” Confirm aloud.</Text>
          <Text style={styles.p}>Conditions: “This lives in my calendar. I can’t edit what’s already written.” Phone face-down.</Text>
          <Text style={styles.p}>Build: “Lock that date in your mind. Think of what courage would mean on that day.”</Text>
          <Text style={styles.p}>Secret beat: navigate to the pre-set Quote-of-the-Day while speaking slowly.</Text>
          <Text style={styles.p}>Moment: turn phone face-up on the selected date. “Long before today, I set one line for that exact day…”</Text>
          <Text style={styles.p}>Reveal: read the quote. Pause. Let them react.</Text>
          <Text style={styles.p}>Afterglow: “When that day arrives, notice if life gives you a chance to choose this.” Offer a screenshot.</Text>
        </Section>

        <Section title="Full Script: Focus-of-the-Month" testID="help-script-focus">
          <Text style={styles.p}>Premise: the month’s Focus guides choices. Persona: psych coach.</Text>
          <Text style={styles.p}>Hook: “This month’s Focus is Alignment. Keep that in mind.”</Text>
          <Text style={styles.p}>Leader names any date this month. Validator confirms.</Text>
          <Text style={styles.p}>Conditions: “I set one commitment line weeks ago—couldn’t change it now.” Phone stays face-down.</Text>
          <Text style={styles.p}>Build: “Picture what Alignment would ask of you on that day.” Secretly open that date’s saved quote.</Text>
          <Text style={styles.p}>Moment: display the day view. “Long before today…” Read the line. Breathe.</Text>
          <Text style={styles.p}>Afterglow: screenshot sent to the leader. Callback: “On the 21st, notice if this surfaces.”</Text>
        </Section>

        <Section title="Full Script: Astrology Lens" testID="help-script-astrology">
          <Text style={styles.p}>Premise: “Time leaves fingerprints.” Persona: mystic.</Text>
          <Text style={styles.p}>Hook: “We’re in Aries—momentum. Name any date that pulls you.”</Text>
          <Text style={styles.p}>Conditions: “I wrote one line for that night long ago.”</Text>
          <Text style={styles.p}>Build: “Feel the moon’s pull around that date.” Navigate to the quote quietly.</Text>
          <Text style={styles.p}>Moment: reveal the Focus word first, then the exact quote.</Text>
          <Text style={styles.p}>Outs: if near-miss, lean into theme resonance; if miss, reframe as “what you need next.”</Text>
        </Section>

        <Section title="Full Script: Playful Skeptic" testID="help-script-skeptic">
          <Text style={styles.p}>Premise: psychology of commitment. Persona: playful skeptic.</Text>
          <Text style={styles.p}>Hook: “Decisions made ahead of time beat moods. Pick any date.”</Text>
          <Text style={styles.p}>Conditions: “I can’t type fast enough to rig this now.” Phone idle, face-down.</Text>
          <Text style={styles.p}>Build: “If this aligns, you’ll feel it immediately.” Quietly cue the saved quote.</Text>
          <Text style={styles.p}>Moment: “You could have landed anywhere.” Turn phone; read the line. Pause.</Text>
          <Text style={styles.p}>Afterglow: “If this speaks to you, it’s because you were already moving toward it.”</Text>
        </Section>

        <Section title="Tech Setup (Brief)" testID="help-tech">
          <Text style={styles.p}>• Quote of the Day: only one reveal date at a time. New date replaces the old.</Text>
          <Text style={styles.p}>• Inject: endpoint returns JSON with a single value field. Example: {`{ "value": "courage" }`}. Validate in Settings.</Text>
          <Text style={styles.p}>• GPT (optional): provide API key and model; it polishes Inject into a crisp quote. We fall back gracefully if offline.</Text>
          <Text style={styles.p}>• Month behavior: if a reveal day is set, the quote appears when you open the Month screen with that date selected.</Text>
        </Section>

        <Section title="Sample Lines You Can Lift" testID="help-lines">
          <Text style={styles.p}>• “You could have landed anywhere—today, yesterday, or a date that only matters to you.”</Text>
          <Text style={styles.p}>• “Decisions made ahead of time are stronger than moods. That’s why I set this weeks ago.”</Text>
          <Text style={styles.p}>• “If this speaks to you, it’s because you were already moving toward it.”</Text>
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
