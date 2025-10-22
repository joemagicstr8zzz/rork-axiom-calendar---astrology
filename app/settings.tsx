import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '@/contexts/AppContext';
import { useLicense } from '@/contexts/LicenseContext';
import LicenseGate from '@/components/LicenseGate';
import { StackType } from '@/constants/stacks';
import { CheckCircle2, XCircle } from 'lucide-react-native';

export default function SettingsScreen() {
  const { settings, saveSettings, updateForce, updateQuote, validateOpenAIKey, validateInjectUrl } = useApp();
  const { licensed, isAdmin } = useLicense();
  const insets = useSafeAreaInsets();

  const [injectValidity, setInjectValidity] = React.useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const [injectMessage, setInjectMessage] = React.useState<string>('');
  const [openaiValidity, setOpenaiValidity] = React.useState<'unknown' | 'valid' | 'invalid'>('unknown');
  const [openaiMessage, setOpenaiMessage] = React.useState<string>('');

  const handleStackChange = (stackType: StackType) => {
    saveSettings({ stackType });
  };

  if (!licensed && !isAdmin) {
    return (
      <View style={[styles.container]}>
        <Stack.Screen options={{ title: 'Settings Locked' }} />
        <LicenseGate />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <Stack.Screen
        options={{
          title: 'Magician Panel',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: Math.max(24, insets.bottom + 12) }} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Quote of the Day</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Shows a quote under the calendar. It can listen to your Inject API for a word and then ask OpenAI using your prompt. Inject reveals can also be toggled independently for future features.</Text>

            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Enable Quote of the Day</Text>
                <Text style={styles.optionSubtext}>{settings.quote.status === 'generating' ? 'Generating…' : settings.quote.status === 'listening' ? 'Listening for updates' : settings.quote.errorMessage ? `Error: ${settings.quote.errorMessage}` : 'Idle'}</Text>
              </View>
              <Switch
                value={settings.quote.enabled}
                onValueChange={(value) => updateQuote({ enabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={[styles.switchRow, { marginTop: 8 }]}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Inject Reveals</Text>
                <Text style={styles.optionSubtext}>Independent toggle for Inject-driven UI</Text>
              </View>
              <Switch
                value={!!settings.quote.injectRevealsEnabled}
                onValueChange={(value) => updateQuote({ injectRevealsEnabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Inject API URL</Text>
            <TextInput
              testID="inject-url-input"
              style={styles.input}
              placeholder="11z.co/_w/#####/selection"
              placeholderTextColor="#AAA"
              autoCapitalize="none"
              autoCorrect={false}
              value={settings.quote.injectUrl ?? ''}
              onChangeText={(t) => updateQuote({ injectUrl: t.trim() })}
              onEndEditing={async () => {
                const res = await validateInjectUrl();
                setInjectValidity(res.ok ? 'valid' : 'invalid');
                setInjectMessage(res.ok ? 'Valid' : (res.message || 'Invalid'));
              }}
            />
            <View style={styles.validationRow}>
              {injectValidity !== 'unknown' && (
                <View style={styles.validationPill} testID="inject-validation">
                  {injectValidity === 'valid' ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <XCircle size={18} color="#EF4444" />
                  )}
                  <Text style={[styles.validationText, { color: injectValidity === 'valid' ? '#065F46' : '#7F1D1D' }]}>
                    {injectValidity === 'valid' ? 'Valid' : `Invalid${injectMessage ? ` · ${injectMessage}` : ''}`}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>OpenAI API Key</Text>
            <TextInput
              testID="openai-key-input"
              style={styles.input}
              placeholder="sk-..."
              placeholderTextColor="#AAA"
              autoCapitalize="none"
              autoCorrect={false}
              value={settings.quote.openaiApiKey ?? ''}
              secureTextEntry={true}
              onChangeText={(t) => updateQuote({ openaiApiKey: t.trim() })}
              onEndEditing={async () => {
                const res = await validateOpenAIKey();
                setOpenaiValidity(res.ok ? 'valid' : 'invalid');
                setOpenaiMessage(res.ok ? 'Valid' : (res.message || 'Invalid'));
              }}
            />
            <View style={styles.validationRow}>
              {openaiValidity !== 'unknown' && (
                <View style={styles.validationPill} testID="openai-validation">
                  {openaiValidity === 'valid' ? (
                    <CheckCircle2 size={18} color="#10B981" />
                  ) : (
                    <XCircle size={18} color="#EF4444" />
                  )}
                  <Text style={[styles.validationText, { color: openaiValidity === 'valid' ? '#065F46' : '#7F1D1D' }]}>
                    {openaiValidity === 'valid' ? 'Valid' : `Invalid${openaiMessage ? ` · ${openaiMessage}` : ''}`}
                  </Text>
                </View>
              )}
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Prompt Template</Text>
            <TextInput
              testID="prompt-template-input"
              style={[styles.input, styles.textarea]}
              multiline
              numberOfLines={Platform.OS === 'web' ? undefined : 4}
              placeholder="Use [WORD] placeholder"
              placeholderTextColor="#AAA"
              value={settings.quote.promptTemplate}
              onChangeText={(t) => updateQuote({ promptTemplate: t })}
            />

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Model</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>{settings.quote.model}</Text>
                <Text style={styles.optionSubtext}>Tap to cycle</Text>
              </View>
              <TouchableOpacity
                testID="cycle-model"
                onPress={() => {
                  const models = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.1-mini'];
                  const idx = models.indexOf(settings.quote.model);
                  const next = models[(Math.max(0, idx) + 1) % models.length] as string;
                  updateQuote({ model: next });
                }}
              >
                <View style={[styles.radio, styles.radioSelected]} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Quote day default</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Default day</Text>
                <Text style={styles.optionSubtext}>{settings.quote.quoteDayDefault ?? 'today'}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {(['today','tomorrow','pick'] as const).map(p => (
                  <TouchableOpacity key={p} style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateQuote({ quoteDayDefault: p })}>
                    <Text style={{ fontWeight: (settings.quote.quoteDayDefault ?? 'today') === p ? '700' : '400', color: (settings.quote.quoteDayDefault ?? 'today') === p ? '#007AFF' : '#666' }}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {settings.quote.quoteDayDefault === 'pick' && (
              <TextInput
                testID="quote-day-pick"
                style={styles.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#AAA"
                value={settings.quote.quoteDayPickDate ?? ''}
                onChangeText={(t) => updateQuote({ quoteDayPickDate: t })}
              />
            )}

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Display</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Position</Text>
                <Text style={styles.optionSubtext}>{settings.quote.displayPosition}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {(['belowCalendar','belowFocusBar'] as const).map(p => (
                  <TouchableOpacity key={p} style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateQuote({ displayPosition: p })}>
                    <Text style={{ fontWeight: settings.quote.displayPosition === p ? '700' : '400', color: settings.quote.displayPosition === p ? '#007AFF' : '#666' }}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {settings.quote.lastQuote && (
              <View style={[styles.previewQuote]}
                testID="quote-preview">
                <Text style={styles.previewQuoteText}>“{settings.quote.lastQuote.text}”</Text>
                <Text style={styles.previewQuoteAuthor}>— {settings.quote.lastQuote.author}{settings.quote.lastQuote.years ? ` ${settings.quote.lastQuote.years}` : ''}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Week Mapping</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Controls how weeks are calculated and labeled. This affects Week→Card mapping and any week highlights.</Text>
            <Text style={styles.cardLabel}>Standard</Text>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ weekStandard: 'iso', weekStartDay: 1 })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>ISO Weeks</Text>
                <Text style={styles.optionSubtext}>Mon start; Week 1 has Thu (default)</Text>
              </View>
              <View style={[styles.radio, settings.weekStandard === 'iso' && styles.radioSelected]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ weekStandard: 'us', weekStartDay: 0 })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>US Weeks</Text>
                <Text style={styles.optionSubtext}>Sun start; Week 1 contains Jan 1</Text>
              </View>
              <View style={[styles.radio, settings.weekStandard === 'us' && styles.radioSelected]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ weekStandard: 'custom' })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Custom Start Day</Text>
                <Text style={styles.optionSubtext}>Start on day index {settings.weekStartDay} (0=Sun..6=Sat)</Text>
              </View>
              <View style={[styles.radio, settings.weekStandard === 'custom' && styles.radioSelected]} />
            </TouchableOpacity>
            {settings.weekStandard === 'custom' && (
              <View style={styles.option}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>Week Start Day</Text>
                  <Text style={styles.optionSubtext}>0=Sun … 6=Sat</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  {[0,1,2,3,4,5,6].map((d) => (
                    <TouchableOpacity key={d} onPress={() => saveSettings({ weekStartDay: d, weekStandard: 'custom' })} style={{ paddingHorizontal: 6, paddingVertical: 4 }}>
                      <Text style={{ color: settings.weekStartDay === d ? '#007AFF' : '#666', fontWeight: '600' }}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            <Text style={[styles.cardLabel, { marginTop: 12 }]}>Week 53 Handling</Text>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ week53Handling: 'merge52' })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Merge with Week 52</Text>
                <Text style={styles.optionSubtext}>Default</Text>
              </View>
              <View style={[styles.radio, settings.week53Handling === 'merge52' && styles.radioSelected]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ week53Handling: 'wrap1' })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Wrap to Week 1</Text>
              </View>
              <View style={[styles.radio, settings.week53Handling === 'wrap1' && styles.radioSelected]} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.option} onPress={() => saveSettings({ week53Handling: 'joker' })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Assign to Joker</Text>
                <Text style={styles.optionSubtext}>For 53rd week edge cases</Text>
              </View>
              <View style={[styles.radio, settings.week53Handling === 'joker' && styles.radioSelected]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Stack Configuration</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.helperText}>Choose the deck order used for reveals and mappings. Manage your own stacks in the editor.</Text>
            <Text style={styles.cardLabel}>Stack Type</Text>
            
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleStackChange('mnemonica')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Mnemonica</Text>
                <Text style={styles.optionSubtext}>Juan Tamariz stack</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  settings.stackType === 'mnemonica' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleStackChange('aronson')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Aronson</Text>
                <Text style={styles.optionSubtext}>Simon Aronson stack</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  settings.stackType === 'aronson' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleStackChange('custom')}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Custom</Text>
                <Text style={styles.optionSubtext}>Define your own labels</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  settings.stackType === 'custom' && styles.radioSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              testID="edit-custom-stack"
              accessibilityRole="button"
              style={[styles.manageBtn, { marginTop: 16 }]}
              onPress={() => {
                console.log('[Settings] Edit Custom Stack');
                router.push('/stack-editor');
              }}
            >
              <Text style={styles.manageText}>Manage Custom Stacks</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Peek Settings</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.helperText}>Quick private glance actions for rehearsal only. Has no effect on public UI.</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Enable Peek</Text>
                <Text style={styles.optionSubtext}>Two-finger tap to reveal</Text>
              </View>
              <Switch
                value={settings.peekEnabled}
                onValueChange={(value) => saveSettings({ peekEnabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Rehearsal Mode</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.helperText}>Shows private training info on the calendar so you can practice mappings. Never show during performance.</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Show Hidden Values</Text>
                <Text style={styles.optionSubtext}>Display Week→Card on calendar for practice</Text>
              </View>
              <Switch
                value={settings.rehearsalMode}
                onValueChange={(value) => saveSettings({ rehearsalMode: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Force Mode</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Force Mode lets you secretly control which month/day opens. Month snap and Day Lock can run together or separately. Use long-press on the month header, keyboard arrows, or two-finger swipe gestures to run forces.</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Enable Force Mode</Text>
                <Text style={styles.optionSubtext}>Allow snap and day lock features</Text>
              </View>
              <Switch
                value={settings.force.enabled}
                onValueChange={(value) => updateForce({ enabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Force Month</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Mode</Text>
                <Text style={styles.optionSubtext}>{settings.force.monthMode.toUpperCase()}</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {(['off','relative','absolute'] as const).map(m => (
                  <TouchableOpacity key={m} style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ monthMode: m })}>
                    <Text style={{ fontWeight: settings.force.monthMode === m ? '700' : '400', color: settings.force.monthMode === m ? '#007AFF' : '#666' }}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            {settings.force.monthMode === 'relative' && (
              <View style={styles.option}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>Relative Offset</Text>
                  <Text style={styles.optionSubtext}>from current month: {settings.force.relativeOffset}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ relativeOffset: settings.force.relativeOffset - 1 })}>
                    <Text style={{ fontSize: 18 }}>−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ relativeOffset: settings.force.relativeOffset + 1 })}>
                    <Text style={{ fontSize: 18 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Force Day</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Enable Force Day</Text>
                <Text style={styles.optionSubtext}>When locked, any tap opens your chosen day</Text>
              </View>
              <Switch
                value={settings.force.forceDayEnabled}
                onValueChange={(value) => updateForce({ forceDayEnabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Day</Text>
                <Text style={styles.optionSubtext}>1..31</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ forceDay: Math.max(1, settings.force.forceDay - 1) })}>
                  <Text style={{ fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <Text style={{ width: 36, textAlign: 'center', fontWeight: '700' }}>{settings.force.forceDay}</Text>
                <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ forceDay: Math.min(31, settings.force.forceDay + 1) })}>
                  <Text style={{ fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Invalid day fallback</Text>
                <Text style={styles.optionSubtext}>If day doesn&apos;t exist in that month</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {(['nearest','block'] as const).map(p => (
                  <TouchableOpacity key={p} style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ fallbackPolicy: p })}>
                    <Text style={{ fontWeight: settings.force.fallbackPolicy === p ? '700' : '400', color: settings.force.fallbackPolicy === p ? '#007AFF' : '#666' }}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Tap Remap (Day Lock)</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Remap scope</Text>
                <Text style={styles.optionSubtext}>Where forced day applies</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {(['forcedMonthOnly','anyVisible'] as const).map(s => (
                  <TouchableOpacity key={s} style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ remapScope: s })}>
                    <Text style={{ fontWeight: settings.force.remapScope === s ? '700' : '400', color: settings.force.remapScope === s ? '#007AFF' : '#666' }}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity style={styles.option} onPress={() => updateForce({ tapRemapMode: settings.force.tapRemapMode === 'stealth' ? 'honest' : 'stealth' })}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Tile feedback</Text>
                <Text style={styles.optionSubtext}>{settings.force.tapRemapMode === 'stealth' ? 'Stealth (default)' : 'Honest tile hint'}</Text>
              </View>
              <View style={[styles.radio, styles.radioSelected]} />
            </TouchableOpacity>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Snap Animation</Text>
            <View style={styles.option}>
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Duration</Text>
                <Text style={styles.optionSubtext}>{settings.force.snapDurationMs} ms</Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ snapDurationMs: Math.max(300, settings.force.snapDurationMs - 50) })}>
                  <Text style={{ fontSize: 18 }}>−</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingHorizontal: 8, paddingVertical: 6 }} onPress={() => updateForce({ snapDurationMs: Math.min(700, settings.force.snapDurationMs + 50) })}>
                  <Text style={{ fontSize: 18 }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Custom Month Overrides</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Replace normal content for a specific month with your curated items. When enabled, overrides take precedence for that month&apos;s Day Detail.</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Enable Month Overrides</Text>
                <Text style={styles.optionSubtext}>Replace normal content for selected months</Text>
              </View>
              <Switch
                value={settings.force.overridesEnabled}
                onValueChange={(value) => updateForce({ overridesEnabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity
              style={[styles.manageBtn, { marginTop: 16 }]}
              onPress={() => router.push('/month-overrides')}
            >
              <Text style={styles.manageText}>Open Month Overrides Editor</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Holidays</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Display national holidays on the grid. Country selection changes which labels appear. US is the default.</Text>
            <View style={styles.switchRow}>
              <View style={styles.switchContent}>
                <Text style={styles.optionText}>Show Holidays</Text>
                <Text style={styles.optionSubtext}>Display public holidays on the calendar</Text>
              </View>
              <Switch
                value={settings.holidaysEnabled}
                onValueChange={(value) => saveSettings({ holidaysEnabled: value })}
                trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <Text style={[styles.cardLabel, { marginTop: 16 }]}>Country</Text>
            {(['US','UK','CA','AU','DE','FR'] as const).map((code) => (
              <TouchableOpacity key={code} style={styles.option} onPress={() => saveSettings({ holidayCountry: code })}>
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>{code}</Text>
                  <Text style={styles.optionSubtext}>{code === 'US' ? 'United States (default)' : 'Holidays dataset'}</Text>
                </View>
                <View style={[styles.radio, settings.holidayCountry === code && styles.radioSelected]} />
              </TouchableOpacity>
            ))}

            <Text style={{ fontSize: 12, color: '#999', marginTop: 8 }}>Note: Full rules included for US. Other countries will appear as we add profiles.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Help & Guide</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.helperText}>Plain-language tips and feature explanations for all users.</Text>
            <Text style={styles.cardLabel}>Learn the App</Text>
            <TouchableOpacity
              testID="open-help"
              accessibilityRole="button"
              style={styles.option}
              onPress={() => {
                console.log('[Settings] Open Help tapped');
                router.push('/help');
              }}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionText}>Open Help</Text>
                <Text style={styles.optionSubtext}>Plain-language overview of features and tips</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>About AXIOM</Text>
          <Text style={styles.infoText}>
            A calendar and astrology app designed for performers. Forward and reverse mappings between dates, signs, and your stack.
          </Text>
          <Text style={styles.infoText}>
            Long-press the month header on the calendar to access this panel.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 12,
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
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionContent: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  optionSubtext: {
    fontSize: 14,
    color: '#999',
    letterSpacing: 0.3,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  radioSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#007AFF',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: 16,
  },
  manageBtn: { backgroundColor: '#111', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  manageText: { color: '#fff', fontWeight: '700' },
  helperText: { fontSize: 13, color: '#6B7280', lineHeight: 18, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  rowButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  smallBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
  },
  smallBtnText: { color: '#fff', fontWeight: '700' },
  btnPrimary: { backgroundColor: '#007AFF' },
  btnGhost: { backgroundColor: '#EFEFEF' },
  validationRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  validationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  validationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  previewQuote: {
    marginTop: 16,
    backgroundColor: '#111',
    borderRadius: 14,
    padding: 16,
  },
  previewQuoteText: { color: '#fff', fontSize: 16, lineHeight: 22 },
  previewQuoteAuthor: { color: '#D1D5DB', marginTop: 6, fontWeight: '600' },
  infoSection: {
    marginHorizontal: 24,
    marginTop: 32,
    marginBottom: 40,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    letterSpacing: 0.3,
    marginBottom: 12,
  },
});
