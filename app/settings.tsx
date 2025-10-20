import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Stack } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import { StackType } from '@/constants/stacks';

export default function SettingsScreen() {
  const { settings, saveSettings } = useApp();

  const handleStackChange = (stackType: StackType) => {
    saveSettings({ stackType });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Magician Panel',
          headerStyle: { backgroundColor: '#FAFAFA' },
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Week Mapping</Text>
          </View>
          <View style={styles.card}>
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
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.sectionHeader, { backgroundColor: '#00B4FF' }]}> 
            <Text style={styles.sectionTitle}>Peek Settings</Text>
          </View>

          <View style={styles.card}>
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
